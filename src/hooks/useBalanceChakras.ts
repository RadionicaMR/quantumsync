
import { useState, useEffect, useCallback } from 'react';
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
    
    setIsPlaying(true);
    setCurrentChakra(chakrasToBalance[0]);
    setProgress(0);
    setCompleted(false);
    
    toast({
      title: "Proceso iniciado",
      description: `Armonizando chakras para ${personName}...`,
    });
    
    playChakraSound(chakrasToBalance[0]);
  }, [personName, getChakrasToBalance, playChakraSound]);

  const stopBalancing = useCallback(() => {
    setIsPlaying(false);
    setCurrentChakra('');
    setProgress(0);
    stopSound();
    
    toast({
      title: "Proceso detenido",
      description: "Armonización de chakras interrumpida.",
    });
  }, [stopSound]);

  const navigateToDiagnose = useCallback(() => {
    navigate('/diagnose');
  }, [navigate]);

  useEffect(() => {
    if (!isPlaying || !currentChakra) return;
    
    const chakrasToBalance = getChakrasToBalance();
    const chakraDuration = duration[0] * 60 * 1000;
    const updateInterval = 50; // Update more frequently for smoother animation
    let elapsedTime = 0;
    let progressValue = 0;
    
    console.log(`Starting balance for chakra ${currentChakra} with duration ${chakraDuration}ms`);
    
    const timer = setInterval(() => {
      elapsedTime += updateInterval;
      progressValue = Math.min(100, (elapsedTime / chakraDuration) * 100);
      setProgress(progressValue);
      
      console.log(`Progress update: ${progressValue.toFixed(1)}%`);
      
      if (progressValue >= 100) {
        const currentIndex = chakrasToBalance.indexOf(currentChakra as ChakraName);
        
        if (currentIndex < chakrasToBalance.length - 1) {
          const nextChakra = chakrasToBalance[currentIndex + 1];
          setCurrentChakra(nextChakra);
          setProgress(0);
          playChakraSound(nextChakra);
          
          toast({
            title: `Chakra ${currentChakra} armonizado`,
            description: `Ahora armonizando el chakra ${nextChakra}...`,
          });
        } else {
          clearInterval(timer);
          setIsPlaying(false);
          setCompleted(true);
          stopSound();
          
          toast({
            title: "¡Armonización Finalizada!",
            description: "Todos los chakras han sido equilibrados.",
          });
        }
      }
    }, updateInterval);
    
    return () => clearInterval(timer);
  }, [isPlaying, currentChakra, duration, getChakrasToBalance, playChakraSound, stopSound]);

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
