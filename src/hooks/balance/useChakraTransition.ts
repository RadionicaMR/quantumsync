
import { useRef, useCallback } from 'react';
import { useChakraAudio } from '@/hooks/useChakraAudio';
import { useChakraTimers } from '@/hooks/balance/useChakraTimers';
import { useChakraNotifications } from '@/hooks/balance/useChakraNotifications';
import type { ChakraName } from '@/constants/chakraData';

export const useChakraTransition = () => {
  // Reference to track if we're already transitioning
  const isTransitioning = useRef(false);
  const lastTransitionTime = useRef<number>(0);
  
  const { playChakraSound, stopSound } = useChakraAudio();
  const { cleanupTimers, startProgressTimer } = useChakraTimers();
  const { notifyChakraChange } = useChakraNotifications();
  
  const handleChakraTransition = useCallback((
    currentChakra: ChakraName | '',
    nextChakra: ChakraName,
    isPlaying: boolean,
    duration: number[],
    setProgress: (progress: number) => void,
    onComplete: () => void
  ) => {
    // Prevent too frequent transitions (debounce)
    const now = Date.now();
    if ((now - lastTransitionTime.current) < 1000) {
      console.log(`Throttling chakra transition - time since last: ${now - lastTransitionTime.current}ms`);
      return;
    }
    
    // Set transition state
    isTransitioning.current = true;
    lastTransitionTime.current = now;
    
    // CRITICAL FIX: Reset progress BEFORE any other operation
    console.log(`useChakraTransition: Transition from ${currentChakra} to ${nextChakra}, explicitly resetting progress to 0`);
    setProgress(0);
    
    // CRITICAL SOLUTION: Wait a small amount of time to ensure UI updates
    setTimeout(() => {
      // Notify and play sound for next chakra
      if (currentChakra) {
        notifyChakraChange(currentChakra as ChakraName, nextChakra);
      }
      
      // CRITICAL SOLUTION: Always stop previous sounds before playing new ones
      stopSound();
      
      // Play sound for next chakra
      playChakraSound(nextChakra);
      
      // CRITICAL SOLUTION: Define an independent callback that guarantees transition
      const safeOnComplete = () => {
        console.log(`Safe onComplete executing for chakra ${nextChakra}`);
        // Reset transition state before any other operations
        isTransitioning.current = false;
        
        // CRUCIAL FIX: Ensure progress is reset before moving on
        setProgress(0);
        
        // Execute original callback with a small delay to avoid rendering issues
        setTimeout(() => {
          if (onComplete && typeof onComplete === 'function') {
            try {
              onComplete();
            } catch (error) {
              console.error("Error in onComplete callback:", error);
            }
          }
        }, 100);
      };
      
      // Start new timer for this chakra if we're playing
      if (isPlaying) {
        console.log(`Starting timer for chakra ${nextChakra} with duration ${duration[0]} minutes`);
        startProgressTimer(
          nextChakra, 
          duration, 
          true, 
          setProgress, 
          safeOnComplete
        );
      } else {
        // If not playing, reset transition flag
        isTransitioning.current = false;
      }
    }, 50); // Small delay to ensure state updates correctly
  }, [notifyChakraChange, playChakraSound, startProgressTimer, stopSound]);

  return {
    isTransitioning,
    handleChakraTransition,
    cleanupTimers,
    stopSound,
    lastTransitionTime
  };
};
