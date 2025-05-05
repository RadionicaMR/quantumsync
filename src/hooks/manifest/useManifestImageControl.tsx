
import { useRef, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

export const useManifestImageControl = (
  isManifestActive: boolean,
  visualSpeed: number[]
) => {
  // Referencias
  const manifestIntervalRef = useRef<NodeJS.Timeout | number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  
  // Mobile detection
  const { isIOS, isSafari } = useIsMobile();
  
  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      console.log("Cleaning up useManifestImageControl");
      
      if (manifestIntervalRef.current) {
        clearInterval(manifestIntervalRef.current as NodeJS.Timeout);
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  // Función para establecer la imagen actual
  const setCurrentImage = (
    prev: 'pattern' | 'receptor' | 'mix' | 'radionic'
  ): 'pattern' | 'receptor' | 'mix' | 'radionic' => {
    // Toggle between 'pattern' and 'receptor' states
    return prev === 'pattern' ? 'receptor' : 'pattern';
  };
  
  // Función para iniciar la alternancia de imágenes
  const startImageAlternation = (
    currentImage: 'pattern' | 'receptor' | 'mix' | 'radionic',
    setCurrentImage: (value: ((prev: 'pattern' | 'receptor' | 'mix' | 'radionic') => 'pattern' | 'receptor' | 'mix' | 'radionic') | 'pattern' | 'receptor' | 'mix' | 'radionic') => void
  ) => {
    console.log("Starting image alternation in Manifest");
    
    // Limpia cualquier intervalo/frame de animación existente
    stopImageAlternation();
    
    // Establece la imagen inicial - usando 'pattern' para consistencia con las expectativas del componente
    setCurrentImage('pattern');
    
    // Calcula el intervalo basado en la configuración de velocidad (más rápido = intervalo más corto)
    const speed = (visualSpeed && visualSpeed.length > 0) ? visualSpeed[0] : 10;
    const switchInterval = 2000 / Math.max(1, speed);
    
    console.log("Setting up image alternation with interval:", switchInterval);
    
    // Usar requestAnimationFrame para iOS/Safari para mejor rendimiento
    if (isIOS || isSafari) {
      const animate = (currentTime: number) => {
        if (!isManifestActive) return; // Detener si no está activo
        
        const elapsed = currentTime - lastTimeRef.current;
        
        if (elapsed > switchInterval) {
          setCurrentImage(prev => {
            // Alternar entre estados 'pattern' y 'receptor'
            return prev === 'pattern' ? 'receptor' : 'pattern';
          });
          lastTimeRef.current = currentTime;
        }
        
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      
      lastTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      // Intervalo estándar para otros navegadores
      manifestIntervalRef.current = setInterval(() => {
        setCurrentImage(prev => {
          // Alternar entre estados 'pattern' y 'receptor'
          return prev === 'pattern' ? 'receptor' : 'pattern';
        });
      }, switchInterval);
    }
  };
  
  // Función para detener la alternancia de imágenes
  const stopImageAlternation = (
    setCurrentImage?: (value: 'pattern' | 'receptor' | 'mix' | 'radionic') => void
  ) => {
    console.log("Stopping image alternation in Manifest");
    
    // Limpiar intervalo si existe
    if (manifestIntervalRef.current) {
      clearInterval(manifestIntervalRef.current as NodeJS.Timeout);
      manifestIntervalRef.current = null;
    }
    
    // Limpiar frame de animación si existe
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Resetear a vista mixta
    if (setCurrentImage) {
      setCurrentImage('mix');
    }
  };

  return {
    startImageAlternation,
    stopImageAlternation
  };
};
