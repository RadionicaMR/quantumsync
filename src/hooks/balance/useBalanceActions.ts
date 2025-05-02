
import { useCallback } from 'react';
import type { ChakraName } from '@/constants/chakraData';

export const useBalanceActions = () => {
  const startBalancing = useCallback((
    personName: string,
    getChakrasToBalance: () => ChakraName[],
    cleanupTimers: () => void,
    isTransitioning: React.MutableRefObject<boolean>,
    setLastTransitionTime: (time: number) => void,
    lastChakraProcessed: React.MutableRefObject<string | null>,
    setIsPlaying: (value: boolean) => void,
    setCurrentChakra: (value: ChakraName | '') => void,
    setProgress: (value: number) => void,
    setCompleted: (value: boolean) => void,
    handleChakraTransition: (
      currentChakra: ChakraName | '',
      nextChakra: ChakraName,
      isPlaying: boolean,
      duration: number[],
      setProgress: (progress: number) => void,
      onComplete: () => void
    ) => void,
    moveToNextChakra: () => void,
    duration: number[],
    notifyMissingName: () => void,
    notifyNoChakras: () => void,
    notifyStart: (personName: string) => void
  ) => {
    if (!personName.trim()) {
      notifyMissingName();
      return;
    }
    
    const chakrasToBalance = getChakrasToBalance();
    
    if (chakrasToBalance.length === 0) {
      notifyNoChakras();
      return;
    }
    
    // Clean up any existing timers
    cleanupTimers();
    
    // Reset transition state and time
    isTransitioning.current = false;
    setLastTransitionTime(0);
    lastChakraProcessed.current = null;
    
    // Set up initial state
    const firstChakra = chakrasToBalance[0];
    setIsPlaying(true);
    setCurrentChakra(firstChakra);
    setProgress(0);
    setCompleted(false);
    
    // Handle transition to first chakra
    handleChakraTransition(
      '',
      firstChakra,
      true,
      duration,
      setProgress,
      moveToNextChakra
    );
    
    notifyStart(personName);
    
    console.log(`Starting chakra balance with first chakra: ${firstChakra}`);
  }, []);

  const stopBalancing = useCallback((
    cleanupTimers: () => void,
    setIsPlaying: (value: boolean) => void,
    setCurrentChakra: (value: ChakraName | '') => void,
    setProgress: (value: number) => void,
    lastChakraProcessed: React.MutableRefObject<string | null>,
    stopSound: () => void,
    notifyStop: () => void
  ) => {
    // Clean up timers
    cleanupTimers();
    
    // Reset state
    setIsPlaying(false);
    setCurrentChakra('');
    setProgress(0);
    lastChakraProcessed.current = null;
    
    // Stop audio
    stopSound();
    
    notifyStop();
  }, []);

  return {
    startBalancing,
    stopBalancing
  };
};
