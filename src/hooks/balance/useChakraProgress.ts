
import { useState, useCallback, useEffect, useRef } from 'react';
import type { ChakraName } from '@/constants/chakraData';

export const useChakraProgress = () => {
  // Initialize with empty string for chakra and 0 for progress
  const [currentChakra, setCurrentChakra] = useState<ChakraName | ''>('');
  const [progress, setProgress] = useState<number>(0);
  const previousChakraRef = useRef<ChakraName | ''>('');
  const progressUpdatedTimeRef = useRef<number>(Date.now());
  
  // Reset progress whenever chakra changes
  useEffect(() => {
    if (currentChakra !== previousChakraRef.current) {
      console.log(`useChakraProgress: Detected chakra change from ${previousChakraRef.current} to ${currentChakra}, resetting progress`);
      setProgress(0);
      previousChakraRef.current = currentChakra;
      progressUpdatedTimeRef.current = Date.now();
    }
  }, [currentChakra]);

  // Add a function to update progress with timestamp tracking
  const updateProgress = useCallback((newProgress: number) => {
    console.log(`useChakraProgress: Setting progress to ${newProgress}`);
    setProgress(newProgress);
    progressUpdatedTimeRef.current = Date.now();
  }, []);
  
  // Add a reset function for progress to ensure clean transitions
  const resetProgress = useCallback(() => {
    console.log('useChakraProgress: Explicitly resetting progress to 0');
    setProgress(0);
    progressUpdatedTimeRef.current = Date.now();
  }, []);

  // Create a wrapper for setCurrentChakra that also resets progress
  const setCurrentChakraWithReset = useCallback((chakra: ChakraName | '') => {
    console.log(`useChakraProgress: Setting current chakra to ${chakra} with automatic progress reset`);
    // Only reset if chakra is actually changing
    if (chakra !== previousChakraRef.current) {
      resetProgress();  // Reset progress first
    }
    setCurrentChakra(chakra);
  }, [resetProgress]);

  return {
    currentChakra,
    setCurrentChakra: setCurrentChakraWithReset,
    progress,
    setProgress: updateProgress,
    resetProgress
  };
};
