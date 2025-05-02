
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

  // Update progress animation function - completamente reescrita para mayor fiabilidad
  const updateProgress = useCallback(() => {
    // Si no está reproduciéndose o faltan datos clave, detener la animación
    if (!isPlaying || !startTimeRef.current || !currentChakra) {
      console.log("Condiciones para detener animación cumplidas, limpiando frame...");
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }
    
    // Calcular el progreso basado en el tiempo transcurrido
    const chakraDuration = duration[0] * 60 * 1000; // Convertir minutos a milisegundos
    const elapsedTime = Date.now() - startTimeRef.current;
    const newProgress = Math.min(100, (elapsedTime / chakraDuration) * 100);
    
    // Actualizar el estado del progreso
    progressRef.current = newProgress;
    setProgress(newProgress);
    
    console.log(`Actualización de progreso: ${newProgress.toFixed(1)}% para chakra ${currentChakra}`);
    
    if (newProgress < 100) {
      // Continuar el ciclo de animación
      animationFrameRef.current = window.requestAnimationFrame(updateProgress);
    } else {
      // Cuando el progreso llega al 100%, pasar al siguiente chakra
      const chakrasToBalance = getChakrasToBalance();
      const currentIndex = chakrasToBalance.indexOf(currentChakra as ChakraName);
      
      console.log(`Chakra ${currentChakra} completado. Índice actual: ${currentIndex}, Total chakras: ${chakrasToBalance.length}`);
      
      if (currentIndex < chakrasToBalance.length - 1) {
        // Detener cualquier animationFrame existente
        if (animationFrameRef.current) {
          window.cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        
        // Detener el sonido actual antes de cambiar de chakra
        stopSound();
        
        // Obtener el siguiente chakra
        const nextChakra = chakrasToBalance[currentIndex + 1];
        console.log(`Avanzando al siguiente chakra: ${nextChakra}`);
        
        // Actualizar estado para el siguiente chakra
        setCurrentChakra(nextChakra);
        setProgress(0);
        progressRef.current = 0;
        
        // Restablecer el tiempo de inicio
        startTimeRef.current = Date.now();
        
        // Reproducir el sonido del siguiente chakra
        playChakraSound(nextChakra);
        
        // Mostrar notificación
        toast({
          title: `Chakra ${currentChakra} armonizado`,
          description: `Ahora armonizando el chakra ${nextChakra}...`,
        });
        
        // Reiniciar animación para el siguiente chakra después de un breve retraso
        // para asegurar que el estado se actualice correctamente
        setTimeout(() => {
          if (isPlaying) {
            animationFrameRef.current = window.requestAnimationFrame(updateProgress);
            console.log(`Animación reiniciada para chakra ${nextChakra}`);
          }
        }, 100);
      } else {
        // Todos los chakras completados
        console.log("Todos los chakras han sido armonizados");
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
    
    // Limpiar cualquier frame de animación existente
    if (animationFrameRef.current) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Limpiar cualquier temporizador existente
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    // Resetear el estado y comenzar con el primer chakra
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
    
    // Detener cualquier sonido existente primero
    stopSound();
    
    // Iniciar la reproducción del sonido del primer chakra
    playChakraSound(chakrasToBalance[0]);
    
    console.log(`Iniciando equilibrio de chakras con el primer chakra: ${chakrasToBalance[0]}`);
    
    // Iniciar el ciclo de animación frame después de un breve retraso
    // para asegurar que el estado se actualice correctamente
    setTimeout(() => {
      animationFrameRef.current = window.requestAnimationFrame(updateProgress);
    }, 100);
  }, [personName, getChakrasToBalance, playChakraSound, updateProgress, stopSound]);

  const stopBalancing = useCallback(() => {
    // Limpiar frame de animación
    if (animationFrameRef.current) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Limpiar cualquier temporizador existente
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

  // Limpiar al desmontar
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
