
import { motion } from 'framer-motion';
import { CHAKRA_POSITIONS, CHAKRA_COLORS, CHAKRA_FREQUENCIES } from '@/constants/chakraData';
import type { ChakraName } from '@/constants/chakraData';

interface ChakraFigureProps {
  currentChakra: ChakraName | '';
}

const ChakraFigure = ({ currentChakra }: ChakraFigureProps) => {
  return (
    <div className="relative w-full max-w-xs mx-auto h-96 mb-8">
      {/* Container with blurred edges */}
      <div className="absolute inset-0 rounded-xl bg-black/5 backdrop-blur-[2px]" />
      
      {/* Human figure container - clear, no blur */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img 
          src="/lovable-uploads/398a244d-cfb8-44ba-9036-e14561fe19d0.png"
          alt="Chakra visualization"
          className="h-full object-contain"
        />
      </div>
      
      {/* Chakra points - positioned at the edge */}
      {(Object.keys(CHAKRA_POSITIONS) as ChakraName[]).map((chakraName) => {
        const isActive = currentChakra === chakraName;
        const yPosition = CHAKRA_POSITIONS[chakraName];
        const color = CHAKRA_COLORS[chakraName];
        
        return (
          <motion.div
            key={chakraName}
            className="absolute right-0 transform flex items-center gap-2"
            style={{ 
              top: `${yPosition}%`,
              zIndex: 3
            }}
            initial={{ scale: 0.8, opacity: 0.7 }}
            animate={{ 
              scale: isActive ? [0.8, 1.2, 0.8] : 0.8, 
              opacity: isActive ? [0.7, 1, 0.7] : 0.7
            }}
            transition={{ 
              repeat: isActive ? Infinity : 0, 
              duration: 2
            }}
          >
            <div 
              className="w-3 h-3 rounded-full flex items-center justify-center"
              style={{ 
                backgroundColor: color,
                boxShadow: isActive ? `0 0 15px ${color}` : `0 0 10px ${color}` 
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white opacity-70"></div>
            </div>
            
            {isActive && (
              <motion.div
                className="bg-black/70 text-white px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap"
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

