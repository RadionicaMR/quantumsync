
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface PendulumVisualProps {
  isPendulumSwinging: boolean;
  pendulumAngle: number;
}

const PendulumVisual: React.FC<PendulumVisualProps> = ({ isPendulumSwinging, pendulumAngle }) => {
  const isMobile = useIsMobile();
  const pendulumHeight = isMobile ? 120 : 150;
  
  return (
    <div className={`relative w-full ${isMobile ? 'h-[150px]' : 'h-[200px]'} flex items-center justify-center`}>
      {/* Círculo de energía de fondo */}
      <div className={`absolute ${isMobile ? 'w-36 h-36' : 'w-48 h-48'} rounded-full bg-quantum-gradient-soft opacity-30 animate-pulse-soft`}></div>
      
      {/* Línea central */}
      <div className={`absolute h-[${pendulumHeight}px] w-[2px] bg-quantum-gradient opacity-40`}></div>
      
      {/* Péndulo holográfico */}
      <motion.div
        className="absolute top-0 w-1"
        style={{ 
          transformOrigin: 'top center',
          rotate: `${pendulumAngle}deg`,
          height: `${pendulumHeight}px`
        }}
        animate={{ 
          rotate: isPendulumSwinging ? ['-30deg', '30deg', '-30deg'] : '0deg' 
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: isPendulumSwinging ? Infinity : 0
        }}
      >
        <div className="w-1 bg-gradient-to-b from-quantum-primary/50 to-quantum-primary/10 relative"
             style={{ height: `${pendulumHeight}px` }}>
          {/* Hilo del péndulo */}
          <div className="absolute inset-0 w-full h-full bg-white/10"></div>
          
          {/* Orbe del péndulo */}
          <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 ${isMobile ? 'w-12 h-12' : 'w-16 h-16'}`}>
            {/* Capas del orbe para efecto holográfico */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 animate-pulse"></div>
            <div className="absolute inset-1 rounded-full bg-gradient-to-br from-purple-600/30 to-blue-600/30 animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-purple-700/40 to-blue-700/40 animate-pulse" style={{animationDelay: '0.4s'}}></div>
            <div className="absolute inset-3 rounded-full bg-gradient-to-br from-quantum-vividpurple/70 to-blue-400/70 backdrop-blur-sm border border-white/20 shadow-[0_0_15px_rgba(138,43,226,0.7)]"></div>
            
            {/* Símbolo en el centro del orbe */}
            <div className="absolute inset-0 flex items-center justify-center text-white text-lg font-bold holographic-gradient">
              Q
            </div>
            
            {/* Destellos de luz */}
            <div className="absolute top-1/4 left-1/4 w-1 h-1 rounded-full bg-white animate-pulse"></div>
            <div className="absolute top-3/4 right-1/4 w-2 h-2 rounded-full bg-white animate-pulse" style={{animationDelay: '0.6s'}}></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PendulumVisual;
