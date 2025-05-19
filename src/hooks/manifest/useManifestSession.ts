import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

export const useManifestSession = (
  startImageAlternation: () => void,
  stopImageAlternation: () => void
) => {
  const [isManifestActive, setIsManifestActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const timerIdRef = useRef<number | null>(null);
  const [currentIntention, setCurrentIntention] = useState<string>("");
  const [indefiniteTime, setIndefiniteTime] = useState<boolean>(false);

  // Clean up function to clear timer
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (timerIdRef.current) {
      window.clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }
  }, []);
  
  // Effect to clean up timer on unmount
  useEffect(() => {
    return () => {
      clearTimer();
      stopImageAlternation();
    };
  }, [clearTimer, stopImageAlternation]);

  // Start manifestation function with explicit intention parameter
  const startManifestation = useCallback((intention?: string) => {
    console.log("Starting manifestation with intention:", intention);
    
    if (isManifestActive) {
      console.log("Manifestation already active, stopping first");
      stopImageAlternation();
      clearTimer();
    }
    
    // Store the provided intention
    if (intention) {
      setCurrentIntention(intention);
    }
    
    // Set active state first to trigger visualizer
    setIsManifestActive(true);
    
    // Start image alternation
    startImageAlternation();
    
    // Only set up timer if not in indefinite mode
    if (!indefiniteTime) {
      // Default exposure time (5 minutes)
      const exposureDuration = 5 * 60; 
      setTimeRemaining(exposureDuration);
      
      // Set up interval to count down
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 1) {
            // Time's up - clean up and return null
            clearTimer();
            stopImageAlternation();
            setIsManifestActive(false);
            toast({
              title: "Manifestación completada",
              description: "La sesión de manifestación ha finalizado."
            });
            return null;
          }
          // Otherwise just decrement
          return prev - 1;
        });
      }, 1000);
      
      // Store the timer reference
      timerRef.current = timer;
    }
    
    // Notification
    toast({
      title: "Manifestación iniciada",
      description: indefiniteTime 
        ? "Manifestación en modo indefinido. Puedes detenerla cuando desees."
        : "La manifestación está en curso. Se detendrá automáticamente al finalizar.",
    });
  }, [isManifestActive, indefiniteTime, startImageAlternation, stopImageAlternation, clearTimer]);

  // Stop manifestation function
  const stopManifestation = useCallback(() => {
    console.log("Stopping manifestation");
    
    // Clean up timer
    clearTimer();
    
    // Stop image alternation
    stopImageAlternation();
    
    // Reset state
    setIsManifestActive(false);
    setTimeRemaining(null);
    
    // Notification
    toast({
      title: "Manifestación detenida",
      description: "La sesión de manifestación ha sido detenida."
    });
  }, [clearTimer, stopImageAlternation]);

  // Helper function to format time
  const formatTimeRemaining = useCallback((time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  return {
    isManifestActive,
    timeRemaining,
    startManifestation,
    stopManifestation,
    formatTimeRemaining,
    currentIntention,
    indefiniteTime,
    setIndefiniteTime
  };
};
