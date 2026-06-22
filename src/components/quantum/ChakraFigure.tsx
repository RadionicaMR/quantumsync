
import { motion } from 'framer-motion';
import { CHAKRA_POSITIONS, CHAKRA_COLORS, CHAKRA_FREQUENCIES } from '@/constants/chakraData';
import type { ChakraName } from '@/constants/chakraData';

interface ChakraFigureProps {
  currentChakra: ChakraName | '';
}

const ChakraFigure = ({ currentChakra }: ChakraFigureProps) => {
  return (
    <div className="relative w-full max-w-xs mx-auto h-96 mb-8">
      {/* Soft glow backdrop to blend image edges with page */}
      <div className="absolute inset-0 bg-quantum-primary/10 blur-3xl rounded-full" />

      {/* Human figure with feathered edges */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src="/lovable-uploads/398a244d-cfb8-44ba-9036-e14561fe19d0.png"
          alt="Chakra visualization"
          className="h-full object-contain"
          style={{
            WebkitMaskImage:
              'radial-gradient(ellipse 60% 70% at center, black 30%, transparent 100%)',
            maskImage:
              'radial-gradient(ellipse 60% 70% at center, black 30%, transparent 100%)',
          }}
        />
      </div>

      {/* Legend dots on the right edge (always visible) */}
      {(Object.keys(CHAKRA_POSITIONS) as ChakraName[]).map((chakraName) => {
        const yPosition = CHAKRA_POSITIONS[chakraName];
        const color = CHAKRA_COLORS[chakraName];
        return (
          <div
            key={`legend-${chakraName}`}
            className="absolute right-1"
            style={{ top: `${yPosition}%`, zIndex: 3 }}
          >
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
            />
          </div>
        );
      })}

      {/* Pulsing active chakra over the body */}
      {(Object.keys(CHAKRA_POSITIONS) as ChakraName[]).map((chakraName) => {
        if (currentChakra !== chakraName) return null;
        const yPosition = CHAKRA_POSITIONS[chakraName];
        const color = CHAKRA_COLORS[chakraName];

        return (
          <motion.div
            key={chakraName}
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2"
            style={{ top: `${yPosition}%`, zIndex: 4 }}
            initial={{ scale: 0.8, opacity: 0.7 }}
            animate={{ scale: [0.9, 1.3, 0.9], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <div
              className="w-4 h-4 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: color,
                boxShadow: `0 0 22px ${color}, 0 0 40px ${color}`,
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />
            </div>

            <motion.div
              className="bg-black/70 text-white px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {chakraName} - {CHAKRA_FREQUENCIES[chakraName]} Hz
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ChakraFigure;

