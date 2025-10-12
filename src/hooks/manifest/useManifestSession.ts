import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useSessionRecording } from '@/hooks/useSessionRecording';

export const useManifestSession = (
  startImageAlternationFn: () => (currentImage: 'pattern' | 'receptor' | 'mix' | 'radionic', setCurrentImage: (value: any) => void) => void,
  stopImageAlternationFn: () => (setCurrentImage?: (value: 'pattern' | 'receptor' | 'mix' | 'radionic') => void) => void
) => {
  const { recordSession: recordToDatabase } = useSessionRecording();
  const [isManifestActive, setIsManifestActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const timerIdRef = useRef<number | null>(null);
  const [currentIntention, setCurrentIntention] = useState<string>("");
  const [indefiniteTime, setIndefiniteTime] = useState<boolean>(false);
  const startTimeRef = useRef<Date | null>(null);
  
  // Store references to the image alternation functions
  const startImageAlternation = useRef(startImageAlternationFn());
  const stopImageAlternation = useRef(stopImageAlternationFn());
  
  // Update the refs when the functions change
  useEffect(() => {
    startImageAlternation.current = startImageAlternationFn();
    stopImageAlternation.current = stopImageAlternationFn();
  }, [startImageAlternationFn, stopImageAlternationFn]);

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
      // We can't call stopImageAlternation here because it needs setCurrentImage
      // This will be handled in useManifestImageControl's own cleanup
    };
  }, [clearTimer]);

  // Start manifestation function with explicit intention parameter
  const startManifestation = useCallback((intention?: string) => {
    console.log("Starting manifestation with intention:", intention);
    
    if (isManifestActive) {
      console.log("Manifestation already active, stopping first");
      // We'll handle this in the component that uses this hook
      clearTimer();
    }
    
    // Store the provided intention
    if (intention) {
      setCurrentIntention(intention);
    }
    
    // Record start time
    startTimeRef.current = new Date();
    
    // Set active state first to trigger visualizer
    setIsManifestActive(true);
    
    // The actual startImageAlternation will be called by components that have access to currentImage and setCurrentImage
    
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
            // We'll handle stopping the image alternation in the component
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
  }, [isManifestActive, indefiniteTime, clearTimer]);

  // Stop manifestation function
  const stopManifestation = useCallback(async () => {
    console.log("Stopping manifestation");
    
    // Calculate duration if we have a start time
    const duration = startTimeRef.current 
      ? Math.floor((new Date().getTime() - startTimeRef.current.getTime()) / 1000 / 60)
      : 0;
    
    // Save session to database if we have an intention
    if (currentIntention) {
      await recordToDatabase(
        currentIntention,
        'manifestation',
        {
          intention: currentIntention,
          duration,
          indefiniteMode: indefiniteTime,
          completedAt: new Date().toISOString()
        }
      );
    }
    
    // Clean up timer
    clearTimer();
    
    // The actual stopImageAlternation will be called by components that have access to setCurrentImage
    
    // Reset state
    setIsManifestActive(false);
    setTimeRemaining(null);
    startTimeRef.current = null;
    
    // Notification
    toast({
      title: "Manifestación detenida",
      description: "La sesión de manifestación ha sido detenida."
    });
  }, [clearTimer, currentIntention, indefiniteTime, recordToDatabase]);

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
    setIndefiniteTime,
    // Pass the image alternation functions
    getStartImageAlternation: () => startImageAlternation.current,
    getStopImageAlternation: () => stopImageAlternation.current
  };
};
