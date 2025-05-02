
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CHAKRA_FREQUENCIES } from '@/constants/chakraData';
import type { ChakraName } from '@/constants/chakraData';
import { useChakraAudio } from '@/hooks/useChakraAudio';
import { useChakraSelection } from '@/hooks/balance/useChakraSelection';
import { useChakraTimers } from '@/hooks/balance/useChakraTimers';
import { useChakraNotifications } from '@/hooks/balance/useChakraNotifications';
import { addChakraBalanceSession } from '@/utils/chakraBalanceStorage';

export const useBalanceChakras = (initialPersonName = '', initialChakraStates = []) => {
  const navigate = useNavigate();
  const [personName, setPersonName] = useState(initialPersonName);
  const [duration, setDuration] = useState([1]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChakra, setCurrentChakra] = useState<ChakraName | ''>('');
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  
  const { playChakraSound, stopSound } = useChakraAudio();
  const { balanceOption, setBalanceOption, getChakrasToBalance } = useChakraSelection(initialChakraStates);
  const { cleanupTimers, startProgressTimer } = useChakraTimers();
  const { 
    notifyStart, 
    notifyStop, 
    notifyCompletion, 
    notifyChakraChange, 
    notifyMissingName,
    notifyNoChakras 
  } = useChakraNotifications();

  // Move to the next chakra
  const moveToNextChakra = useCallback(() => {
    const chakrasToBalance = getChakrasToBalance();
    const currentIndex = chakrasToBalance.indexOf(currentChakra as ChakraName);
    
    console.log(`Chakra ${currentChakra} completado. Índice actual: ${currentIndex}, Total chakras: ${chakrasToBalance.length}`);
    
    // Clean up existing timers
    cleanupTimers();
    
    // Stop current sound
    stopSound();
    
    if (currentIndex < chakrasToBalance.length - 1) {
      // There's a next chakra to process
      const nextChakra = chakrasToBalance[currentIndex + 1];
      console.log(`Avanzando al siguiente chakra: ${nextChakra}`);
      
      // Update state with a slight delay to ensure proper rendering
      setTimeout(() => {
        // Notify of the change
        notifyChakraChange(currentChakra as ChakraName, nextChakra);
        
        // Update state
        setCurrentChakra(nextChakra);
        setProgress(0);
        
        // Play next chakra sound
        playChakraSound(nextChakra);
        
        // Start new progress timer for this chakra
        startProgressTimer(
          nextChakra, 
          duration, 
          isPlaying, 
          setProgress, 
          moveToNextChakra
        );
      }, 100);
    } else {
      // All chakras completed
      console.log("Todos los chakras han sido armonizados");
      
      setIsPlaying(false);
      setCompleted(true);
      setCurrentChakra('');
      setProgress(0);
      
      stopSound();
      notifyCompletion();
      
      // Record completion if there's a person name
      if (personName) {
        addChakraBalanceSession(personName);
      }
    }
  }, [
    currentChakra, 
    getChakrasToBalance, 
    cleanupTimers, 
    stopSound, 
    playChakraSound, 
    notifyChakraChange,
    notifyCompletion,
    duration, 
    isPlaying,
    startProgressTimer,
    personName
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
    
    // Set initial state
    const firstChakra = chakrasToBalance[0];
    setIsPlaying(true);
    setCurrentChakra(firstChakra);
    setProgress(0);
    setCompleted(false);
    
    // Start the audio for the first chakra
    stopSound();
    playChakraSound(firstChakra);
    
    notifyStart(personName);
    
    console.log(`Iniciando equilibrio de chakras con el primer chakra: ${firstChakra}`);
    
    // Start the progress timer
    startProgressTimer(
      firstChakra, 
      duration, 
      true, 
      setProgress, 
      moveToNextChakra
    );
  }, [
    personName, 
    getChakrasToBalance, 
    cleanupTimers, 
    stopSound, 
    playChakraSound, 
    notifyMissingName, 
    notifyNoChakras,
    notifyStart,
    startProgressTimer,
    moveToNextChakra,
    duration
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
  }, [cleanupTimers, stopSound, notifyStop]);

  const navigateToDiagnose = useCallback(() => {
    navigate('/diagnose');
  }, [navigate]);

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
    currentFrequency: currentChakra ? CHAKRA_FREQUENCIES[currentChakra] : 0
  };
};
