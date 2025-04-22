
import { motion } from 'framer-motion';
import { CHAKRA_POSITIONS, CHAKRA_COLORS, CHAKRA_FREQUENCIES } from '@/constants/chakraData';
import type { ChakraName } from '@/constants/chakraData';

interface ChakraFigureProps {
  currentChakra: ChakraName | '';
}

const ChakraFigure = ({ currentChakra }: ChakraFigureProps) => {
  return (
    <div className="relative w-full max-w-xs mx-auto h-96 mb-8">
      {/* Human figure background */}
      <div className="absolute inset-0 bg-gradient-to-b from-quantum-dark/10 to-quantum-dark/30 rounded-xl overflow-hidden">
        <svg 
          viewBox="0 0 200 400" 
          className="h-full w-full opacity-40"
          style={{ mixBlendMode: 'luminosity' }}
        >
          <path d="M100,30 C130,30 130,10 100,10 C70,10 70,30 100,30 Z" fill="#ddd" />
          <rect x="95" y="30" width="10" height="40" fill="#ddd" />
          <path d="M60,70 L140,70 L130,170 L70,170 Z" fill="#ddd" />
          <path d="M70,170 L50,290 L70,290 L80,170 Z" fill="#ddd" />
          <path d="M130,170 L150,290 L130,290 L120,170 Z" fill="#ddd" />
          <path d="M140,70 L170,120 L150,120 L130,90 Z" fill="#ddd" />
          <path d="M60,70 L30,120 L50,120 L70,90 Z" fill="#ddd" />
        </svg>
      </div>
      
      {/* Chakra points */}
      {(Object.keys(CHAKRA_POSITIONS) as ChakraName[]).map((chakraName) => {
        const isActive = currentChakra === chakraName;
        const yPosition = CHAKRA_POSITIONS[chakraName];
        const color = CHAKRA_COLORS[chakraName];
        
        return (
          <motion.div
            key={chakraName}
            className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center"
            style={{ 
              top: `${yPosition}%`,
              zIndex: 3
            }}
            initial={{ scale: 0.8, opacity: 0.7 }}
            animate={{ 
              scale: isActive ? [0.8, 1.5, 0.8] : 0.8, 
              opacity: isActive ? [0.7, 1, 0.7] : 0.7,
              boxShadow: isActive ? `0 0 30px ${color}` : 'none'
            }}
            transition={{ 
              repeat: isActive ? Infinity : 0, 
              duration: 2
            }}
          >
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ 
                backgroundColor: color,
                boxShadow: isActive ? `0 0 15px ${color}` : 'none'
              }}
            >
              <div className="w-5 h-5 rounded-full bg-white opacity-70" />
            </div>
            
            {isActive && (
              <motion.div
                className="ml-14 bg-black/70 text-white px-3 py-1 rounded-md text-sm font-medium whitespace-nowrap"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {chakraName} - {CHAKRA_FREQUENCIES[chakraName]} Hz
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default ChakraFigure;
