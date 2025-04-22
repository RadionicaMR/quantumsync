
import { motion } from 'framer-motion';

const ChakraHeader = () => {
  return (
    <div className="w-full bg-gradient-to-r from-purple-900/50 via-indigo-800/50 to-purple-900/50 py-12 px-4">
      <motion.div 
        className="container mx-auto text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Equilibrio de Chakras
        </h1>
        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
          Armoniza y balancea los centros energéticos con frecuencias específicas para cada chakra
        </p>
      </motion.div>
    </div>
  );
};

export default ChakraHeader;
