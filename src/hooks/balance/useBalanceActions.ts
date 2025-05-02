
import { useCallback } from 'react';
import type { ChakraName } from '@/constants/chakraData';

export const useBalanceActions = () => {
  // Start balancing chakras
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
    notifyStart: (personName?: string) => void  // Update the signature to make personName optional
  ) => {
    // Check if we have a person name
    if (!personName.trim()) {
      notifyMissingName();
      return;
    }
    
    // Get chakras to balance
    const chakrasToBalance = getChakrasToBalance();
    
    // Check if we have chakras to balance
    if (!chakrasToBalance.length) {
      notifyNoChakras();
      return;
    }
    
    console.log(`Starting balancing for ${personName} with chakras: ${chakrasToBalance.join(', ')}`);
    
    // Cleanup any existing timers
    cleanupTimers();
    
    // Reset state
    isTransitioning.current = false;
    setLastTransitionTime(Date.now());
    lastChakraProcessed.current = null;
    
    // Set playing state and clear completed
    setIsPlaying(true);
    setCompleted(false);
    
    // Reset current chakra and progress
    setCurrentChakra('');
    setProgress(0);
    
    // Notify start with the personName
    notifyStart(personName);
    
    // CRITICAL FIX: Use a small timeout to ensure state updates are processed
    setTimeout(() => {
      // Start first chakra immediately
      moveToNextChakra();
    }, 500);
  }, []);

  // Stop balancing chakras
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
    
    // Stop sound
    stopSound();
    
    // Reset state
    setIsPlaying(false);
    setCurrentChakra('');
    setProgress(0);
    lastChakraProcessed.current = null;
    
    // Notify stop
    notifyStop();
  }, []);

  return {
    startBalancing,
    stopBalancing
  };
};
