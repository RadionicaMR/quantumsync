
import { useRef, useCallback } from 'react';
import { CHAKRA_FREQUENCIES } from '@/constants/chakraData';
import type { ChakraName } from '@/constants/chakraData';

export const useChakraAudio = () => {
  const audioContext = useRef<AudioContext | null>(null);
  const oscillator = useRef<OscillatorNode | null>(null);
  const gainNode = useRef<GainNode | null>(null);

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
    
    // Create and configure a new oscillator
    if (audioContext.current && gainNode.current) {
      oscillator.current = audioContext.current.createOscillator();
      oscillator.current.type = 'sine';
      oscillator.current.frequency.value = CHAKRA_FREQUENCIES[chakraName];
      oscillator.current.connect(gainNode.current);
      oscillator.current.start();
      
      console.log(`Playing frequency ${CHAKRA_FREQUENCIES[chakraName]} Hz for chakra ${chakraName}`);
    }
  }, []);

  const stopSound = useCallback(() => {
    if (oscillator.current) {
      oscillator.current.stop();
      oscillator.current.disconnect();
      oscillator.current = null;
    }
  }, []);

  return { playChakraSound, stopSound };
};
