
import { useState, useRef, useEffect } from 'react';

export const useTreatmentImages = () => {
  const [visualFeedback, setVisualFeedback] = useState(true);
  const [radionicImage, setRadionicImage] = useState<string | null>(null);
  const [receptorImage, setReceptorImage] = useState<string | null>(null);
  const [radionicImages, setRadionicImages] = useState<string[]>([]);
  const [receptorImages, setReceptorImages] = useState<string[]>([]);
  const [hypnoticEffect, setHypnoticEffect] = useState(false);
  const [hypnoticSpeed, setHypnoticSpeed] = useState([10]); // Velocidad de oscilación (1-20)
  const [currentImage, setCurrentImage] = useState<'radionic' | 'receptor' | 'mix'>('radionic');
  const [receptorName, setReceptorName] = useState<string>('');
  
  const hypnoticTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Función para el efecto hipnótico
  const startHypnoticEffect = () => {
    // Consideramos ya sea imágenes cargadas o un nombre de receptor
    const hasRadionicImagesOrName = radionicImages.length > 0 || radionicImage || receptorName;
    const hasReceptorImagesOrName = receptorImages.length > 0 || receptorImage || receptorName;
    
    if (hasRadionicImagesOrName || hasReceptorImagesOrName) {
      setHypnoticEffect(true);
      
      // Detenemos cualquier temporizador existente antes de crear uno nuevo
      if (hypnoticTimerRef.current) {
        clearInterval(hypnoticTimerRef.current);
      }
      
      // Configuramos la velocidad basada en el valor del deslizador
      // Valores más altos significan cambios más rápidos entre imágenes
      const switchInterval = Math.max(100, 2000 / hypnoticSpeed[0]);
      
      console.log("Starting hypnotic effect with speed:", hypnoticSpeed[0], "interval:", switchInterval);
      
      // Establecemos inicialmente una imagen para asegurar que ambas sean visibles
      setCurrentImage('radionic');
      
      // Crear el intervalo para alternar entre imágenes
      hypnoticTimerRef.current = setInterval(() => {
        setCurrentImage(prev => {
          // Si tenemos ambas imágenes (o nombre como imagen), alternar entre radionic y receptor
          if ((radionicImages.length > 0 || radionicImage) && 
              (receptorImages.length > 0 || receptorImage || receptorName)) {
            return prev === 'radionic' ? 'receptor' : 'radionic';
          }
          // Si solo tenemos imágenes radiónicas, mantener en 'radionic'
          else if (radionicImages.length > 0 || radionicImage) {
            return 'radionic';
          }
          // Si solo tenemos imágenes de receptor o nombre, mantener en 'receptor'
          else {
            return 'receptor';
          }
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
