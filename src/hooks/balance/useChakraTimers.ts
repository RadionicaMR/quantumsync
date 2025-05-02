
import { useRef, useCallback } from 'react';
import type { ChakraName } from '@/constants/chakraData';

export const useChakraTimers = () => {
  const progressIntervalRef = useRef<number | null>(null);
  const chakraTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const isCompletingTimerRef = useRef<boolean>(false);

  const cleanupTimers = useCallback(() => {
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
    
    // CRUCIAL FIX: Always set progress to 0 at the beginning of a new timer
    console.log(`useChakraTimers: Resetting progress to 0 for chakra ${chakraName} before starting timer`);
    setProgress(0);
    
    // Get total duration in milliseconds
    const totalDuration = duration[0] * 60 * 1000;
    const startTime = Date.now();
    const endTime = startTime + totalDuration;
    
    // CRITICAL FIX: Execute callback at the end using multiple methods
    const guaranteedCallback = () => {
      // Prevent duplicate executions
      if (isCompletingTimerRef.current) {
        console.log(`Timer for ${chakraName} already completing, skipping duplicate callback`);
        return;
      }
      
      isCompletingTimerRef.current = true;
      
      try {
        console.log(`Executing callback for chakra ${chakraName}`);
        // Ensure we reach 100% before moving to the next chakra
        setProgress(100);
        
        // First immediate execution
        onComplete();
        
        // Second execution via RAF to synchronize with UI
        window.requestAnimationFrame(() => {
          try {
            onComplete();
          } catch (e) {
            console.error("Error in RAF callback:", e);
          } finally {
            // Reset flag after all callbacks
            isCompletingTimerRef.current = false;
          }
        });
      } catch (error) {
        console.error("Error in callback:", error);
        
        // Last attempt - force with setTimeout
        setTimeout(() => {
          try {
            onComplete();
          } catch (e) {
            console.error("Final error in callback:", e);
          } finally {
            // Always reset flag
            isCompletingTimerRef.current = false;
          }
        }, 200);
      }
    };
    
    // Set up timer to move to next chakra when complete
    chakraTimerRef.current = setTimeout(() => {
      console.log(`Timer completed for chakra ${chakraName}, duration: ${duration[0]} minutes`);
      guaranteedCallback();
    }, totalDuration);
    
    // Use requestAnimationFrame for smoother progress updates
    const updateProgress = () => {
      if (!isPlaying) {
        cancelAnimationFrame(animationFrameId.current!);
        return;
      }
      
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 99); // Cap at 99% - final 100% set by timer
      
      setProgress(newProgress);
      
      // Continue animation if not complete
      if (currentTime < endTime && isPlaying) {
        animationFrameId.current = requestAnimationFrame(updateProgress);
      }
    };
    
    // Start the animation frame loop
    if (isPlaying) {
      animationFrameId.current = requestAnimationFrame(updateProgress);
      console.log(`Started timer for chakra ${chakraName} with duration ${duration[0]} minutes, progress reset to 0`);
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
