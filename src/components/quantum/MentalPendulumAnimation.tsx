
import { useEffect } from 'react';
import VibraCheckVisual from './VibraCheckVisual';
import { usePendulumAudio } from '@/hooks/usePendulumAudio';

interface MentalPendulumAnimationProps {
  isSwinging: boolean;
  pendulumSound: boolean;
}

const MentalPendulumAnimation: React.FC<MentalPendulumAnimationProps> = ({ 
  isSwinging,
  pendulumSound
}) => {
  const { startPendulumSound, stopPendulumSound } = usePendulumAudio();
  
  useEffect(() => {
    if (isSwinging) {
      // Activar sonido si está habilitado
      if (pendulumSound) {
        startPendulumSound(0.5);
      }
    } else {
      // Detener sonido
      stopPendulumSound();
    }
    
    return () => {
      stopPendulumSound();
    };
  }, [isSwinging, pendulumSound, startPendulumSound, stopPendulumSound]);

  return <VibraCheckVisual isActive={isSwinging} />;
};

export default MentalPendulumAnimation;
