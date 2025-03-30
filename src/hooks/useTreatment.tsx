
import { useState, useRef, useEffect } from 'react';

export interface TreatmentPreset {
  id: string;
  name: string;
  frequency: number;
  description: string;
  duration: number;
}

export const useTreatment = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [frequency, setFrequency] = useState([528]);
  const [duration, setDuration] = useState([5]);
  const [intensity, setIntensity] = useState([50]);
  const [selectedPreset, setSelectedPreset] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [useHeadphones, setUseHeadphones] = useState(true);
  const [visualFeedback, setVisualFeedback] = useState(true);
  
  // Estados para tratamiento personalizado
  const [rate1, setRate1] = useState('');
  const [rate2, setRate2] = useState('');
  const [rate3, setRate3] = useState('');
  const [radionicImage, setRadionicImage] = useState<string | null>(null);
  const [receptorImage, setReceptorImage] = useState<string | null>(null);
  // Estados para múltiples imágenes
  const [radionicImages, setRadionicImages] = useState<string[]>([]);
  const [receptorImages, setReceptorImages] = useState<string[]>([]);
  const [hypnoticEffect, setHypnoticEffect] = useState(false);
  const [hypnoticSpeed, setHypnoticSpeed] = useState([10]); // Velocidad de oscilación (1-20)
  const [currentImage, setCurrentImage] = useState<'radionic' | 'receptor'>('radionic');
  
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hypnoticTimerRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (minutes: number) => {
    const mins = Math.floor(minutes);
    const secs = Math.round((minutes - mins) * 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const selectPreset = (preset: TreatmentPreset) => {
    if (isPlaying) {
      stopTreatment();
    }
    
    setSelectedPreset(preset.id);
    setFrequency([preset.frequency]);
    setDuration([preset.duration]);
    setIntensity([50]);
  };

  // Función para el efecto hipnótico
  const startHypnoticEffect = () => {
    const hasRadionicImages = radionicImages.length > 0 || radionicImage;
    const hasReceptorImages = receptorImages.length > 0 || receptorImage;
    
    if (hasRadionicImages && hasReceptorImages) {
      setHypnoticEffect(true);
      
      // La velocidad del efecto hipnótico se calcula inversamente: valores más altos = transición más rápida
      const switchInterval = 1000 / (hypnoticSpeed[0] * 2);
      
      hypnoticTimerRef.current = setInterval(() => {
        setCurrentImage(prev => prev === 'radionic' ? 'receptor' : 'radionic');
      }, switchInterval);
    }
  };

  const stopHypnoticEffect = () => {
    if (hypnoticTimerRef.current) {
      clearInterval(hypnoticTimerRef.current);
      hypnoticTimerRef.current = null;
    }
    setHypnoticEffect(false);
  };

  const startTreatment = () => {
    if (isPlaying) return;
    
    try {
      // Initialize audio context
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
      
      // Create oscillator
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency[0];
      
      // Set volume based on intensity
      const volume = intensity[0] / 100 * 0.3; // max volume 0.3 to protect hearing
      gainNode.gain.value = volume;
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.start();
      oscillatorRef.current = oscillator;
      
      // Start timer
      setTimeRemaining(duration[0]);
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1/60;
          if (newTime <= 0) {
            stopTreatment();
            return 0;
          }
          return newTime;
        });
      }, 1000);
      
      // Iniciar efecto hipnótico si hay imágenes cargadas
      const hasRadionicImages = radionicImages.length > 0 || radionicImage;
      const hasReceptorImages = receptorImages.length > 0 || receptorImage;
      
      if (hasRadionicImages && hasReceptorImages) {
        startHypnoticEffect();
      }
      
      setIsPlaying(true);
    } catch (error) {
      console.error("Error al iniciar el tratamiento de audio:", error);
      alert("No se pudo iniciar el tratamiento de audio. Por favor, asegúrate de que tu dispositivo admite la API Web Audio.");
    }
  };

  const stopTreatment = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    stopHypnoticEffect();
    setIsPlaying(false);
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (hypnoticTimerRef.current) {
        clearInterval(hypnoticTimerRef.current);
      }
    };
  }, []);

  return {
    isPlaying,
    frequency,
    setFrequency,
    duration,
    setDuration,
    intensity,
    setIntensity,
    selectedPreset,
    setSelectedPreset,
    timeRemaining,
    useHeadphones,
    setUseHeadphones,
    visualFeedback,
    setVisualFeedback,
    rate1,
    setRate1,
    rate2,
    setRate2,
    rate3,
    setRate3,
    radionicImage,
    setRadionicImage,
    receptorImage,
    setReceptorImage,
    radionicImages,
    setRadionicImages,
    receptorImages,
    setReceptorImages,
    hypnoticEffect,
    hypnoticSpeed,
    setHypnoticSpeed,
    currentImage,
    formatTime,
    selectPreset,
    startTreatment,
    stopTreatment,
  };
};
