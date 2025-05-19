
import { useRef, useEffect } from 'react';
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
  
  // Function to start image alternation
  const startImageAlternation = (
    currentImage: 'pattern' | 'receptor' | 'mix' | 'radionic',
    setCurrentImage: (value: ((prev: 'pattern' | 'receptor' | 'mix' | 'radionic') => 'pattern' | 'receptor' | 'mix' | 'radionic') | 'pattern' | 'receptor' | 'mix' | 'radionic') => void
  ) => {
    console.log("Starting image alternation with currentImage:", currentImage);
    
    // Clean up any existing interval/animation frame
    stopImageAlternation();
    
    // Set the initial image to 'pattern' for consistency
    setCurrentImage('pattern');
    
    // Calculate the interval based on the speed setting (much faster for better visibility)
    const speed = (visualSpeed && visualSpeed.length > 0) ? visualSpeed[0] : 10;
    const switchInterval = Math.max(1000 / Math.max(1, speed * 6), 30); // Make it much faster for better visibility
    
    console.log("Image alternation interval:", switchInterval, "ms with speed:", speed);
    
    // Use requestAnimationFrame for iOS/Safari for better performance
    if (isIOS || isSafari) {
      const animate = (currentTime: number) => {
        if (!isManifestActive) return; // Stop if not active
        
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
  
  // Function to stop image alternation
  const stopImageAlternation = (
    setCurrentImage?: (value: 'pattern' | 'receptor' | 'mix' | 'radionic') => void
  ) => {
    console.log("Stopping image alternation");
    
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

  // Update interval if visualSpeed changes while active
  useEffect(() => {
    if (isManifestActive && (manifestIntervalRef.current || animationFrameRef.current)) {
      console.log("Updating image alternation speed to:", visualSpeed[0]);
      
      // Store the current setCurrentImage function from somewhere
      // For now, we'll handle restarts at the session level
    }
  }, [visualSpeed, isManifestActive]);

  return {
    startImageAlternation,
    stopImageAlternation
  };
};
