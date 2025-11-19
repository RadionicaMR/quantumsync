
import { useState, useRef, useEffect } from 'react';

export const useBackgroundMode = (
  isPlaying: boolean
) => {
  const [backgroundModeActive, setBackgroundModeActive] = useState(false);

  // Function to handle when the app goes to background
  // Audio will continue playing in background - no need to stop it
  const handleVisibilityChange = () => {
    if (document.hidden && isPlaying) {
      console.log("App went to background - audio continues playing");
      setBackgroundModeActive(true);
    } else if (!document.hidden && backgroundModeActive) {
      console.log("App returned to foreground");
      setBackgroundModeActive(false);
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
    setBackgroundModeActive
  };
};
