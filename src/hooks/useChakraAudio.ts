
import { useRef, useCallback } from 'react';
import { CHAKRA_FREQUENCIES } from '@/constants/chakraData';
import type { ChakraName } from '@/constants/chakraData';

export const useChakraAudio = () => {
  const audioContext = useRef<AudioContext | null>(null);
  const oscillator = useRef<OscillatorNode | null>(null);
  const gainNode = useRef<GainNode | null>(null);
  const audioMonitorIntervalRef = useRef<number | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const currentChakraRef = useRef<ChakraName | null>(null);

  const startAudioMonitor = useCallback(() => {
    if (audioMonitorIntervalRef.current) {
      window.clearInterval(audioMonitorIntervalRef.current);
    }

    
    
    audioMonitorIntervalRef.current = window.setInterval(() => {
      if (!isPlayingRef.current || !currentChakraRef.current) {
        return;
      }

      const context = audioContext.current;
      if (!context) {
        console.warn("Chakra audio context lost");
        return;
      }

      if (context.state === 'suspended') {
        console.warn("Chakra audio context suspended - resuming...");
        context.resume()
          .then(() => {
            console.log("Chakra audio context resumed successfully");
          })
          .catch(err => {
            console.error("Failed to resume chakra audio context:", err);
          });
      }

      const osc = oscillator.current;
      
      if (!osc && currentChakraRef.current) {
        console.warn("Chakra oscillator lost - attempting restart");
        playChakraSound(currentChakraRef.current);
      }
    }, 2000);
  }, []);

  const stopAudioMonitor = useCallback(() => {
    if (audioMonitorIntervalRef.current) {
      window.clearInterval(audioMonitorIntervalRef.current);
      audioMonitorIntervalRef.current = null;
      
    }
  }, []);

  // CRITICAL: Pre-initialize AudioContext within user gesture for Safari compatibility
  const initAudio = useCallback(() => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) {
      console.error("AudioContext not supported");
      return;
    }
    
    if (!audioContext.current || audioContext.current.state === 'closed') {
      audioContext.current = new AudioContextClass();
      gainNode.current = audioContext.current.createGain();
      gainNode.current.gain.value = 0.3;
      gainNode.current.connect(audioContext.current.destination);
      
    }
    
    // Resume within user gesture - critical for Safari
    audioContext.current.resume().catch(err => {
      console.error("Failed to resume chakra AudioContext:", err);
    });
    
  }, []);

  const playChakraSound = useCallback((chakraName: ChakraName) => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) {
      console.error("AudioContext not supported");
      return;
    }
    
    if (!audioContext.current || audioContext.current.state === 'closed') {
      audioContext.current = new AudioContextClass();
      audioContext.current.resume().catch(err => console.error("Resume failed:", err));
      gainNode.current = audioContext.current.createGain();
      gainNode.current.gain.value = 0.3;
      gainNode.current.connect(audioContext.current.destination);
    } else if (audioContext.current.state === 'suspended') {
      audioContext.current.resume().catch(err => console.error("Resume failed:", err));
    }
    
    // Stop any current sound
    if (oscillator.current) {
      oscillator.current.stop();
      oscillator.current.disconnect();
      oscillator.current = null;
    }
    
    // Save current chakra for monitoring
    currentChakraRef.current = chakraName;
    isPlayingRef.current = true;
    
    // Create and configure a new oscillator
    if (audioContext.current && gainNode.current) {
      oscillator.current = audioContext.current.createOscillator();
      oscillator.current.type = 'sine';
      oscillator.current.frequency.value = CHAKRA_FREQUENCIES[chakraName];
      oscillator.current.connect(gainNode.current);
      oscillator.current.start();
      
      startAudioMonitor();
    }
  }, [startAudioMonitor]);

  const stopSound = useCallback(() => {
    isPlayingRef.current = false;
    currentChakraRef.current = null;
    
    // Stop audio monitoring
    stopAudioMonitor();
    
    if (oscillator.current) {
      oscillator.current.stop();
      oscillator.current.disconnect();
      oscillator.current = null;
    }
  }, [stopAudioMonitor]);

  return { playChakraSound, stopSound, initAudio };
};
