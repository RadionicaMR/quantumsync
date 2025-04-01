
import { useState, useRef, useEffect } from 'react';

export const useTreatmentImages = () => {
  const [visualFeedback, setVisualFeedback] = useState(true);
  const [radionicImage, setRadionicImage] = useState<string | null>(null);
  const [receptorImage, setReceptorImage] = useState<string | null>(null);
  const [radionicImages, setRadionicImages] = useState<string[]>([]);
  const [receptorImages, setReceptorImages] = useState<string[]>([]);
  const [hypnoticEffect, setHypnoticEffect] = useState(false);
  const [hypnoticSpeed, setHypnoticSpeed] = useState([10]); // Velocidad de oscilación (1-20)
  const [currentImage, setCurrentImage] = useState<'radionic' | 'receptor' | 'mix'>('mix');
  const [receptorName, setReceptorName] = useState<string>('');
  
  const hypnoticTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Función para el efecto hipnótico
  const startHypnoticEffect = () => {
    // Consideramos ya sea imágenes cargadas o un nombre de receptor
    const hasRadionicImagesOrName = radionicImages.length > 0 || radionicImage;
    const hasReceptorImagesOrName = receptorImages.length > 0 || receptorImage || receptorName.trim().length > 0;
    
    if (hasRadionicImagesOrName || hasReceptorImagesOrName) {
      setHypnoticEffect(true);
      
      // Detenemos cualquier temporizador existente antes de crear uno nuevo
      if (hypnoticTimerRef.current) {
        clearInterval(hypnoticTimerRef.current);
      }
      
      // Configuramos la velocidad basada en el valor del deslizador
      // Faster speed (higher value) = shorter interval time
      const switchInterval = 2000 / Math.max(1, hypnoticSpeed[0]);
      
      console.log("Starting hypnotic effect with speed:", hypnoticSpeed[0], "interval:", switchInterval);
      
      // Iniciamos con radionic para asegurar la secuencia completa
      setCurrentImage('radionic');
      
      hypnoticTimerRef.current = setInterval(() => {
        setCurrentImage(prev => {
          if (prev === 'radionic') return 'receptor';
          if (prev === 'receptor') return 'radionic';
          return 'radionic';
        });
      }, switchInterval);
    } else {
      console.log("Cannot start hypnotic effect: missing images or receptor name", {
        hasRadionicImagesOrName,
        hasReceptorImagesOrName,
        radionicImage,
        receptorImage,
        receptorName
      });
    }
  };

  const stopHypnoticEffect = () => {
    if (hypnoticTimerRef.current) {
      clearInterval(hypnoticTimerRef.current);
      hypnoticTimerRef.current = null;
    }
    setHypnoticEffect(false);
    setCurrentImage('mix'); // Reset to mix view when stopped
    console.log("Hypnotic effect stopped");
  };

  // Reinicia el efecto hipnótico si cambia la velocidad
  useEffect(() => {
    if (hypnoticEffect) {
      console.log("Hypnotic speed changed, restarting effect with speed:", hypnoticSpeed[0]);
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
    receptorName,
    setReceptorName,
    startHypnoticEffect,
    stopHypnoticEffect
  };
};
