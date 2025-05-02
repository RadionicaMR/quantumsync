
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
    // CRITICAL CHECK: Ensure we can transition
    if (!isPlaying) {
      console.log("Not playing, skipping transition");
      return;
    }
    
    // Update timestamp first
    const now = Date.now();
    lastTransitionTime.current = now;
    
    console.log(`useChakraTransition: Transition from ${currentChakra} to ${nextChakra}, explicitly resetting progress to 0`);
    setProgress(0);
    
    // CRITICAL FIX: Ensure clean state for new chakra - always stop previous sounds
    stopSound();
    
    // Always clean up timers before starting new ones
    cleanupTimers();
    
    // Notify and play sound for next chakra
    if (currentChakra) {
      notifyChakraChange(currentChakra as ChakraName, nextChakra);
    }
    
    // Play sound for next chakra
    playChakraSound(nextChakra);
    
    // CRITICAL FIX: Define a completely independent callback for completion
    const safeOnComplete = () => {
      console.log(`Safe onComplete executing for chakra ${nextChakra}`);
      
      // Reset transition state
      isTransitioning.current = false;
      
      // Call original callback
      if (onComplete && typeof onComplete === 'function') {
        console.log(`Calling onComplete callback for ${nextChakra}`);
        try {
          onComplete();
        } catch (error) {
          console.error("Error in onComplete callback:", error);
        }
      }
    };
    
    // CRITICAL FIX: Add small delay before starting timer to ensure UI updates
    setTimeout(() => {
      // Final check to make sure we're still playing
      if (!isPlaying) {
        console.log(`Aborting transition to ${nextChakra} because we're no longer playing`);
        isTransitioning.current = false;
        return;
      }
      
      // Start new timer for this chakra
      console.log(`Starting timer for chakra ${nextChakra} with duration ${duration[0]} minutes`);
      startProgressTimer(
        nextChakra, 
        duration, 
        true, 
        setProgress, 
        safeOnComplete
      );
    }, 100);
    
  }, [notifyChakraChange, playChakraSound, startProgressTimer, cleanupTimers, stopSound]);

  return {
    isTransitioning,
    handleChakraTransition,
    cleanupTimers,
    stopSound,
    lastTransitionTime
  };
};
