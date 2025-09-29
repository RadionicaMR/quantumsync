
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
    // Clear any existing monitor
    if (audioMonitorIntervalRef.current) {
      window.clearInterval(audioMonitorIntervalRef.current);
    }

    console.log("Starting chakra audio monitor to prevent audio cuts");
    
    audioMonitorIntervalRef.current = window.setInterval(() => {
      if (!isPlayingRef.current || !currentChakraRef.current) {
        return;
      }

      const context = audioContext.current;
      if (!context) {
        console.warn("Chakra audio context lost");
        return;
      }

      // Check if audio context is suspended and resume it
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

      // Verify oscillator is still active
      const osc = oscillator.current;
      
      if (!osc && currentChakraRef.current) {
        console.warn("Chakra oscillator lost - attempting restart");
        playChakraSound(currentChakraRef.current);
      }
    }, 2000); // Check every 2 seconds
  }, []);

  const stopAudioMonitor = useCallback(() => {
    if (audioMonitorIntervalRef.current) {
      window.clearInterval(audioMonitorIntervalRef.current);
      audioMonitorIntervalRef.current = null;
      console.log("Chakra audio monitor stopped");
    }
  }, []);

  const playChakraSound = useCallback((chakraName: ChakraName) => {
    if (!audioContext.current || audioContext.current.state === 'closed') {
      audioContext.current = new AudioContext();
      gainNode.current = audioContext.current.createGain();
      gainNode.current.gain.value = 0.3;
      gainNode.current.connect(audioContext.current.destination);
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
      
      console.log(`Playing frequency ${CHAKRA_FREQUENCIES[chakraName]} Hz for chakra ${chakraName}`);
      
      // Start audio monitoring to prevent cuts
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

  return { playChakraSound, stopSound };
};
