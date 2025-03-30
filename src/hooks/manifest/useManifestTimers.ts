
import { useRef } from 'react';
import { ManifestTimers } from './types';

export const useManifestTimers = (): ManifestTimers & {
  clearAllTimers: () => void;
} => {
  const hypnoticTimerRef = useRef<NodeJS.Timeout | null>(null);
  const exposureTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearAllTimers = () => {
    if (hypnoticTimerRef.current) {
      clearInterval(hypnoticTimerRef.current);
      hypnoticTimerRef.current = null;
    }

    if (exposureTimerRef.current) {
      clearTimeout(exposureTimerRef.current);
      exposureTimerRef.current = null;
    }
    
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
  };

  return {
    hypnoticTimerRef,
    exposureTimerRef,
    countdownTimerRef,
    clearAllTimers,
  };
};
