
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
      // Begin pendulum swing animation with increased amplitude
      swingInterval = window.setInterval(() => {
        // Aumentamos la amplitud de 30 a 40 grados para un movimiento más notorio
        const angle = Math.sin(Date.now() / 500) * 40;
        setPendulumAngle(angle);
      }, 16);
      
      // Play sound if enabled
      if (pendulumSound) {
        startPendulumSound(0.2); // Aumentamos ligeramente el volumen para mejor retroalimentación
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
