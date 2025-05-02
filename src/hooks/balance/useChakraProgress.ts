
import { useState, useCallback, useEffect, useRef } from 'react';
import type { ChakraName } from '@/constants/chakraData';

export const useChakraProgress = () => {
  // Initialize with empty string for chakra and 0 for progress
  const [currentChakra, setCurrentChakra] = useState<ChakraName | ''>('');
  const [progress, setProgress] = useState<number>(0);
  const previousChakraRef = useRef<ChakraName | ''>('');
  
  // Reset progress whenever chakra changes
  useEffect(() => {
    if (currentChakra !== previousChakraRef.current) {
      console.log(`useChakraProgress detected chakra change from ${previousChakraRef.current} to ${currentChakra}, resetting progress`);
      setProgress(0);
      previousChakraRef.current = currentChakra;
    }
  }, [currentChakra]);
  
  // Add a reset function for progress to ensure clean transitions
  const resetProgress = useCallback(() => {
    console.log('Explicitly resetting progress to 0');
    setProgress(0);
  }, []);

  // Create a wrapper for setCurrentChakra that also resets progress
  const setCurrentChakraWithReset = useCallback((chakra: ChakraName | '') => {
    console.log(`Setting current chakra to ${chakra} with automatic progress reset`);
    setProgress(0);  // Reset progress first
    setCurrentChakra(chakra);
  }, []);

  return {
    currentChakra,
    setCurrentChakra: setCurrentChakraWithReset,
    progress,
    setProgress,
    resetProgress
  };
};
