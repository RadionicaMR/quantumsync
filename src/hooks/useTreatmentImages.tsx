
import { useState, useRef, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

export const useTreatmentImages = () => {
  const [visualFeedback, setVisualFeedback] = useState(true);
  const [radionicImage, setRadionicImage] = useState<string | null>(null);
  const [receptorImage, setReceptorImage] = useState<string | null>(null);
  const [radionicImages, setRadionicImages] = useState<string[]>([]);
  const [receptorImages, setReceptorImages] = useState<string[]>([]);
  const [hypnoticEffect, setHypnoticEffect] = useState(false);
  const [hypnoticSpeed, setHypnoticSpeed] = useState([10]); // Velocidad de oscilación (1-20)
  const [currentImage, setCurrentImage] = useState<'radionic' | 'receptor' | 'mix' | 'pattern'>('mix');
  const [receptorName, setReceptorName] = useState<string>('');
  
  const hypnoticTimerRef = useRef<number | NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const { isIOS, isSafari } = useIsMobile();

  // Función mejorada para el efecto hipnótico - optimizada para Safari
  const startHypnoticEffect = () => {
    // Consideramos ya sea imágenes cargadas o un nombre de receptor
    const hasRadionicImagesOrName = radionicImages.length > 0 || radionicImage;
    const hasReceptorImagesOrName = receptorImages.length > 0 || receptorImage || receptorName.trim().length > 0;
    
    if (hasRadionicImagesOrName || hasReceptorImagesOrName) {
      setHypnoticEffect(true);
      
      // Limpieza de temporizadores previos
      stopHypnoticEffect();
      
      // Configuramos la velocidad basada en el valor del deslizador
      // Faster speed (higher value) = shorter interval time
      const switchInterval = 2000 / Math.max(1, hypnoticSpeed[0]);
      
      console.log("Starting hypnotic effect with speed:", hypnoticSpeed[0], "interval:", switchInterval);
      
      // Iniciamos con radionic para asegurar la secuencia completa
      setCurrentImage('radionic');
      
      // Usamos requestAnimationFrame para dispositivos iOS y Safari para mejor rendimiento
      if (isIOS || isSafari) {
        let lastTime = performance.now();
        
        const animate = (currentTime: number) => {
          const elapsed = currentTime - lastTime;
          
          if (elapsed > switchInterval) {
            setCurrentImage(prev => {
              if (prev === 'radionic' || prev === 'pattern') return 'receptor';
              if (prev === 'receptor') return 'radionic';
              return 'radionic';
            });
            lastTime = currentTime;
          }
          
          animationFrameRef.current = requestAnimationFrame(animate);
        };
        
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Standard interval for non-iOS devices
        hypnoticTimerRef.current = setInterval(() => {
          setCurrentImage(prev => {
            if (prev === 'radionic' || prev === 'pattern') return 'receptor';
            if (prev === 'receptor') return 'radionic';
            return 'radionic';
          });
        }, switchInterval);
      }
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
    // Limpieza optimizada para todos los navegadores
    if (hypnoticTimerRef.current) {
      clearInterval(hypnoticTimerRef.current as NodeJS.Timeout);
      hypnoticTimerRef.current = null;
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    setHypnoticEffect(false);
    setCurrentImage('mix'); // Reset to mix view when stopped
  };

  // Cleanup function mejorada para Safari
  useEffect(() => {
    return () => {
      if (hypnoticTimerRef.current) {
        clearInterval(hypnoticTimerRef.current as NodeJS.Timeout);
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Reinicia el efecto hipnótico si cambia la velocidad
  useEffect(() => {
    if (hypnoticEffect) {
      console.log("Hypnotic speed changed, restarting effect with speed:", hypnoticSpeed[0]);
      startHypnoticEffect();
    }
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
