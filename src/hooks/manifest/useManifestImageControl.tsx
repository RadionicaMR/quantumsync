
import { useRef, useEffect, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

export const useManifestImageControl = (
  isManifestActive: boolean,
  visualSpeed: number[]
) => {
  const manifestIntervalRef = useRef<ReturnType<typeof setInterval> | number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const isActiveRef = useRef<boolean>(false);
  
  const { isIOS, isSafari } = useIsMobile();

  const cleanupAnimations = useCallback(() => {
    if (manifestIntervalRef.current) {
      clearInterval(manifestIntervalRef.current as NodeJS.Timeout);
      manifestIntervalRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);
  
  // Sync ref with prop
  useEffect(() => {
    isActiveRef.current = isManifestActive;
    if (!isManifestActive) {
      cleanupAnimations();
    }
    return () => {
      cleanupAnimations();
    };
  }, [isManifestActive, cleanupAnimations]);
  
  const startImageAlternation = useCallback(() => {
    return (
      currentImage: 'pattern' | 'receptor' | 'mix' | 'radionic',
      setCurrentImage: (value: ((prev: 'pattern' | 'receptor' | 'mix' | 'radionic') => 'pattern' | 'receptor' | 'mix' | 'radionic') | 'pattern' | 'receptor' | 'mix' | 'radionic') => void
    ) => {
      cleanupAnimations();
      isActiveRef.current = true;
      setCurrentImage('pattern');
      
      const speed = (visualSpeed && visualSpeed.length > 0) ? visualSpeed[0] : 10;
      const switchInterval = Math.max(1000 / Math.max(1, speed * 6), 30);
      
      if (isIOS || isSafari) {
        const animate = (currentTime: number) => {
          // Use ref to prevent stale closure - critical for Safari
          if (!isActiveRef.current) return;
          
          const elapsed = currentTime - lastTimeRef.current;
          if (elapsed > switchInterval) {
            setCurrentImage(prev => prev === 'pattern' ? 'receptor' : 'pattern');
            lastTimeRef.current = currentTime;
          }
          
          animationFrameRef.current = requestAnimationFrame(animate);
        };
        
        lastTimeRef.current = performance.now();
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        manifestIntervalRef.current = setInterval(() => {
          if (!isActiveRef.current) {
            cleanupAnimations();
            return;
          }
          setCurrentImage(prev => prev === 'pattern' ? 'receptor' : 'pattern');
        }, switchInterval);
      }
    };
  }, [isIOS, isSafari, visualSpeed, cleanupAnimations]);
  
  const stopImageAlternation = useCallback(() => {
    return (setCurrentImage?: (value: 'pattern' | 'receptor' | 'mix' | 'radionic') => void) => {
      isActiveRef.current = false;
      cleanupAnimations();
      if (setCurrentImage) {
        setCurrentImage('mix');
      }
    };
  }, [cleanupAnimations]);

  return {
    startImageAlternation,
    stopImageAlternation
  };
};
