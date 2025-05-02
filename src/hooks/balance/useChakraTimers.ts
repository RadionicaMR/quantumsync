
import { useRef, useCallback } from 'react';
import type { ChakraName } from '@/constants/chakraData';

export const useChakraTimers = () => {
  const progressIntervalRef = useRef<number | null>(null);
  const chakraTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameId = useRef<number | null>(null);

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
    
    // Get total duration in milliseconds
    const totalDuration = duration[0] * 60 * 1000;
    const startTime = Date.now();
    const endTime = startTime + totalDuration;
    
    // Set up timer to move to next chakra when complete
    chakraTimerRef.current = setTimeout(() => {
      // Ensure we reach 100% before moving to the next chakra
      setProgress(100);
      
      console.log(`Timer completed for chakra ${chakraName}, about to call onComplete`);
      
      // CRITICAL FIX: Use window.setTimeout to ensure the callback runs in a completely fresh call stack
      window.setTimeout(() => {
        onComplete();
      }, 10);
      
    }, totalDuration);
    
    // Use requestAnimationFrame for smoother progress updates
    const updateProgress = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
      
      setProgress(newProgress);
      
      // Continue animation if not complete
      if (currentTime < endTime && isPlaying) {
        animationFrameId.current = requestAnimationFrame(updateProgress);
      } else if (newProgress >= 100) {
        // Ensure we reach exactly 100% at the end
        setProgress(100);
      }
    };
    
    // Start the animation frame loop
    if (isPlaying) {
      animationFrameId.current = requestAnimationFrame(updateProgress);
      console.log(`Started timer for chakra ${chakraName} with duration ${duration[0]} minutes`);
    }
  }, [cleanupTimers]);

  return {
    progressIntervalRef,
    chakraTimerRef,
    animationFrameId,
    cleanupTimers,
    startProgressTimer
  };
};
