
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
  
  // Refs for tracking progress animation
  const progressRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
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

  // Update progress animation function - completely refactored for reliability
  const updateProgress = useCallback(() => {
    if (!isPlaying || !startTimeRef.current || !currentChakra) {
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }
    
    const chakraDuration = duration[0] * 60 * 1000; // Convert minutes to milliseconds
    const elapsedTime = Date.now() - startTimeRef.current;
    const newProgress = Math.min(100, (elapsedTime / chakraDuration) * 100);
    
    // Update progress state
    progressRef.current = newProgress;
    setProgress(newProgress);
    
    console.log(`Progress update: ${newProgress.toFixed(1)}% for chakra ${currentChakra}`);
    
    if (newProgress < 100) {
      // Continue the animation loop
      animationFrameRef.current = window.requestAnimationFrame(updateProgress);
    } else {
      // When progress reaches 100%, move to the next chakra
      const chakrasToBalance = getChakrasToBalance();
      const currentIndex = chakrasToBalance.indexOf(currentChakra as ChakraName);
      
      console.log(`Chakra ${currentChakra} completed. Current index: ${currentIndex}, Total chakras: ${chakrasToBalance.length}`);
      
      if (currentIndex < chakrasToBalance.length - 1) {
        const nextChakra = chakrasToBalance[currentIndex + 1];
        console.log(`Moving to next chakra: ${nextChakra}`);
        
        // Stop current sound before changing chakra
        stopSound();
        
        // Update state for next chakra
        setCurrentChakra(nextChakra);
        setProgress(0);
        progressRef.current = 0;
        startTimeRef.current = Date.now();
        
        // Play next chakra sound
        playChakraSound(nextChakra);
        
        toast({
          title: `Chakra ${currentChakra} armonizado`,
          description: `Ahora armonizando el chakra ${nextChakra}...`,
        });
        
        // Restart animation for next chakra with a small delay to ensure state update
        setTimeout(() => {
          if (animationFrameRef.current) {
            window.cancelAnimationFrame(animationFrameRef.current);
          }
          animationFrameRef.current = window.requestAnimationFrame(updateProgress);
        }, 50);
      } else {
        // All chakras completed
        if (animationFrameRef.current) {
          window.cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        setIsPlaying(false);
        setCompleted(true);
        stopSound();
        
        toast({
          title: "¡Armonización Finalizada!",
          description: "Todos los chakras han sido equilibrados.",
        });
      }
    }
  }, [isPlaying, currentChakra, duration, getChakrasToBalance, playChakraSound, stopSound]);

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
    
    // Clean up any existing animation frame
    if (animationFrameRef.current) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Clean up any existing timers
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    // Reset state and start with first chakra
    setIsPlaying(true);
    setCurrentChakra(chakrasToBalance[0]);
    setProgress(0);
    progressRef.current = 0;
    startTimeRef.current = Date.now();
    setCompleted(false);
    
    toast({
      title: "Proceso iniciado",
      description: `Armonizando chakras para ${personName}...`,
    });
    
    // Stop any existing sounds first
    stopSound();
    
    // Start playing the first chakra sound
    playChakraSound(chakrasToBalance[0]);
    
    // Start the animation frame loop with a small delay to ensure state update
    setTimeout(() => {
      animationFrameRef.current = window.requestAnimationFrame(updateProgress);
    }, 50);
    
    console.log(`Starting chakra balance with first chakra: ${chakrasToBalance[0]}`);
  }, [personName, getChakrasToBalance, playChakraSound, updateProgress, stopSound]);

  const stopBalancing = useCallback(() => {
    // Clean up animation frame
    if (animationFrameRef.current) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Clean up any existing timers
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    setIsPlaying(false);
    setCurrentChakra('');
    setProgress(0);
    progressRef.current = 0;
    startTimeRef.current = null;
    stopSound();
    
    toast({
      title: "Proceso detenido",
      description: "Armonización de chakras interrumpida.",
    });
  }, [stopSound]);

  const navigateToDiagnose = useCallback(() => {
    navigate('/diagnose');
  }, [navigate]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      
      stopSound();
    };
  }, [stopSound]);

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
