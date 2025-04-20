
import { useRef } from 'react';
import { ManifestTimers } from './types';

export const useManifestTimers = (): ManifestTimers & {
  clearAllTimers: () => void;
  setHypnoticTimer: (timer: NodeJS.Timeout) => void;
  setExposureTimer: (timer: NodeJS.Timeout) => void;
  setCountdownTimer: (timer: NodeJS.Timeout) => void;
} => {
  const hypnoticTimerRef = useRef<NodeJS.Timeout | null>(null);
  const exposureTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  const setHypnoticTimer = (timer: NodeJS.Timeout) => {
    if (hypnoticTimerRef.current) {
      clearInterval(hypnoticTimerRef.current);
    }
    hypnoticTimerRef.current = timer;
  };

  const setExposureTimer = (timer: NodeJS.Timeout) => {
    if (exposureTimerRef.current) {
      clearTimeout(exposureTimerRef.current);
    }
    exposureTimerRef.current = timer;
  };

  const setCountdownTimer = (timer: NodeJS.Timeout) => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }
    countdownTimerRef.current = timer;
  };

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
    setHypnoticTimer,
    setExposureTimer,
    setCountdownTimer,
  };
};
