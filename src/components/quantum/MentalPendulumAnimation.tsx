
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
      // Aumentar la amplitud del péndulo para mejor visualización
      swingInterval = window.setInterval(() => {
        // Amplitud de 60 grados para un movimiento más dramático
        const angle = Math.sin(Date.now() / 500) * 60;
        setPendulumAngle(angle);
      }, 16);
      
      // Activar sonido si está habilitado
      if (pendulumSound) {
        startPendulumSound(0.5); // Volumen más alto para mejor retroalimentación
      }
    } else {
      // Detener animación y restablecer ángulo
      setPendulumAngle(0);
      // Detener sonido
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
