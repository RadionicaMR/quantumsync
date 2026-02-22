
import { useRef, useCallback } from 'react';
import { useChakraAudio } from '@/hooks/useChakraAudio';
import { useChakraTimers } from '@/hooks/balance/useChakraTimers';
import { useChakraNotifications } from '@/hooks/balance/useChakraNotifications';
import type { ChakraName } from '@/constants/chakraData';

export const useChakraTransition = () => {
  // Reference to track if we're already transitioning
  const isTransitioning = useRef(false);
  const lastTransitionTime = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false); // Add reference to track playing state
  const currentChakraRef = useRef<ChakraName | ''>('');
  
  const { playChakraSound, stopSound, initAudio } = useChakraAudio();
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
    
    // Track current chakra for debugging
    currentChakraRef.current = nextChakra;
    
    // Store playing state in ref for completion callbacks
    isPlayingRef.current = isPlaying;
    
    // Update timestamp first
    const now = Date.now();
    lastTransitionTime.current = now;
    
    
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
    
    // CRITICAL FIX: Create a completely independent and reliable completion handler
    const safeOnComplete = () => {
      
      
      // Reset transition state
      isTransitioning.current = false;
      
      // Call original callback with error handling
      if (onComplete && typeof onComplete === 'function') {
        
        try {
          // Verify we're still on the same chakra
          if (currentChakraRef.current === nextChakra) {
            // Use the previously stored playing state
            
            onComplete();
          } else {
            
          }
        } catch (error) {
          console.error(`Error in onComplete callback for ${nextChakra}:`, error);
          // Even if callback fails, ensure we're not stuck in transition state
          isTransitioning.current = false;
        }
      } else {
        
      }
    };
    
    // CRITICAL FIX: Add small delay before starting timer to ensure UI updates
    setTimeout(() => {
      // Check our stored playing state
      if (!isPlayingRef.current) {
        
        isTransitioning.current = false;
        return;
      }
      
      // Start new timer for this chakra
      
      startProgressTimer(
        nextChakra, 
        duration, 
        isPlayingRef.current, 
        setProgress, 
        safeOnComplete
      );
    }, 150); // Slight increase to ensure UI is ready
    
  }, [notifyChakraChange, playChakraSound, startProgressTimer, cleanupTimers, stopSound]);

  return {
    isTransitioning,
    handleChakraTransition,
    cleanupTimers,
    stopSound,
    initAudio,
    lastTransitionTime,
    isPlayingRef,
    currentChakraRef
  };
};
