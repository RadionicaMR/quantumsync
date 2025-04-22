
import { useCallback } from 'react';

export const usePendulumAnimation = () => {
  const startPendulumSwing = useCallback(() => {
    let angle = 0;
    const interval = window.setInterval(() => {
      angle = Math.sin(Date.now() / 500) * 30;
      return angle;
    }, 16);
    
    return { interval, angle };
  }, []);

  const stopPendulumSwing = useCallback((intervalId: number | null) => {
    if (intervalId !== null) {
      clearInterval(intervalId);
    }
  }, []);

  return {
    startPendulumSwing,
    stopPendulumSwing
  };
};
