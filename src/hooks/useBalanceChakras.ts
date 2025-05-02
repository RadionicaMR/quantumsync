
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";
import { useChakraAudio } from '@/hooks/useChakraAudio';
import { CHAKRA_ORDER, CHAKRA_FREQUENCIES } from '@/constants/chakraData';
import type { ChakraName } from '@/constants/chakraData';
import type { BalanceOption } from '@/components/balance/BalanceOptions';

export const useBalanceChakras = (initialPersonName = '', initialChakraStates = []) => {
  const navigate = useNavigate();
  const [personName, setPersonName] = useState(initialPersonName);
  const [duration, setDuration] = useState([1]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChakra, setCurrentChakra] = useState<ChakraName | ''>('');
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [balanceOption, setBalanceOption] = useState<BalanceOption>('all');
  
  // Refs for tracking progress and timing
  const progressIntervalRef = useRef<number | null>(null);
  const chakraTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { playChakraSound, stopSound } = useChakraAudio();
  
  const getChakrasToBalance = useCallback(() => {
    if (balanceOption === 'all') {
      return [...CHAKRA_ORDER];
    } else {
      if (initialChakraStates && initialChakraStates.length > 0) {
        return CHAKRA_ORDER.filter(chakraName => {
          const chakraData = initialChakraStates.find(c => c.name === chakraName);
          return chakraData && (chakraData.state === 'CERRADO' || chakraData.state === 'BLOQUEADO');
        });
      }
      return [...CHAKRA_ORDER];
    }
  }, [balanceOption, initialChakraStates]);

  // Clean up all timers
  const cleanupTimers = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    
    if (chakraTimerRef.current) {
      clearTimeout(chakraTimerRef.current);
      chakraTimerRef.current = null;
    }
  }, []);

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
      
      // Update state
      setCurrentChakra(nextChakra);
      setProgress(0);
      
      // Play next chakra sound
      playChakraSound(nextChakra);
      
      // Toast notification
      toast({
        title: `Chakra ${currentChakra} armonizado`,
        description: `Ahora armonizando el chakra ${nextChakra}...`,
      });
      
      // Start new progress timer for this chakra
      startProgressTimer(nextChakra);
    } else {
      // All chakras completed
      console.log("Todos los chakras han sido armonizados");
      
      setIsPlaying(false);
      setCompleted(true);
      setCurrentChakra('');
      setProgress(0);
      
      stopSound();
      
      toast({
        title: "¡Armonización Finalizada!",
        description: "Todos los chakras han sido equilibrados.",
      });
    }
  }, [currentChakra, getChakrasToBalance, cleanupTimers, stopSound, playChakraSound]);

  // Start progress timer for the current chakra
  const startProgressTimer = useCallback((chakraName: ChakraName) => {
    // Clear any existing interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    // Get total duration in milliseconds
    const totalDuration = duration[0] * 60 * 1000;
    const updateInterval = 100; // Update progress every 100ms
    const totalSteps = totalDuration / updateInterval;
    let currentStep = 0;
    
    // Set up timer to move to next chakra when complete
    chakraTimerRef.current = setTimeout(() => {
      moveToNextChakra();
    }, totalDuration);
    
    // Set up progress interval
    progressIntervalRef.current = setInterval(() => {
      currentStep++;
      const newProgress = (currentStep / totalSteps) * 100;
      setProgress(Math.min(newProgress, 100));
      
      // If we've reached 100%, clear the interval
      if (newProgress >= 100 && progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }, updateInterval) as unknown as number;
    
    console.log(`Started timer for chakra ${chakraName} with duration ${duration[0]} minutes`);
  }, [duration, moveToNextChakra]);

  const startBalancing = useCallback(() => {
    if (!personName.trim()) {
      toast({
        title: "Nombre requerido",
        description: "Por favor ingresa el nombre de la persona a tratar.",
        variant: "destructive"
      });
      return;
    }
    
    const chakrasToBalance = getChakrasToBalance();
    
    if (chakrasToBalance.length === 0) {
      toast({
        title: "No hay chakras para equilibrar",
        description: "Todos los chakras ya están equilibrados.",
      });
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
    
    toast({
      title: "Proceso iniciado",
      description: `Armonizando chakras para ${personName}...`,
    });
    
    console.log(`Iniciando equilibrio de chakras con el primer chakra: ${firstChakra}`);
    
    // Start the progress timer
    startProgressTimer(firstChakra);
  }, [personName, getChakrasToBalance, cleanupTimers, stopSound, playChakraSound, startProgressTimer]);

  const stopBalancing = useCallback(() => {
    // Clean up timers
    cleanupTimers();
    
    // Reset state
    setIsPlaying(false);
    setCurrentChakra('');
    setProgress(0);
    
    // Stop audio
    stopSound();
    
    toast({
      title: "Proceso detenido",
      description: "Armonización de chakras interrumpida.",
    });
  }, [cleanupTimers, stopSound]);

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
