
import { useEffect, useCallback } from 'react';
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
  
  // CRITICAL FIX: Move to the next chakra with complete rewrite
  const moveToNextChakra = useCallback(() => {
    console.log("moveToNextChakra called, isPlaying:", isPlaying);
    
    // CRITICAL FIX: If we're already processing a transition, exit
    if (isTransitioning.current) {
      console.log("Already transitioning, skipping moveToNextChakra");
      return;
    }
    
    // Set transitioning flag immediately
    isTransitioning.current = true;
    
    try {
      // CRITICAL FIX: Ensure we get a fresh list of chakras each time
      const chakrasToBalance = getChakrasToBalance();
      console.log("Chakras to balance:", chakrasToBalance);
      
      // Find current index
      const currentIndex = currentChakra ? chakrasToBalance.indexOf(currentChakra as ChakraName) : -1;
      console.log(`Current chakra: ${currentChakra}, Index: ${currentIndex}, Total: ${chakrasToBalance.length}`);
      
      // CRITICAL FIX: Always clean up any existing timers
      cleanupTimers();
      
      // CRITICAL FIX: Always stop current sound
      stopSound();
      
      // Check if we have more chakras to process
      if (currentIndex < chakrasToBalance.length - 1) {
        // Get next chakra
        const nextChakra = chakrasToBalance[currentIndex + 1];
        console.log(`Moving to next chakra: ${nextChakra}`);
        
        // Update current chakra
        setCurrentChakra(nextChakra);
        
        // Handle transition to next chakra
        handleChakraTransition(
          currentChakra,
          nextChakra,
          isPlaying,
          duration,
          setProgress,
          moveToNextChakra
        );
        
      } else {
        // Session completed
        console.log("All chakras have been balanced");
        
        // Update states
        setIsPlaying(false);
        setCompleted(true);
        setCurrentChakra('');
        setProgress(0);
        
        // Notify completion
        stopSound();
        notifyCompletion();
        
        // Record session
        recordSession();
        
        // Reset transitioning flag
        isTransitioning.current = false;
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
    notifyCompletion,
    recordSession,
    setCompleted,
    setCurrentChakra,
    setIsPlaying,
    setProgress
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
    
    // Clean up any existing timers
    cleanupTimers();
    
    // Reset transition state
    isTransitioning.current = false;
    
    // Set initial state
    const firstChakra = chakrasToBalance[0];
    setIsPlaying(true);
    setCurrentChakra(firstChakra);
    setProgress(0);
    setCompleted(false);
    
    // Handle transition to first chakra
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
    setProgress
  ]);

  const stopBalancing = useCallback(() => {
    // Clean up timers
    cleanupTimers();
    
    // Reset state
    setIsPlaying(false);
    setCurrentChakra('');
    setProgress(0);
    
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
