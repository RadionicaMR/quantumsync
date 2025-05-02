
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
    
    // Prevent multiple calls while processing
    if (isProcessingNextChakra.current) {
      console.log("Already processing next chakra, ignoring duplicate call");
      return;
    }
    
    // Set processing flag
    isProcessingNextChakra.current = true;
    
    // Force playing state check locally
    const localIsPlaying = isPlaying;
    if (!localIsPlaying) {
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
    
    // CRITICAL FIX: Force a small delay before proceeding with transition
    // This ensures previous operations are completed
    setTimeout(() => {
      // Double-check if we're still playing to prevent post-stop transitions
      if (!localIsPlaying) {
        console.log("Not playing anymore, skipping transition");
        isProcessingNextChakra.current = false;
        return;
      }
      
      // Check if we have more chakras to process
      if (currentIndex < chakrasToBalance.length - 1) {
        // Always clean up existing timers before transition
        cleanupTimers();
        stopSound();
        
        // Get next chakra
        const nextChakra = chakrasToBalance[currentIndex + 1];
        console.log(`Moving to next chakra: ${nextChakra}`);
        
        // Update current chakra first
        setCurrentChakra(nextChakra);
        
        // Important: Set isTransitioning to true BEFORE any other operations
        isTransitioning.current = true;
        
        // CRITICAL FIX: Small delay to ensure state updates before transition
        setTimeout(() => {
          // Handle transition to next chakra
          handleChakraTransition(
            currentChakra || '',
            nextChakra,
            localIsPlaying,
            duration,
            setProgress,
            () => {
              console.log(`Chakra ${nextChakra} completed, moving to next`);
              // Reset processing flag for next call
              isProcessingNextChakra.current = false;
              
              moveToNextChakra(
                localIsPlaying,
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
          );
          
          // Update last chakra processed for tracking
          lastChakraProcessed.current = nextChakra;
        }, 100);
        
      } else {
        // Session completed
        completeSessionFn();
        isProcessingNextChakra.current = false;
      }
    }, 200);
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
