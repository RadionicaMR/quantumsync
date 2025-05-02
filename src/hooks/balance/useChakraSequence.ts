
import { useState, useCallback, useRef } from 'react';
import type { ChakraName } from '@/constants/chakraData';

export const useChakraSequence = () => {
  // State for transition control
  const [lastTransitionTime, setLastTransitionTime] = useState<number>(0);
  const lastChakraProcessed = useRef<string | null>(null);
  const isProcessingNextChakra = useRef<boolean>(false);
  
  const completeSession = useCallback((
    setIsPlaying: (value: boolean) => void,
    setCompleted: (value: boolean) => void,
    setCurrentChakra: (value: ChakraName | '') => void,
    setProgress: (value: number) => void,
    stopSound: () => void,
    notifyCompletion: () => void,
    recordSession: () => void,
    isTransitioning: React.MutableRefObject<boolean>
  ) => {
    console.log("All chakras have been balanced");
    
    // Update states
    setIsPlaying(false);
    setCompleted(true);
    setCurrentChakra('');
    setProgress(0);
    
    // Stop sound and notify
    stopSound();
    notifyCompletion();
    
    // Record session
    recordSession();
    
    // Reset transition flag
    isTransitioning.current = false;
    lastChakraProcessed.current = null;
    isProcessingNextChakra.current = false;
  }, []);

  const moveToNextChakra = useCallback((
    isPlaying: boolean,
    currentChakra: ChakraName | '',
    getChakrasToBalance: () => ChakraName[],
    isTransitioning: React.MutableRefObject<boolean>,
    cleanupTimers: () => void,
    stopSound: () => void,
    setCurrentChakra: (chakra: ChakraName | '') => void,
    setProgress: (progress: number) => void,
    handleChakraTransition: (
      currentChakra: ChakraName | '',
      nextChakra: ChakraName,
      isPlaying: boolean,
      duration: number[],
      setProgress: (progress: number) => void,
      onComplete: () => void
    ) => void,
    completeSessionFn: () => void,
    duration: number[]
  ) => {
    console.log("moveToNextChakra called, isPlaying:", isPlaying);
    
    // CRITICAL FIX: Prevent multiple calls while processing with more robust check
    if (isProcessingNextChakra.current) {
      console.log("Already processing next chakra, ignoring duplicate call");
      return;
    }
    
    // Set processing flag
    isProcessingNextChakra.current = true;
    
    // Force playing state check
    if (!isPlaying) {
      console.log("Not playing anymore, skipping transition");
      isProcessingNextChakra.current = false;
      return;
    }
    
    // Get updated list of chakras to balance
    const chakrasToBalance = getChakrasToBalance();
    console.log("Chakras to balance:", chakrasToBalance);
    
    // If no chakras to process, finish
    if (!chakrasToBalance || chakrasToBalance.length === 0) {
      console.log("No chakras to balance, completing session");
      completeSessionFn();
      isProcessingNextChakra.current = false;
      return;
    }
    
    // Find current index
    const currentIndex = currentChakra ? chakrasToBalance.indexOf(currentChakra as ChakraName) : -1;
    console.log(`Current chakra: ${currentChakra}, Index: ${currentIndex}, Total: ${chakrasToBalance.length}`);
    
    // CRITICAL FIX: Use cleaner approach to transition
    if (currentIndex < chakrasToBalance.length - 1) {
      // Always clean up existing timers before transition
      cleanupTimers();
      stopSound();
      
      // Get next chakra
      const nextChakra = chakrasToBalance[currentIndex + 1];
      console.log(`Moving to next chakra: ${nextChakra}`);
      
      // Update current chakra first
      setCurrentChakra(nextChakra);
      
      // Set isTransitioning to true
      isTransitioning.current = true;
      
      // Create a nested completion callback for cleaner transition
      const onChakraComplete = () => {
        console.log(`Chakra ${nextChakra} completed, moving to next`);
        
        // Reset processing flag
        isProcessingNextChakra.current = false;
        
        // Record last processed
        lastChakraProcessed.current = nextChakra;
        
        // Continue to next chakra if still playing
        if (isPlaying) {
          // This will be picked up by the next call
          moveToNextChakra(
            isPlaying,
            nextChakra,
            getChakrasToBalance,
            isTransitioning,
            cleanupTimers,
            stopSound,
            setCurrentChakra,
            setProgress,
            handleChakraTransition,
            completeSessionFn,
            duration
          );
        }
      };
      
      // Short delay before transition to ensure UI is ready
      setTimeout(() => {
        // Double check if we're still playing
        if (!isPlaying) {
          isProcessingNextChakra.current = false;
          isTransitioning.current = false;
          return;
        }
        
        // Handle transition to next chakra
        handleChakraTransition(
          currentChakra || '',
          nextChakra,
          isPlaying,
          duration,
          setProgress,
          onChakraComplete
        );
      }, 200);
      
    } else {
      // Session completed
      completeSessionFn();
      isProcessingNextChakra.current = false;
    }
  }, []);

  return {
    lastTransitionTime,
    setLastTransitionTime,
    lastChakraProcessed,
    isProcessingNextChakra,
    completeSession,
    moveToNextChakra
  };
};
