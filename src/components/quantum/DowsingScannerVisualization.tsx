
import { motion } from 'framer-motion';
import type { Chakra } from '@/hooks/useDowsingScanner';

interface DowsingScannerVisualizationProps {
  scanning: boolean;
  scanBarPosition: string;
  chakras: Chakra[];
  scanComplete: boolean;
  progressBarRef: React.RefObject<HTMLDivElement>;
}

const DowsingScannerVisualization: React.FC<DowsingScannerVisualizationProps> = ({
  scanning,
  scanBarPosition,
  chakras,
  scanComplete,
  progressBarRef
}) => {
  return (
    <div className="relative w-full mx-auto mb-8 h-96 flex">
      {/* Container with blurred edges */}
      <div className="absolute left-0 w-3/4 h-full rounded-xl bg-black/5 backdrop-blur-[2px]" />
      
      {/* Human figure container - clear, no blur */}
      <div className="absolute left-0 w-3/4 h-full flex items-center justify-center">
        <img 
          src="/lovable-uploads/398a244d-cfb8-44ba-9036-e14561fe19d0.png"
          alt="Chakra visualization"
          className="h-full object-contain"
        />
      </div>
      
      {/* Chakra indicators positioned over the image */}
      <div className="absolute left-0 w-3/4 h-full">
        {chakras.map((chakra, index) => (
          <motion.div
            key={chakra.name}
            className="absolute right-0 flex items-center gap-2"
            style={{
              top: `${chakra.yPosition}%`,
              transform: 'translateY(-50%)',
              zIndex: 10
            }}
            initial={{ scale: 0.8, opacity: 0.7 }}
            animate={{ 
              scale: scanning ? [0.8, 1.2, 0.8] : 0.8, 
              opacity: scanning ? [0.7, 1, 0.7] : 1 
            }}
            transition={{ 
              repeat: scanning ? Infinity : 0, 
              duration: 2,
              delay: index * 0.3 
            }}
          >
            <div 
              className="w-2.5 h-2.5 rounded-full flex items-center justify-center"
              style={{ 
                backgroundColor: chakra.color,
                boxShadow: `0 0 10px ${chakra.color}` 
              }}
            >
              <div className="w-1 h-1 rounded-full bg-white opacity-70"></div>
            </div>
            
            <span className="text-xs font-medium whitespace-nowrap">{chakra.name}</span>
            
            {scanComplete && chakra.state && (
              <motion.div
                className="ml-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-medium"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                {chakra.state}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
      
      {/* Scanning bar */}
      {scanning && (
        <motion.div 
          className="absolute left-0 w-3/4 h-1 bg-gradient-to-r from-quantum-primary/20 via-quantum-primary to-quantum-primary/20"
          style={{ 
            top: scanBarPosition,
            boxShadow: '0 0 10px rgba(155, 135, 245, 0.7)'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          ref={progressBarRef}
        />
      )}
    </div>
  );
};

export default DowsingScannerVisualization;
