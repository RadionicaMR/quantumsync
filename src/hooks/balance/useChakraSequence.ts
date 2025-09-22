
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
    isPlayingRef: React.MutableRefObject<boolean>,
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
    console.log("moveToNextChakra called, isPlayingRef:", isPlayingRef.current);
    
    // CRITICAL FIX: Use the ref for the playing state which is more reliable during transitions
    const effectiveIsPlaying = isPlayingRef.current || isPlaying;
    
    // CRITICAL FIX: Prevent multiple calls while processing with more robust check
    if (isProcessingNextChakra.current) {
      console.log("Already processing next chakra, ignoring duplicate call");
      return;
    }
    
    // Set processing flag
    isProcessingNextChakra.current = true;
    
    // Force playing state check
    if (!effectiveIsPlaying) {
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
    
    // CRITICAL FIX: Handle the case where we're starting fresh (no current chakra)
    if (currentChakra === '') {
      const firstChakra = chakrasToBalance[0];
      console.log(`Starting fresh with first chakra: ${firstChakra}`);
      
      // Set current chakra
      setCurrentChakra(firstChakra);
      
      // Set isTransitioning to true
      isTransitioning.current = true;
      
      // Create completion callback that moves to next chakra
      const onFirstChakraComplete = () => {
        console.log(`First chakra ${firstChakra} completed`);
        isProcessingNextChakra.current = false;
        
        // Move to next chakra if there are more and still playing
        if (chakrasToBalance.length > 1 && isPlayingRef.current) {
          setTimeout(() => {
            moveToNextChakra(
              isPlayingRef.current,
              firstChakra,
              getChakrasToBalance,
              isTransitioning,
              isPlayingRef,
              cleanupTimers,
              stopSound,
              setCurrentChakra,
              setProgress,
              handleChakraTransition,
              completeSessionFn,
              duration
            );
          }, 100);
        } else if (chakrasToBalance.length === 1) {
          // Only one chakra, complete session
          completeSessionFn();
        }
      };
      
      // Handle transition to first chakra with minimal delay
      setTimeout(() => {
        if (!isPlayingRef.current) {
          isProcessingNextChakra.current = false;
          isTransitioning.current = false;
          return;
        }
        
        handleChakraTransition(
          '',
          firstChakra,
          effectiveIsPlaying,
          duration,
          setProgress,
          onFirstChakraComplete
        );
      }, 100);
      
      return;
    }
    
    // Find current index for existing chakra
    const currentIndex = chakrasToBalance.indexOf(currentChakra as ChakraName);
    console.log(`Current chakra: ${currentChakra}, Index: ${currentIndex}, Total: ${chakrasToBalance.length}`);
    
    // Check if we're on the last chakra
    if (currentIndex === chakrasToBalance.length - 1) {
      console.log("On last chakra, completing session");
      completeSessionFn();
      isProcessingNextChakra.current = false;
      return;
    }
    
    // Move to next chakra
    if (currentIndex >= 0 && currentIndex < chakrasToBalance.length - 1) {
      // Always clean up existing timers before transition
      cleanupTimers();
      stopSound();
      
      // Get next chakra
      const nextChakra = chakrasToBalance[currentIndex + 1];
      console.log(`Moving to next chakra: ${nextChakra}`);
      
      // Store the last processed chakra
      lastChakraProcessed.current = currentChakra || null;
      
      // Update current chakra first
      setCurrentChakra(nextChakra);
      
      // Set isTransitioning to true
      isTransitioning.current = true;
      
      // Create completion callback for this chakra
      const onChakraComplete = () => {
        console.log(`Chakra ${nextChakra} completed, moving to next`);
        isProcessingNextChakra.current = false;
        
        // Continue to next chakra if still playing
        if (isPlayingRef.current) {
          setTimeout(() => {
            moveToNextChakra(
              isPlayingRef.current,
              nextChakra,
              getChakrasToBalance,
              isTransitioning,
              isPlayingRef,
              cleanupTimers,
              stopSound,
              setCurrentChakra,
              setProgress,
              handleChakraTransition,
              completeSessionFn,
              duration
            );
          }, 100);
        }
      };
      
      // Short delay before transition to ensure UI is ready
      setTimeout(() => {
        // Double check if we're still playing
        if (!isPlayingRef.current) {
          isProcessingNextChakra.current = false;
          isTransitioning.current = false;
          return;
        }
        
        // Handle transition to next chakra
        handleChakraTransition(
          currentChakra || '',
          nextChakra,
          effectiveIsPlaying,
          duration,
          setProgress,
          onChakraComplete
        );
      }, 100);
    } else {
      // Current chakra not found in list, complete session
      console.log("Current chakra not found in balance list, completing session");
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
