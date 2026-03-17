
import { useRef } from 'react';
import { ManifestTimers } from './types';

type TimerHandle = ReturnType<typeof setTimeout>;

export const useManifestTimers = (): ManifestTimers & {
  clearAllTimers: () => void;
  setHypnoticTimer: (timer: TimerHandle) => void;
  setExposureTimer: (timer: TimerHandle) => void;
  setCountdownTimer: (timer: TimerHandle) => void;
} => {
  const hypnoticTimerRef = useRef<TimerHandle | null>(null);
  const exposureTimerRef = useRef<TimerHandle | null>(null);
  const countdownTimerRef = useRef<TimerHandle | null>(null);

  const setHypnoticTimer = (timer: TimerHandle) => {
    if (hypnoticTimerRef.current) {
      clearInterval(hypnoticTimerRef.current);
    }
    hypnoticTimerRef.current = timer;
  };

  const setExposureTimer = (timer: TimerHandle) => {
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
