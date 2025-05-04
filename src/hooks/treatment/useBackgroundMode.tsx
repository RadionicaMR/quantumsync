
import { useState, useRef, useEffect } from 'react';

export const useBackgroundMode = (
  isPlaying: boolean, 
  stopAudio: () => void,
  restartAudio: () => void,
  setTimeRemaining: (time: number) => void
) => {
  const [backgroundModeActive, setBackgroundModeActive] = useState(false);
  const pausedTimeRemainingRef = useRef<number | null>(null);

  // Function to handle when the app goes to background
  const handleVisibilityChange = () => {
    if (document.hidden && isPlaying) {
      console.log("App went to background while a treatment was running");
      setBackgroundModeActive(true);
      
      // Save remaining time
      if (pausedTimeRemainingRef.current !== null) {
        console.log(`Saving current time remaining: ${pausedTimeRemainingRef.current.toFixed(2)} minutes`);
      }
      
      // Stop audio but don't reset isPlaying state
      stopAudio();
    } else if (!document.hidden && backgroundModeActive) {
      console.log("App returned to foreground, restoring treatment");
      setBackgroundModeActive(false);
      
      // Restart if it was playing
      if (isPlaying && pausedTimeRemainingRef.current !== null && pausedTimeRemainingRef.current > 0) {
        console.log(`Restoring audio with ${pausedTimeRemainingRef.current.toFixed(2)} minutes remaining`);
        
        // Restore timer and audio
        setTimeRemaining(pausedTimeRemainingRef.current);
        restartAudio();
        pausedTimeRemainingRef.current = null;
      }
    }
  };

  // Add event listener for visibility change
  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    console.log("Visibility change listener added for background mode");
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      console.log("Visibility change listener removed for background mode");
    };
  }, [isPlaying, backgroundModeActive]);

  return {
    backgroundModeActive,
    setBackgroundModeActive,
    pausedTimeRemainingRef
  };
};
