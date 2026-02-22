
import { useState, useCallback, useEffect, useRef } from 'react';
import type { ChakraName } from '@/constants/chakraData';

export const useChakraProgress = () => {
  const [currentChakra, setCurrentChakra] = useState<ChakraName | ''>('');
  const [progress, setProgress] = useState<number>(0);
  const previousChakraRef = useRef<ChakraName | ''>('');
  const progressUpdatedTimeRef = useRef<number>(Date.now());
  const isTransitioningToNextChakra = useRef<boolean>(false);
  
  useEffect(() => {
    if (currentChakra !== previousChakraRef.current) {
      setProgress(0);
      previousChakraRef.current = currentChakra;
      progressUpdatedTimeRef.current = Date.now();
      isTransitioningToNextChakra.current = false;
    }
  }, [currentChakra]);

  const updateProgress = useCallback((newProgress: number) => {
    if (newProgress === 100) {
      isTransitioningToNextChakra.current = true;
    }
    setProgress(newProgress);
    progressUpdatedTimeRef.current = Date.now();
  }, []);
  
  const resetProgress = useCallback(() => {
    setProgress(0);
    progressUpdatedTimeRef.current = Date.now();
    isTransitioningToNextChakra.current = false;
  }, []);

  const setCurrentChakraWithReset = useCallback((chakra: ChakraName | '') => {
    setCurrentChakra(chakra);
    if (chakra !== previousChakraRef.current) {
      resetProgress();
    }
  }, [resetProgress]);

  return {
    currentChakra,
    setCurrentChakra: setCurrentChakraWithReset,
    progress,
    setProgress: updateProgress,
    resetProgress,
    isTransitioningToNextChakra
  };
};
