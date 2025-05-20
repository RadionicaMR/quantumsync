
import { useRef, useEffect, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

export const useManifestImageControl = (
  isManifestActive: boolean,
  visualSpeed: number[]
) => {
  // References
  const manifestIntervalRef = useRef<NodeJS.Timeout | number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  
  // Mobile detection
  const { isIOS, isSafari } = useIsMobile();
  
  // Cleanup on unmount or when isManifestActive changes
  useEffect(() => {
    // When isManifestActive becomes false, clean up
    if (!isManifestActive) {
      if (manifestIntervalRef.current) {
        clearInterval(manifestIntervalRef.current as NodeJS.Timeout);
        manifestIntervalRef.current = null;
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }
    
    return () => {
      console.log("Cleaning up useManifestImageControl");
      
      if (manifestIntervalRef.current) {
        clearInterval(manifestIntervalRef.current as NodeJS.Timeout);
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isManifestActive]);
  
  // Function to start image alternation with current state variables stored in closure
  const startImageAlternation = useCallback(() => {
    console.log("Starting image alternation");
    
    // This function will be called by other components that have access to currentImage and setCurrentImage
    return (
      currentImage: 'pattern' | 'receptor' | 'mix' | 'radionic',
      setCurrentImage: (value: ((prev: 'pattern' | 'receptor' | 'mix' | 'radionic') => 'pattern' | 'receptor' | 'mix' | 'radionic') | 'pattern' | 'receptor' | 'mix' | 'radionic') => void
    ) => {
      console.log("Inner startImageAlternation with currentImage:", currentImage);
      
      // Clean up any existing interval/animation frame
      if (manifestIntervalRef.current) {
        clearInterval(manifestIntervalRef.current as NodeJS.Timeout);
        manifestIntervalRef.current = null;
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      // Set the initial image to 'pattern' for consistency
      setCurrentImage('pattern');
      
      // Calculate the interval based on the speed setting (much faster for better visibility)
      const speed = (visualSpeed && visualSpeed.length > 0) ? visualSpeed[0] : 10;
      const switchInterval = Math.max(1000 / Math.max(1, speed * 6), 30); // Make it much faster for better visibility
      
      console.log("Image alternation interval:", switchInterval, "ms with speed:", speed);
      
      // Use requestAnimationFrame for iOS/Safari for better performance
      if (isIOS || isSafari) {
        const animate = (currentTime: number) => {
          const elapsed = currentTime - lastTimeRef.current;
          
          if (elapsed > switchInterval) {
            setCurrentImage(prev => {
              // Toggle between 'pattern' and 'receptor' states
              console.log("Switching image from", prev, "to", prev === 'pattern' ? 'receptor' : 'pattern');
              return prev === 'pattern' ? 'receptor' : 'pattern';
            });
            lastTimeRef.current = currentTime;
          }
          
          animationFrameRef.current = requestAnimationFrame(animate);
        };
        
        lastTimeRef.current = performance.now();
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Standard interval for other browsers
        manifestIntervalRef.current = setInterval(() => {
          setCurrentImage(prev => {
            // Toggle between 'pattern' and 'receptor' states
            console.log("Switching image from", prev, "to", prev === 'pattern' ? 'receptor' : 'pattern');
            return prev === 'pattern' ? 'receptor' : 'pattern';
          });
        }, switchInterval);
      }
    };
  }, [isIOS, isSafari, visualSpeed]);
  
  // Function to stop image alternation
  const stopImageAlternation = useCallback(() => {
    console.log("Stopping image alternation");
    
    // Return a function that accepts setCurrentImage parameter
    return (setCurrentImage?: (value: 'pattern' | 'receptor' | 'mix' | 'radionic') => void) => {
      // Clear interval if it exists
      if (manifestIntervalRef.current) {
        clearInterval(manifestIntervalRef.current as NodeJS.Timeout);
        manifestIntervalRef.current = null;
      }
      
      // Clear animation frame if it exists
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      // Reset to mixed view
      if (setCurrentImage) {
        setCurrentImage('mix');
      }
    };
  }, []);

  return {
    startImageAlternation,
    stopImageAlternation
  };
};
