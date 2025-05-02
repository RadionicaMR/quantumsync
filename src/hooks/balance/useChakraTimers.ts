
import { useRef, useCallback } from 'react';
import type { ChakraName } from '@/constants/chakraData';

export const useChakraTimers = () => {
  const progressIntervalRef = useRef<number | null>(null);
  const chakraTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const isCompletingTimerRef = useRef<boolean>(false);

  const cleanupTimers = useCallback(() => {
    console.log("Cleaning up all timers and animations");
    
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    
    if (chakraTimerRef.current) {
      clearTimeout(chakraTimerRef.current);
      chakraTimerRef.current = null;
    }
    
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    
    // Reset completion flag
    isCompletingTimerRef.current = false;
  }, []);

  const startProgressTimer = useCallback((
    chakraName: ChakraName, 
    duration: number[], 
    isPlaying: boolean,
    setProgress: (progress: number) => void,
    onComplete: () => void
  ) => {
    // Clear any existing interval
    cleanupTimers();
    
    if (!isPlaying) return;
    
    // Always set progress to 0 at the beginning of a new timer
    console.log(`useChakraTimers: Resetting progress to 0 for chakra ${chakraName} before starting timer`);
    setProgress(0);
    
    // Get total duration in milliseconds
    const debugMode = false; // Set to false in production
    const totalDuration = debugMode ? 3000 : duration[0] * 60 * 1000;
    
    console.log(`Starting timer for ${chakraName} with duration: ${totalDuration}ms`);
    
    const startTime = Date.now();
    const endTime = startTime + totalDuration;
    
    // Set up timer to move to next chakra when complete
    chakraTimerRef.current = setTimeout(() => {
      console.log(`Timer completed for chakra ${chakraName}, duration: ${totalDuration}ms`);
      
      // Flag that we're in completion process
      isCompletingTimerRef.current = true;
      
      // Ensure we reach 100% before moving on
      setProgress(100);
      
      // Execute callback after a small delay to ensure UI updates
      setTimeout(() => {
        if (onComplete && typeof onComplete === 'function') {
          console.log(`Executing completion callback for ${chakraName}`);
          onComplete();
        }
      }, 200); // Increased delay to ensure state updates
      
    }, totalDuration);
    
    // Use requestAnimationFrame for smoother progress updates
    const updateProgress = () => {
      if (!isPlaying) {
        cancelAnimationFrame(animationFrameId.current!);
        return;
      }
      
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      
      // Cap at 99% - final 100% set by timer completion
      // CRITICAL FIX: Make sure we never reach 100% via animation
      // because 100% is reserved for the completion signal
      const newProgress = Math.min((elapsed / totalDuration) * 100, 99);
      
      setProgress(newProgress);
      
      // Continue animation if not complete and not already in completion process
      if (currentTime < endTime && isPlaying && !isCompletingTimerRef.current) {
        animationFrameId.current = requestAnimationFrame(updateProgress);
      }
    };
    
    // Start the animation frame loop
    if (isPlaying) {
      animationFrameId.current = requestAnimationFrame(updateProgress);
      console.log(`Started timer for chakra ${chakraName} with duration ${totalDuration}ms, progress reset to 0`);
    }
  }, [cleanupTimers]);

  return {
    progressIntervalRef,
    chakraTimerRef,
    animationFrameId,
    cleanupTimers,
    startProgressTimer,
    isCompletingTimerRef
  };
};
