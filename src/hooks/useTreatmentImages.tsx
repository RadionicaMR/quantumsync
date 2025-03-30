
import { useState, useRef, useEffect } from 'react';

export const useTreatmentImages = () => {
  const [visualFeedback, setVisualFeedback] = useState(true);
  const [radionicImage, setRadionicImage] = useState<string | null>(null);
  const [receptorImage, setReceptorImage] = useState<string | null>(null);
  const [radionicImages, setRadionicImages] = useState<string[]>([]);
  const [receptorImages, setReceptorImages] = useState<string[]>([]);
  const [hypnoticEffect, setHypnoticEffect] = useState(false);
  const [hypnoticSpeed, setHypnoticSpeed] = useState([10]); // Velocidad de oscilación (1-20)
  const [currentImage, setCurrentImage] = useState<'radionic' | 'receptor'>('radionic');
  
  const hypnoticTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Función para el efecto hipnótico
  const startHypnoticEffect = () => {
    const hasRadionicImages = radionicImages.length > 0 || radionicImage;
    const hasReceptorImages = receptorImages.length > 0 || receptorImage;
    
    if (hasRadionicImages && hasReceptorImages) {
      setHypnoticEffect(true);
      
      // Detenemos cualquier temporizador existente antes de crear uno nuevo
      if (hypnoticTimerRef.current) {
        clearInterval(hypnoticTimerRef.current);
      }
      
      // La velocidad del efecto hipnótico se calcula inversamente: valores más altos = transición más rápida
      // Ajustamos para que sea más notorio
      const switchInterval = 1000 / hypnoticSpeed[0];
      
      hypnoticTimerRef.current = setInterval(() => {
        setCurrentImage(prev => prev === 'radionic' ? 'receptor' : 'radionic');
      }, switchInterval);
      
      console.log("Hypnotic effect started with speed:", hypnoticSpeed[0], "interval:", switchInterval);
    } else {
      console.log("Cannot start hypnotic effect: missing images", {
        hasRadionicImages,
        hasReceptorImages,
        radionicImage,
        receptorImage
      });
    }
  };

  const stopHypnoticEffect = () => {
    if (hypnoticTimerRef.current) {
      clearInterval(hypnoticTimerRef.current);
      hypnoticTimerRef.current = null;
    }
    setHypnoticEffect(false);
    console.log("Hypnotic effect stopped");
  };

  useEffect(() => {
    // If hypnotic effect is active and speed changes, restart the effect
    if (hypnoticEffect) {
      startHypnoticEffect();
    }
    
    // Cleanup on unmount
    return () => {
      if (hypnoticTimerRef.current) {
        clearInterval(hypnoticTimerRef.current);
      }
    };
  }, [hypnoticSpeed]);

  return {
    visualFeedback,
    setVisualFeedback,
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
    startHypnoticEffect,
    stopHypnoticEffect
  };
};
