
import { useEffect, useCallback, useState, useRef } from 'react';
import type { ChakraName } from '@/constants/chakraData';
import { useChakraSession } from '@/hooks/balance/useChakraSession';
import { useChakraProgress } from '@/hooks/balance/useChakraProgress';
import { useChakraSelection } from '@/hooks/balance/useChakraSelection';
import { useChakraTransition } from '@/hooks/balance/useChakraTransition';
import { useChakraControls } from '@/hooks/balance/useChakraControls';

export const useBalanceChakras = (initialPersonName = '', initialChakraStates = []) => {
  const {
    personName,
    setPersonName,
    duration,
    setDuration,
    isPlaying,
    setIsPlaying,
    completed,
    setCompleted,
    recordSession,
    navigateToDiagnose
  } = useChakraSession(initialPersonName);
  
  const {
    currentChakra,
    setCurrentChakra,
    progress,
    setProgress
  } = useChakraProgress();
  
  const {
    balanceOption,
    setBalanceOption,
    getChakrasToBalance
  } = useChakraSelection(initialChakraStates);
  
  const {
    isTransitioning,
    handleChakraTransition,
    cleanupTimers,
    stopSound
  } = useChakraTransition();
  
  const {
    notifyStart,
    notifyStop,
    notifyCompletion,
    notifyMissingName,
    notifyNoChakras,
    getCurrentFrequency
  } = useChakraControls();
  
  // Estado local para control de tiempos de transición
  const [lastTransitionTime, setLastTransitionTime] = useState<number>(0);
  const lastChakraProcessed = useRef<string | null>(null);
  
  // SOLUCIÓN CRÍTICA: Sistema de transición entre chakras completamente rediseñado
  const moveToNextChakra = useCallback(() => {
    console.log("moveToNextChakra called, isPlaying:", isPlaying);
    
    // Control de estado: Si ya estamos en transición, salimos
    if (isTransitioning.current) {
      console.log("Already transitioning, skipping moveToNextChakra");
      return;
    }
    
    // Control de frecuencia: Evitar llamadas múltiples en corto tiempo
    const now = Date.now();
    if ((now - lastTransitionTime) < 800) {
      console.log("Throttling rapid transitions - waiting before processing next transition");
      setTimeout(() => {
        moveToNextChakra();
      }, 1000);
      return;
    }
    
    // Actualizar tiempo de última transición
    setLastTransitionTime(now);
    
    // Marcar inicio de transición
    isTransitioning.current = true;
    
    try {
      // Obtener lista actualizada de chakras a equilibrar
      const chakrasToBalance = getChakrasToBalance();
      console.log("Chakras to balance:", chakrasToBalance);
      
      // Si no hay chakras para procesar, finalizamos
      if (!chakrasToBalance || chakrasToBalance.length === 0) {
        console.log("No chakras to balance, completing session");
        completeSession();
        return;
      }
      
      // Encontrar índice actual
      const currentIndex = currentChakra ? chakrasToBalance.indexOf(currentChakra as ChakraName) : -1;
      console.log(`Current chakra: ${currentChakra}, Index: ${currentIndex}, Total: ${chakrasToBalance.length}`);
      
      // SOLUCIÓN CRÍTICA: Siempre limpiar timers existentes
      cleanupTimers();
      stopSound();
      
      // Comprobar si tenemos más chakras para procesar
      if (currentIndex < chakrasToBalance.length - 1) {
        // Obtener siguiente chakra
        const nextChakra = chakrasToBalance[currentIndex + 1];
        console.log(`Moving to next chakra: ${nextChakra}`);
        
        // Verificar que no estamos en un bucle procesando el mismo chakra
        if (lastChakraProcessed.current === nextChakra) {
          console.warn(`Possible loop detected with chakra: ${nextChakra}`);
          
          // Evitar el bucle forzando un avance adicional si es posible
          if (currentIndex + 2 < chakrasToBalance.length) {
            const skipToChakra = chakrasToBalance[currentIndex + 2];
            console.log(`Skipping to chakra: ${skipToChakra} to break potential loop`);
            
            // Actualizar chakra actual
            setCurrentChakra(skipToChakra);
            lastChakraProcessed.current = skipToChakra;
            
            // Manejar la transición al chakra saltado
            handleChakraTransition(
              currentChakra || '',
              skipToChakra,
              isPlaying,
              duration,
              setProgress,
              moveToNextChakra
            );
          } else {
            // Si no podemos avanzar más, completamos la sesión
            completeSession();
          }
        } else {
          // Actualizar chakra actual
          setCurrentChakra(nextChakra);
          lastChakraProcessed.current = nextChakra;
          
          // Manejar transición al siguiente chakra
          handleChakraTransition(
            currentChakra || '',
            nextChakra,
            isPlaying,
            duration,
            setProgress,
            moveToNextChakra
          );
        }
      } else {
        // Sesión completada
        completeSession();
      }
      
    } catch (error) {
      console.error("Error in moveToNextChakra:", error);
      isTransitioning.current = false;
    }
  }, [
    currentChakra, 
    getChakrasToBalance, 
    cleanupTimers, 
    stopSound, 
    isPlaying,
    duration, 
    handleChakraTransition,
    setCurrentChakra,
    setProgress,
    lastTransitionTime
  ]);

  // Función para completar la sesión y evitar duplicación de código
  const completeSession = useCallback(() => {
    console.log("All chakras have been balanced");
    
    // Actualizar estados
    setIsPlaying(false);
    setCompleted(true);
    setCurrentChakra('');
    setProgress(0);
    
    // Detener sonido y notificar
    stopSound();
    notifyCompletion();
    
    // Registrar sesión
    recordSession();
    
    // Reiniciar bandera de transición
    isTransitioning.current = false;
    lastChakraProcessed.current = null;
  }, [
    setIsPlaying, 
    setCompleted, 
    setCurrentChakra,
    setProgress,
    stopSound,
    notifyCompletion,
    recordSession
  ]);

  const startBalancing = useCallback(() => {
    if (!personName.trim()) {
      notifyMissingName();
      return;
    }
    
    const chakrasToBalance = getChakrasToBalance();
    
    if (chakrasToBalance.length === 0) {
      notifyNoChakras();
      return;
    }
    
    // Limpiar cualquier timer existente
    cleanupTimers();
    
    // Reiniciar estado de transición y tiempo
    isTransitioning.current = false;
    setLastTransitionTime(0);
    lastChakraProcessed.current = null;
    
    // Configurar estado inicial
    const firstChakra = chakrasToBalance[0];
    setIsPlaying(true);
    setCurrentChakra(firstChakra);
    setProgress(0);
    setCompleted(false);
    
    // Manejar transición al primer chakra
    handleChakraTransition(
      '',
      firstChakra,
      true,
      duration,
      setProgress,
      moveToNextChakra
    );
    
    notifyStart(personName);
    
    console.log(`Iniciando equilibrio de chakras con el primer chakra: ${firstChakra}`);
    
  }, [
    personName, 
    getChakrasToBalance, 
    cleanupTimers, 
    handleChakraTransition,
    moveToNextChakra,
    duration,
    notifyMissingName, 
    notifyNoChakras,
    notifyStart,
    setCompleted,
    setCurrentChakra,
    setIsPlaying,
    setProgress,
    setLastTransitionTime
  ]);

  const stopBalancing = useCallback(() => {
    // Clean up timers
    cleanupTimers();
    
    // Reset state
    setIsPlaying(false);
    setCurrentChakra('');
    setProgress(0);
    lastChakraProcessed.current = null;
    
    // Stop audio
    stopSound();
    
    notifyStop();
  }, [cleanupTimers, stopSound, notifyStop, setIsPlaying, setCurrentChakra, setProgress]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanupTimers();
      stopSound();
    };
  }, [cleanupTimers, stopSound]);

  return {
    personName,
    setPersonName,
    duration,
    setDuration,
    isPlaying,
    currentChakra,
    progress,
    completed,
    balanceOption,
    setBalanceOption,
    startBalancing,
    stopBalancing,
    navigateToDiagnose,
    currentFrequency: getCurrentFrequency(currentChakra)
  };
};
