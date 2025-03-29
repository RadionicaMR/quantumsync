
import { motion } from 'framer-motion';

interface DowsingRingProps {
  inset: number;
  opacity: string;
  reverse?: boolean;
  duration?: string;
}

const DowsingRing: React.FC<DowsingRingProps> = ({ 
  inset, 
  opacity, 
  reverse = false, 
  duration = '8s' 
}) => {
  return (
    <motion.div 
      className={`absolute rounded-full border-4 border-dashed border-quantum-primary/${opacity} animate-spin-slow`}
      style={{ 
        inset: `${inset}px`, 
        animationDirection: reverse ? 'reverse' : 'normal',
        animationDuration: duration
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: inset * 0.02 }}
    />
  );
};

export default DowsingRing;
