
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
    
    // SOLUCIÓN CRÍTICA: Ejecutar callback al finalizar usando múltiples métodos
    const guaranteedCallback = () => {
      try {
        console.log(`Executing callback for chakra ${chakraName}`);
        // Ensure we reach 100% before moving to the next chakra
        setProgress(100);
        
        // Primera ejecución inmediata
        onComplete();
        
        // Segunda ejecución vía RAF para sincronizar con UI
        window.requestAnimationFrame(() => {
          try {
            onComplete();
          } catch (e) {
            console.error("Error in RAF callback:", e);
          }
        });
      } catch (error) {
        console.error("Error in callback:", error);
        
        // Último intento - forzar con setTimeout
        setTimeout(() => {
          try {
            onComplete();
          } catch (e) {
            console.error("Final error in callback:", e);
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
