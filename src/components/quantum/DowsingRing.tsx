
import { motion } from 'framer-motion';

interface DowsingRingProps {
  inset: number;
  opacity: string;
  reverse?: boolean;
  duration?: string;
  pulseEffect?: boolean;
}

const DowsingRing: React.FC<DowsingRingProps> = ({ 
  inset, 
  opacity, 
  reverse = false, 
  duration = '8s',
  pulseEffect = false
}) => {
  // Convertir el string de opacidad a número para usarlo en los efectos
  const opacityValue = opacity.split('-')[1] ? Number(opacity.split('-')[1]) / 100 : 0.5;
  
  return (
    <motion.div 
      className={`absolute rounded-full border-2 border-dashed border-quantum-primary/${opacity} animate-spin-slow`}
      style={{ 
        inset: `${inset}px`, 
        animationDirection: reverse ? 'reverse' : 'normal',
        animationDuration: duration,
        background: `radial-gradient(circle, transparent 60%, rgba(138,43,226,${opacityValue * 0.05}))`,
        boxShadow: pulseEffect ? `0 0 15px rgba(138,43,226,${opacityValue}), inset 0 0 20px rgba(138,43,226,${opacityValue * 0.7})` : 'none'
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        boxShadow: pulseEffect ? [
          `0 0 5px rgba(138,43,226,${opacityValue}), inset 0 0 10px rgba(138,43,226,${opacityValue * 0.5})`,
          `0 0 20px rgba(138,43,226,${opacityValue}), inset 0 0 25px rgba(138,43,226,${opacityValue * 0.7})`,
          `0 0 5px rgba(138,43,226,${opacityValue}), inset 0 0 10px rgba(138,43,226,${opacityValue * 0.5})`
        ] : 'none'
      }}
      transition={{ 
        duration: 0.8, 
        delay: inset * 0.01,
        boxShadow: {
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut"
        }
      }}
    />
  );
};

export default DowsingRing;
