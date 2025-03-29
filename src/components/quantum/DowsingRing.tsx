
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
  return (
    <motion.div 
      className={`absolute rounded-full border-4 border-dashed border-quantum-primary/${opacity} animate-spin-slow`}
      style={{ 
        inset: `${inset}px`, 
        animationDirection: reverse ? 'reverse' : 'normal',
        animationDuration: duration,
        boxShadow: pulseEffect ? `0 0 15px rgba(138,43,226,0.${opacity.split('-')[1]})` : 'none'
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        boxShadow: pulseEffect ? [
          `0 0 5px rgba(138,43,226,0.${opacity.split('-')[1]})`,
          `0 0 20px rgba(138,43,226,0.${opacity.split('-')[1]})`,
          `0 0 5px rgba(138,43,226,0.${opacity.split('-')[1]})`
        ] : 'none'
      }}
      transition={{ 
        duration: 0.5, 
        delay: inset * 0.02,
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
