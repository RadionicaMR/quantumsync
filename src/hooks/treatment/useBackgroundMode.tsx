import { useState, useRef, useEffect, useCallback } from 'react';

export const useBackgroundMode = (
  isPlaying: boolean
) => {
  const [backgroundModeActive, setBackgroundModeActive] = useState(false);
  const isPlayingRef = useRef(isPlaying);
  const bgActiveRef = useRef(backgroundModeActive);

  // Keep refs in sync
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { bgActiveRef.current = backgroundModeActive; }, [backgroundModeActive]);

  // Stable handler using refs - no stale closures
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden && isPlayingRef.current) {
      setBackgroundModeActive(true);
    } else if (!document.hidden && bgActiveRef.current) {
      setBackgroundModeActive(false);
    }
  }, []);

  // Single listener, never re-created
  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleVisibilityChange]);

  return {
    backgroundModeActive,
    setBackgroundModeActive
  };
};
