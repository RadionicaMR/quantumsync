
import { useState, useRef, useEffect } from 'react';

export const useTimer = () => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [duration, setDuration] = useState<number[]>([5]);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const isRunningRef = useRef<boolean>(false);
  const onTimerCompleteRef = useRef<(() => void) | null>(null);

  // Format time function
  const formatTime = (minutes: number) => {
    const mins = Math.floor(minutes);
    const secs = Math.round((minutes - mins) * 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = (initialTimeMinutes: number, onComplete?: () => void) => {
    // Prevent starting multiple timers
    if (isRunningRef.current) {
      console.log("Timer is already running, not starting a new one");
      return;
    }
    
    // Clear existing timer if there is one
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    console.log(`Starting timer with ${initialTimeMinutes} minutes`);
    startTimeRef.current = Date.now();
    isRunningRef.current = true;
    onTimerCompleteRef.current = onComplete || null;
    
    // Set initial time
    setTimeRemaining(initialTimeMinutes);
    
    // Use window.setInterval for more accurate timing
    const intervalMS = 1000; // Update every second
    
    timerRef.current = window.setInterval(() => {
      if (!startTimeRef.current || !isRunningRef.current) {
        clearTimer();
        return;
      }
      
      const elapsedMs = Date.now() - startTimeRef.current;
      const elapsedMinutes = elapsedMs / (1000 * 60);
      const newTimeRemaining = Math.max(0, initialTimeMinutes - elapsedMinutes);
      
      setTimeRemaining(newTimeRemaining);
      
      if (newTimeRemaining <= 0) {
        console.log("Time's up, timer completed - calling onComplete");
        
        // Call the completion callback before clearing
        if (onTimerCompleteRef.current) {
          onTimerCompleteRef.current();
        }
        
        clearTimer();
      }
    }, intervalMS);
  };

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
      console.log("Timer cleared");
    }
    startTimeRef.current = null;
    isRunningRef.current = false;
    onTimerCompleteRef.current = null;
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, []);

  return {
    timeRemaining,
    setTimeRemaining,
    duration,
    setDuration,
    timerRef,
    startTimeRef,
    formatTime,
    startTimer,
    clearTimer,
    isRunningRef
  };
};
