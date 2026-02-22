
import { useRef, useCallback } from 'react';
import type { ChakraName } from '@/constants/chakraData';

export const useChakraTimers = () => {
  const progressIntervalRef = useRef<number | null>(null);
  const chakraTimerRef = useRef<number | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const isCompletingTimerRef = useRef<boolean>(false);
  const completionTimeoutRef = useRef<number | null>(null);

  const cleanupTimers = useCallback(() => {
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    
    if (chakraTimerRef.current) {
      window.clearTimeout(chakraTimerRef.current);
      chakraTimerRef.current = null;
    }
    
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    
    if (completionTimeoutRef.current) {
      window.clearTimeout(completionTimeoutRef.current);
      completionTimeoutRef.current = null;
    }
    
    isCompletingTimerRef.current = false;
  }, []);

  const startProgressTimer = useCallback((
    chakraName: ChakraName, 
    duration: number[], 
    isPlaying: boolean,
    setProgress: (progress: number) => void,
    onComplete: () => void
  ) => {
    cleanupTimers();
    
    if (!isPlaying) {
      return;
    }
    
    setProgress(0);
    
    const debugMode = false;
    const totalDuration = debugMode ? 3000 : duration[0] * 60 * 1000;
    
    const startTime = Date.now();
    const endTime = startTime + totalDuration;
    
    chakraTimerRef.current = window.setTimeout(() => {
      isCompletingTimerRef.current = true;
      
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      
      setProgress(100);
      
      completionTimeoutRef.current = window.setTimeout(() => {
        try {
          onComplete();
        } catch (error) {
          console.error(`Error in onComplete for ${chakraName}:`, error);
        } finally {
          isCompletingTimerRef.current = false;
          completionTimeoutRef.current = null;
        }
      }, 500);
      
    }, totalDuration - 50);
    
    const updateProgress = () => {
      if (!isPlaying || isCompletingTimerRef.current) {
        return;
      }
      
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const timeRatio = elapsed / totalDuration;
      const newProgress = Math.min(timeRatio * 100, 99.5);
      
      setProgress(newProgress);
      
      if (currentTime < endTime && isPlaying && !isCompletingTimerRef.current) {
        animationFrameId.current = requestAnimationFrame(updateProgress);
      }
    };
    
    if (isPlaying) {
      animationFrameId.current = requestAnimationFrame(updateProgress);
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
