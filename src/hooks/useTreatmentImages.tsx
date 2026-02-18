
import { useState, useRef, useEffect, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

export const useTreatmentImages = () => {
  const [visualFeedback, setVisualFeedback] = useState(true);
  const [radionicImage, setRadionicImage] = useState<string | null>(null);
  const [receptorImage, setReceptorImage] = useState<string | null>(null);
  const [radionicImages, setRadionicImages] = useState<string[]>([]);
  const [receptorImages, setReceptorImages] = useState<string[]>([]);
  const [hypnoticEffect, setHypnoticEffect] = useState(false);
  const [hypnoticSpeed, setHypnoticSpeed] = useState([10]);
  const [currentImage, setCurrentImage] = useState<'radionic' | 'receptor' | 'mix' | 'pattern'>('mix');
  const [receptorName, setReceptorName] = useState<string>('');
  
  const hypnoticTimerRef = useRef<number | NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  // CRITICAL FIX: Use a ref to track active state for animation callbacks
  // This prevents stale closure issues in Safari where the state value
  // captured at callback creation time doesn't reflect the current state
  const hypnoticActiveRef = useRef<boolean>(false);
  const { isIOS, isSafari } = useIsMobile();

  const cleanupTimers = useCallback(() => {
    if (hypnoticTimerRef.current) {
      clearInterval(hypnoticTimerRef.current as NodeJS.Timeout);
      hypnoticTimerRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const stopHypnoticEffect = useCallback(() => {
    hypnoticActiveRef.current = false;
    cleanupTimers();
    setHypnoticEffect(false);
    setCurrentImage('mix');
  }, [cleanupTimers]);

  const startHypnoticEffect = useCallback(() => {
    // Always clean up first
    cleanupTimers();
    
    const hasRadionicContent = radionicImages.length > 0 || !!radionicImage;
    const hasReceptorContent = receptorImages.length > 0 || !!receptorImage || receptorName.trim().length > 0;
    
    if (!hasRadionicContent && !hasReceptorContent) {
      console.log("Cannot start hypnotic effect: no images or receptor");
      return;
    }
    
    // Set ref BEFORE starting animation - this is the source of truth for callbacks
    hypnoticActiveRef.current = true;
    setHypnoticEffect(true);
    setCurrentImage('radionic');
    
    const switchInterval = 2000 / Math.max(1, hypnoticSpeed[0]);
    
    if (isIOS || isSafari) {
      let lastTime = performance.now();
      
      const animate = (currentTime: number) => {
        // CRITICAL: Check ref, not state - prevents stale closure freeze
        if (!hypnoticActiveRef.current) return;
        
        const elapsed = currentTime - lastTime;
        if (elapsed > switchInterval) {
          setCurrentImage(prev => prev === 'radionic' || prev === 'pattern' ? 'receptor' : 'radionic');
          lastTime = currentTime;
        }
        
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      hypnoticTimerRef.current = setInterval(() => {
        if (!hypnoticActiveRef.current) {
          cleanupTimers();
          return;
        }
        setCurrentImage(prev => prev === 'radionic' || prev === 'pattern' ? 'receptor' : 'radionic');
      }, switchInterval);
    }
  }, [radionicImages, radionicImage, receptorImages, receptorImage, receptorName, hypnoticSpeed, isIOS, isSafari, cleanupTimers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      hypnoticActiveRef.current = false;
      cleanupTimers();
    };
  }, [cleanupTimers]);

  // Restart effect if speed changes while active
  useEffect(() => {
    if (hypnoticActiveRef.current) {
      startHypnoticEffect();
    }
  }, [hypnoticSpeed]); // intentionally not including startHypnoticEffect to avoid infinite loop

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
    setHypnoticEffect,
    hypnoticSpeed,
    setHypnoticSpeed,
    currentImage,
    receptorName,
    setReceptorName,
    startHypnoticEffect,
    stopHypnoticEffect
  };
};
