
import { useState, useEffect } from 'react';
import PendulumVisual from './PendulumVisual';
import { usePendulumAudio } from '@/hooks/usePendulumAudio';

interface MentalPendulumAnimationProps {
  isSwinging: boolean;
  pendulumSound: boolean;
}

const MentalPendulumAnimation: React.FC<MentalPendulumAnimationProps> = ({ 
  isSwinging,
  pendulumSound
}) => {
  const [pendulumAngle, setPendulumAngle] = useState(0);
  const { startPendulumSound, stopPendulumSound } = usePendulumAudio();
  
  useEffect(() => {
    let swingInterval: number | null = null;
    
    if (isSwinging) {
      // Begin pendulum swing animation
      swingInterval = window.setInterval(() => {
        const angle = Math.sin(Date.now() / 500) * 30;
        setPendulumAngle(angle);
      }, 16);
      
      // Play sound if enabled
      if (pendulumSound) {
        startPendulumSound();
      }
    } else {
      // Stop animation and reset angle
      setPendulumAngle(0);
      // Stop sound
      stopPendulumSound();
    }
    
    return () => {
      if (swingInterval) clearInterval(swingInterval);
      stopPendulumSound();
    };
  }, [isSwinging, pendulumSound, startPendulumSound, stopPendulumSound]);

  return <PendulumVisual isPendulumSwinging={isSwinging} pendulumAngle={pendulumAngle} />;
};

export default MentalPendulumAnimation;
