
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
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRemainingRef = useRef<number | null>(null);
  const isStoppingRef = useRef<boolean>(false);

  // Format time function
  const formatTime = (minutes: number) => {
    const mins = Math.floor(minutes);
    const secs = Math.round((minutes - mins) * 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Function to handle when the app goes to background
  const handleVisibilityChange = () => {
    if (document.hidden && isPlaying) {
      console.log("App went to background while a treatment was running");
      setBackgroundModeActive(true);
      
      // Save remaining time
      pausedTimeRemainingRef.current = timeRemaining;
      
      // Stop oscillators but don't reset isPlaying
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
          oscillatorRef.current = null;
        } catch (e) {
          console.error("Error stopping oscillator:", e);
        }
      }
      
      if (harmonicOscillatorRef.current) {
        try {
          harmonicOscillatorRef.current.stop();
          harmonicOscillatorRef.current = null;
        } catch (e) {
          console.error("Error stopping harmonic oscillator:", e);
        }
      }
      
      // Stop timer
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } else if (!document.hidden && backgroundModeActive) {
      console.log("App returned to foreground, restoring treatment");
      setBackgroundModeActive(false);
      
      // Restart if it was playing
      if (isPlaying && pausedTimeRemainingRef.current !== null && pausedTimeRemainingRef.current > 0) {
        console.log(`Restoring audio with ${pausedTimeRemainingRef.current.toFixed(2)} minutes remaining`);
        
        // Create new audio context and oscillators
        restartAudio();
        
        // Restore timer
        setTimeRemaining(pausedTimeRemainingRef.current);
        startTimer(pausedTimeRemainingRef.current);
        pausedTimeRemainingRef.current = null;
      }
    }
  };

  const restartAudio = () => {
    try {
      if (isStoppingRef.current) {
        console.log("Audio is currently stopping, can't restart yet");
        return;
      }

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
      const volume = intensity[0] / 100 * 0.3;
      gainNode.gain.value = volume;
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.start();
      oscillatorRef.current = oscillator;
      
      // Add harmonic for low frequencies
      if (frequency[0] < 100) {
        const harmonicOscillator = audioContextRef.current.createOscillator();
        const harmonicGainNode = audioContextRef.current.createGain();
        
        harmonicOscillator.type = 'sine';
        harmonicOscillator.frequency.value = frequency[0] * 2;
        
        harmonicGainNode.gain.value = volume * 0.75;
        
        harmonicOscillator.connect(harmonicGainNode);
        harmonicGainNode.connect(audioContextRef.current.destination);
        
        harmonicOscillator.start();
        harmonicOscillatorRef.current = harmonicOscillator;
      }
      
      console.log("Audio successfully restarted at frequency:", frequency[0]);
    } catch (error) {
      console.error("Error restarting audio:", error);
    }
  };

  const startTimer = (initialTimeMinutes: number) => {
    // Clear existing timer
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    console.log(`Starting timer with ${initialTimeMinutes} minutes`);
    startTimeRef.current = Date.now();
    
    // Set initial time
    setTimeRemaining(initialTimeMinutes);
    
    // Use window.setInterval for more accurate timing
    const intervalMS = 1000; // Update every second
    
    timerRef.current = window.setInterval(() => {
      if (!startTimeRef.current) return;
      
      const elapsedMs = Date.now() - startTimeRef.current;
      const elapsedMinutes = elapsedMs / (1000 * 60);
      const newTimeRemaining = Math.max(0, initialTimeMinutes - elapsedMinutes);
      
      setTimeRemaining(newTimeRemaining);
      
      if (newTimeRemaining <= 0) {
        console.log("Time's up, stopping audio");
        stopAudio();
      }
    }, intervalMS);
  };

  const startAudio = () => {
    console.log("startAudio called, isPlaying:", isPlaying, "isStoppingRef:", isStoppingRef.current);
    
    if (isPlaying || isStoppingRef.current) {
      console.log("Audio already playing or stopping, not starting again");
      return;
    }
    
    // Reset stopping flag
    isStoppingRef.current = false;
    
    console.log(`Starting audio with frequency: ${frequency[0]} Hz, duration: ${duration[0]} minutes`);
    
    try {
      // Stop any existing audio
      cleanupAudioResources();
      
      // Initialize audio context
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) {
        console.error("AudioContext not supported");
        return;
      }
      
      audioContextRef.current = new AudioContext();
      console.log("AudioContext created, state:", audioContextRef.current.state);
      
      // Resume the audio context (needed for browsers with autoplay policies)
      audioContextRef.current.resume().then(() => {
        console.log("AudioContext resumed successfully, state:", audioContextRef.current?.state);
        
        // Create oscillator
        const oscillator = audioContextRef.current!.createOscillator();
        const gainNode = audioContextRef.current!.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency[0];
        
        // Set volume based on intensity
        const volume = intensity[0] / 100 * 0.3;
        gainNode.gain.value = volume;
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContextRef.current!.destination);
        
        oscillator.start();
        oscillatorRef.current = oscillator;
        console.log("Main oscillator started at frequency:", frequency[0]);
        
        // Add harmonic for low frequencies
        if (frequency[0] < 100) {
          const harmonicOscillator = audioContextRef.current!.createOscillator();
          const harmonicGainNode = audioContextRef.current!.createGain();
          
          harmonicOscillator.type = 'sine';
          harmonicOscillator.frequency.value = frequency[0] * 2;
          
          harmonicGainNode.gain.value = volume * 0.75;
          
          harmonicOscillator.connect(harmonicGainNode);
          harmonicGainNode.connect(audioContextRef.current!.destination);
          
          harmonicOscillator.start();
          harmonicOscillatorRef.current = harmonicOscillator;
          console.log("Harmonic oscillator started at frequency:", frequency[0] * 2);
        }
        
        // First set isPlaying to true
        setIsPlaying(true);
        
        // Then start the timer
        const durationInMinutes = duration[0];
        startTimer(durationInMinutes);
        
        console.log("Audio treatment fully initialized with:", 
                  "Frequency:", frequency[0], 
                  "Duration:", durationInMinutes, "minutes");
        
      }).catch(error => {
        console.error("Failed to resume AudioContext:", error);
        alert("No se pudo iniciar el audio. Por favor, interactúe con la página primero (haga clic en algún lugar) e inténtelo nuevamente.");
      });
      
    } catch (error) {
      console.error("Error starting audio treatment:", error);
      alert("No se pudo iniciar el tratamiento de audio. Asegúrese de que su dispositivo sea compatible con Web Audio API.");
    }
  };

  const cleanupAudioResources = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        console.log("Main oscillator stopped");
      } catch (e) {
        console.error("Error stopping oscillator:", e);
      }
      oscillatorRef.current = null;
    }
    
    if (harmonicOscillatorRef.current) {
      try {
        harmonicOscillatorRef.current.stop();
        console.log("Harmonic oscillator stopped");
      } catch (e) {
        console.error("Error stopping harmonic oscillator:", e);
      }
      harmonicOscillatorRef.current = null;
    }
    
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
        console.log("Audio context closed");
      } catch (e) {
        console.error("Error closing audio context:", e);
      }
      audioContextRef.current = null;
    }
    
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
      console.log("Timer cleared");
    }
  };

  const stopAudio = () => {
    console.log("Stopping treatment audio...");
    
    // Set the stopping flag to prevent race conditions
    isStoppingRef.current = true;
    
    // Clean up audio resources
    cleanupAudioResources();
    
    // Reset state after a small delay to ensure UI updates properly
    setTimeout(() => {
      setIsPlaying(false);
      setBackgroundModeActive(false);
      pausedTimeRemainingRef.current = null;
      startTimeRef.current = null;
      isStoppingRef.current = false;
      console.log("Audio treatment fully stopped");
    }, 100);
  };

  // Add event listener for visibility change
  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    console.log("Visibility change listener added");
    
    // Cleanup when unmounting
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stopAudio();
      console.log("useTreatmentAudio hook cleaned up");
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
