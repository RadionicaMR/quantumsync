
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
    
    lastTransitionTime.current = now;
    
    // SOLUCIÓN CRÍTICA: Reiniciar progreso para garantizar comportamiento consistente
    console.log(`Transition from ${currentChakra} to ${nextChakra}, resetting progress to 0`);
    setProgress(0);
    
    // Notificar y reproducir sonido para el siguiente chakra
    if (currentChakra) {
      notifyChakraChange(currentChakra as ChakraName, nextChakra);
    }
    
    // SOLUCIÓN CRÍTICA: Siempre detener sonidos previos antes de reproducir nuevos
    stopSound();
    
    // Reproducir sonido para el siguiente chakra
    playChakraSound(nextChakra);
    
    // SOLUCIÓN CRÍTICA: Definir un callback independiente que garantice transición
    const safeOnComplete = () => {
      console.log(`Safe onComplete executing for chakra ${nextChakra}`);
      // Reiniciar estado de transición antes de cualquier otra operación
      isTransitioning.current = false;
      
      // CRUCIAL FIX: Ensure progress is reset before moving on
      setProgress(0);
      
      // Ejecutar callback original
      if (onComplete && typeof onComplete === 'function') {
        try {
          onComplete();
        } catch (error) {
          console.error("Error in onComplete callback:", error);
        }
      }
    };
    
    // Iniciar nuevo timer para este chakra si estamos reproduciendo
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
      // Si no estamos reproduciendo, reiniciar bandera de transición
      isTransitioning.current = false;
    }
  }, [notifyChakraChange, playChakraSound, startProgressTimer, stopSound]);

  return {
    isTransitioning,
    handleChakraTransition,
    cleanupTimers,
    stopSound,
    lastTransitionTime
  };
};
