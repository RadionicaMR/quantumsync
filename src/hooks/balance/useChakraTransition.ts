
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
    // CRITICAL FIX: Ensure we can transition
    if (!isPlaying) {
      console.log("Not playing, skipping transition");
      return;
    }
    
    // CRITICAL FIX: Update timestamp first
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
        setTimeout(() => {
          try {
            onComplete();
          } catch (error) {
            console.error("Error in onComplete callback:", error);
          }
        }, 100);
      }
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
      isTransitioning.current = false;
    }
  }, [notifyChakraChange, playChakraSound, startProgressTimer, cleanupTimers, stopSound]);

  return {
    isTransitioning,
    handleChakraTransition,
    cleanupTimers,
    stopSound,
    lastTransitionTime
  };
};
