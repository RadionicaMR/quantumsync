
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
    // All chakras balanced
    
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
    // Use ref for reliable playing state check

    
    // CRITICAL FIX: Use the ref for the playing state which is more reliable during transitions
    const effectiveIsPlaying = isPlayingRef.current || isPlaying;
    
    // CRITICAL FIX: Prevent multiple calls while processing with more robust check
    if (isProcessingNextChakra.current) {
      return;
    }
    
    // Set processing flag
    isProcessingNextChakra.current = true;
    
    // Force playing state check
    if (!effectiveIsPlaying) {
      isProcessingNextChakra.current = false;
      return;
    }
    
    const chakrasToBalance = getChakrasToBalance();
    
    // If no chakras to process, finish
    if (!chakrasToBalance || chakrasToBalance.length === 0) {
      
      completeSessionFn();
      isProcessingNextChakra.current = false;
      return;
    }
    
    // CRITICAL FIX: Handle the case where we're starting fresh (no current chakra)
    if (currentChakra === '') {
      const firstChakra = chakrasToBalance[0];
      
      
      // Set current chakra
      setCurrentChakra(firstChakra);
      
      // Set isTransitioning to true
      isTransitioning.current = true;
      
      // Create completion callback that moves to next chakra
      const onFirstChakraComplete = () => {
        
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
    
    
    // Check if we're on the last chakra
    if (currentIndex === chakrasToBalance.length - 1) {
      
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
      
      
      // Store the last processed chakra
      lastChakraProcessed.current = currentChakra || null;
      
      // Update current chakra first
      setCurrentChakra(nextChakra);
      
      // Set isTransitioning to true
      isTransitioning.current = true;
      
      // Create completion callback for this chakra
      const onChakraComplete = () => {
        
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
