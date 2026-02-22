
import { useRef, useState, useEffect, useCallback } from 'react';
import { ManifestAudio } from './types';

export const useManifestAudio = (): ManifestAudio & {
  backgroundModeActive: boolean;
} => {
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const harmonicOscillatorRef = useRef<OscillatorNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [backgroundModeActive, setBackgroundModeActive] = useState(false);
  const currentFrequencyRef = useRef<number | null>(null);
  const audioMonitorIntervalRef = useRef<number | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  // CRITICAL FIX: Use ref for backgroundModeActive to prevent stale closure in visibility handler
  const bgActiveRef = useRef(false);

  // Keep ref in sync
  useEffect(() => { bgActiveRef.current = backgroundModeActive; }, [backgroundModeActive]);

  // Function to monitor and maintain audio playback
  const startAudioMonitor = () => {
    if (audioMonitorIntervalRef.current) {
      window.clearInterval(audioMonitorIntervalRef.current);
    }

    audioMonitorIntervalRef.current = window.setInterval(() => {
      if (!isPlayingRef.current) return;

      const context = audioContextRef.current;
      if (!context) return;

      if (context.state === 'suspended') {
        context.resume().catch(err => {
          console.error("Failed to resume manifestation audio context:", err);
        });
      }

      const mainOsc = oscillatorRef.current;
      if (!mainOsc && currentFrequencyRef.current !== null) {
        startAudio(currentFrequencyRef.current);
      }
    }, 2000);
  };

  const stopAudioMonitor = () => {
    if (audioMonitorIntervalRef.current) {
      window.clearInterval(audioMonitorIntervalRef.current);
      audioMonitorIntervalRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudioMonitor();
      stopAudio();
    }
  }, []);

  // CRITICAL FIX: Stable visibility handler using refs - no stale closures, never re-created
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden && isPlayingRef.current) {
      setBackgroundModeActive(true);
    } else if (!document.hidden && bgActiveRef.current) {
      setBackgroundModeActive(false);
    }
  }, []);

  // Single stable listener - never re-registered
  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleVisibilityChange]);

  const startAudio = (frequency: number) => {
    try {
      currentFrequencyRef.current = frequency;
      isPlayingRef.current = true;
      
      // Clean up previous audio resources synchronously (Safari needs this in user gesture)
      if (oscillatorRef.current) {
        try { oscillatorRef.current.stop(); } catch(e) {}
        oscillatorRef.current = null;
      }
      if (harmonicOscillatorRef.current) {
        try { harmonicOscillatorRef.current.stop(); } catch(e) {}
        harmonicOscillatorRef.current = null;
      }
      if (audioContextRef.current) {
        try { audioContextRef.current.close(); } catch(e) {}
        audioContextRef.current = null;
      }
      
      // CRITICAL: Create AudioContext synchronously within user gesture for Safari
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        console.error("AudioContext not supported");
        return;
      }
      audioContextRef.current = new AudioContextClass();
      
      // Resume synchronously - Safari requires this in user gesture handler
      audioContextRef.current.resume().catch(err => {
        console.error("Failed to resume manifest AudioContext:", err);
      });
      
      // Create oscillator for base frequency
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gainNode.gain.value = 0.3;
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.start();
      oscillatorRef.current = oscillator;
      
      // For low frequencies, add a harmonic to make it more audible on small speakers
      if (frequency < 100) {
        const harmonicOscillator = audioContextRef.current.createOscillator();
        const harmonicGainNode = audioContextRef.current.createGain();
        
        harmonicOscillator.type = 'sine';
        harmonicOscillator.frequency.value = frequency * 2;
        harmonicGainNode.gain.value = 0.2;
        
        harmonicOscillator.connect(harmonicGainNode);
        harmonicGainNode.connect(audioContextRef.current.destination);
        
        harmonicOscillator.start();
        harmonicOscillatorRef.current = harmonicOscillator;
      }
      
      // Start audio monitoring to prevent cuts
      startAudioMonitor();
    } catch (error) {
      console.error("Error starting manifestation audio:", error);
    }
  };

  const stopAudio = () => {
    isPlayingRef.current = false;
    stopAudioMonitor();
    
    if (oscillatorRef.current) {
      try { oscillatorRef.current.stop(); } catch (e) {}
      oscillatorRef.current = null;
    }
    
    if (harmonicOscillatorRef.current) {
      try { harmonicOscillatorRef.current.stop(); } catch (e) {}
      harmonicOscillatorRef.current = null;
    }
    
    if (audioContextRef.current) {
      try { audioContextRef.current.close(); } catch (e) {}
      audioContextRef.current = null;
    }
    
    currentFrequencyRef.current = null;
    setBackgroundModeActive(false);
  };

  return {
    oscillatorRef,
    audioContextRef,
    startAudio,
    stopAudio,
    backgroundModeActive
  };
};
