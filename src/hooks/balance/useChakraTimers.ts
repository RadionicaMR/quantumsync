
import { useRef, useCallback } from 'react';
import type { ChakraName } from '@/constants/chakraData';

export const useChakraTimers = () => {
  const progressIntervalRef = useRef<number | null>(null);
  const chakraTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const isCompletingTimerRef = useRef<boolean>(false);
  const completionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    
    if (completionTimeoutRef.current) {
      clearTimeout(completionTimeoutRef.current);
      completionTimeoutRef.current = null;
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
    
    if (!isPlaying) {
      console.log("Not playing, not starting timer");
      return;
    }
    
    // Always set progress to 0 at the beginning of a new timer
    console.log(`useChakraTimers: Resetting progress to 0 for chakra ${chakraName} before starting timer`);
    setProgress(0);
    
    // Get total duration in milliseconds
    const debugMode = false; // Set to false in production
    const totalDuration = debugMode ? 3000 : duration[0] * 60 * 1000;
    
    console.log(`Starting timer for ${chakraName} with duration: ${totalDuration}ms`);
    
    const startTime = Date.now();
    const endTime = startTime + totalDuration;
    
    // CRITICAL FIX: Make sure the chakra timer completes reliably
    chakraTimerRef.current = setTimeout(() => {
      console.log(`Timer completed for chakra ${chakraName}, duration: ${totalDuration}ms`);
      
      // Flag that we're in completion process
      isCompletingTimerRef.current = true;
      
      // Cancel any animation frames to avoid conflicts
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      
      // Ensure we reach 100% before moving on - GUARANTEED
      setProgress(100);
      
      // CRITICAL FIX: Use a new, dedicated timeout for completion
      // that won't be cleared by other operations
      completionTimeoutRef.current = setTimeout(() => {
        console.log(`Executing completion callback for ${chakraName}, ensuring transition to next chakra`);
        
        try {
          // Call completion callback
          onComplete();
        } catch (error) {
          console.error(`Error in onComplete for ${chakraName}:`, error);
        } finally {
          // Reset completion flag after callback execution
          isCompletingTimerRef.current = false;
          completionTimeoutRef.current = null;
        }
      }, 500); // Increased delay to ensure UI updates and state is stable
      
    }, totalDuration - 50); // Subtract a small amount to ensure it completes before the animation
    
    // Use requestAnimationFrame for smoother progress updates
    const updateProgress = () => {
      if (!isPlaying || isCompletingTimerRef.current) {
        // Don't continue animation if we're completing or not playing
        return;
      }
      
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      
      // Allow progress to reach 99.5% at most (not 100% yet - that's for the timer)
      const timeRatio = elapsed / totalDuration;
      const newProgress = Math.min(timeRatio * 100, 99.5);
      
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
    isCompletingTimerRef,
    completionTimeoutRef
  };
};
