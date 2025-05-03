
import { useState, useRef, useEffect } from 'react';

export const useTreatmentAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [frequency, setFrequency] = useState([528]);
  const [duration, setDuration] = useState([5]);
  const [intensity, setIntensity] = useState([50]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [useHeadphones, setUseHeadphones] = useState(true);
  const [backgroundModeActive, setBackgroundModeActive] = useState(false);

  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const harmonicOscillatorRef = useRef<OscillatorNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRemainingRef = useRef<number | null>(null);

  const formatTime = (minutes: number) => {
    const mins = Math.floor(minutes);
    const secs = Math.round((minutes - mins) * 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Function to handle when the app goes to background
  const handleVisibilityChange = () => {
    if (document.hidden && isPlaying) {
      console.log("App pasó a segundo plano mientras se ejecutaba un tratamiento");
      setBackgroundModeActive(true);
      
      // Save remaining time when paused
      pausedTimeRemainingRef.current = timeRemaining;
      
      // Current oscillator must stop because AudioContext is suspended
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
        } catch (e) {
          console.error("Error stopping oscillator:", e);
        }
        oscillatorRef.current = null;
      }
      
      if (harmonicOscillatorRef.current) {
        try {
          harmonicOscillatorRef.current.stop();
        } catch (e) {
          console.error("Error stopping harmonic oscillator:", e);
        }
        harmonicOscillatorRef.current = null;
      }
      
      // Stop current timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } else if (!document.hidden && backgroundModeActive) {
      console.log("App volvió al primer plano, restaurando tratamiento");
      setBackgroundModeActive(false);
      
      // Restart playback if it was playing
      if (isPlaying && pausedTimeRemainingRef.current !== null) {
        // Create a new context and oscillators
        restartAudio();
        
        // Restore the timer
        setTimeRemaining(pausedTimeRemainingRef.current);
        startTimer(pausedTimeRemainingRef.current);
        pausedTimeRemainingRef.current = null;
      }
    }
  };

  const restartAudio = () => {
    try {
      // Initialize audio context
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) {
        console.error("AudioContext not supported");
        return;
      }
      
      audioContextRef.current = new AudioContext();
      
      // Create oscillator
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency[0];
      
      // Set volume based on intensity
      const volume = intensity[0] / 100 * 0.3; // max volume 0.3 to protect hearing
      gainNode.gain.value = volume;
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.start();
      oscillatorRef.current = oscillator;
      
      // If frequency is low, add harmonic to improve audibility on small devices
      if (frequency[0] < 100) {
        const harmonicOscillator = audioContextRef.current.createOscillator();
        const harmonicGainNode = audioContextRef.current.createGain();
        
        // Create harmonic at 2x the frequency with lower volume
        harmonicOscillator.type = 'sine';
        harmonicOscillator.frequency.value = frequency[0] * 2;
        
        // Harmonic volume proportional to main volume
        harmonicGainNode.gain.value = volume * 0.75;
        
        harmonicOscillator.connect(harmonicGainNode);
        harmonicGainNode.connect(audioContextRef.current.destination);
        
        harmonicOscillator.start();
        harmonicOscillatorRef.current = harmonicOscillator;
      }
      
      console.log("Audio restarted successfully at frequency:", frequency[0]);
    } catch (error) {
      console.error("Error restarting audio:", error);
    }
  };

  const startTimer = (initialTime: number) => {
    startTimeRef.current = Date.now();
    
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1/60;
        if (newTime <= 0) {
          stopAudio();
          return 0;
        }
        return newTime;
      });
    }, 1000);
  };

  const startAudio = () => {
    if (isPlaying) return;
    
    try {
      // Initialize audio context
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) {
        console.error("AudioContext not supported");
        return;
      }
      
      audioContextRef.current = new AudioContext();
      
      // Create oscillator
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency[0];
      
      // Set volume based on intensity
      const volume = intensity[0] / 100 * 0.3; // max volume 0.3 to protect hearing
      gainNode.gain.value = volume;
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.start();
      oscillatorRef.current = oscillator;
      
      // If frequency is low, add harmonic to improve audibility on small devices
      if (frequency[0] < 100) {
        const harmonicOscillator = audioContextRef.current.createOscillator();
        const harmonicGainNode = audioContextRef.current.createGain();
        
        // Create harmonic at 2x the frequency with lower volume
        harmonicOscillator.type = 'sine';
        harmonicOscillator.frequency.value = frequency[0] * 2;
        
        // Harmonic volume proportional to main volume
        harmonicGainNode.gain.value = volume * 0.75;
        
        harmonicOscillator.connect(harmonicGainNode);
        harmonicGainNode.connect(audioContextRef.current.destination);
        
        harmonicOscillator.start();
        harmonicOscillatorRef.current = harmonicOscillator;
      }
      
      // Start timer
      setTimeRemaining(duration[0]);
      startTimer(duration[0]);
      
      setIsPlaying(true);
      console.log("Audio started successfully at frequency:", frequency[0]);
    } catch (error) {
      console.error("Error starting audio treatment:", error);
      alert("No se pudo iniciar el tratamiento de audio. Asegúrese de que su dispositivo sea compatible con Web Audio API.");
    }
  };

  const stopAudio = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
      } catch (e) {
        console.error("Error stopping oscillator:", e);
      }
      oscillatorRef.current = null;
    }
    
    if (harmonicOscillatorRef.current) {
      try {
        harmonicOscillatorRef.current.stop();
      } catch (e) {
        console.error("Error stopping harmonic oscillator:", e);
      }
      harmonicOscillatorRef.current = null;
    }
    
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {
        console.error("Error closing audio context:", e);
      }
      audioContextRef.current = null;
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsPlaying(false);
    setBackgroundModeActive(false);
    pausedTimeRemainingRef.current = null;
    console.log("Audio stopped");
  };

  // Add event listener for visibilitychange
  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup when unmounting
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
        } catch (e) {
          console.error("Error stopping oscillator during cleanup:", e);
        }
      }
      if (harmonicOscillatorRef.current) {
        try {
          harmonicOscillatorRef.current.stop();
        } catch (e) {
          console.error("Error stopping harmonic oscillator during cleanup:", e);
        }
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, backgroundModeActive]);

  return {
    isPlaying,
    frequency,
    setFrequency,
    duration,
    setDuration,
    intensity,
    setIntensity,
    timeRemaining,
    useHeadphones,
    setUseHeadphones,
    formatTime,
    startAudio,
    stopAudio,
    backgroundModeActive
  };
};
