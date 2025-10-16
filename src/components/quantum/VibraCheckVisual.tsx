
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface VibraCheckVisualProps {
  isActive: boolean;
}

const VibraCheckVisual: React.FC<VibraCheckVisualProps> = ({ isActive }) => {
  const isMobile = useIsMobile();
  const size = isMobile ? 160 : 200;
  
  return (
    <div className={`relative w-full ${isMobile ? 'h-[200px]' : 'h-[250px]'} flex items-center justify-center`}>
      {/* Halo violeta semitransparente exterior */}
      <motion.div 
        className="absolute rounded-full bg-gradient-to-br from-purple-500/20 to-violet-600/10 blur-xl"
        style={{ width: size * 1.5, height: size * 1.5 }}
        animate={isActive ? {
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        } : {}}
        transition={{
          duration: 1.5,
          repeat: isActive ? Infinity : 0,
          ease: "easeInOut"
        }}
      />
      
      {/* Halo violeta semitransparente medio */}
      <motion.div 
        className="absolute rounded-full bg-gradient-to-br from-purple-600/30 to-violet-700/20 blur-lg"
        style={{ width: size * 1.2, height: size * 1.2 }}
        animate={isActive ? {
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.6, 0.4]
        } : {}}
        transition={{
          duration: 1.3,
          repeat: isActive ? Infinity : 0,
          ease: "easeInOut",
          delay: 0.2
        }}
      />
      
      {/* Círculos concéntricos */}
      <motion.div 
        className="absolute flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {/* Círculo más grande */}
        <motion.svg 
          width={size} 
          height={size} 
          viewBox="0 0 200 200" 
          className="absolute"
          animate={isActive ? {
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.5, 0.4]
          } : {}}
          transition={{
            duration: 1.2,
            repeat: isActive ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          <defs>
            <linearGradient id="circleGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <circle 
            cx="100" 
            cy="100" 
            r="90" 
            fill="none" 
            stroke="url(#circleGradient1)" 
            strokeWidth="1.5"
            className="drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]"
          />
        </motion.svg>
        
        {/* Círculo grande */}
        <motion.svg 
          width={size * 0.7} 
          height={size * 0.7} 
          viewBox="0 0 200 200" 
          className="absolute"
          animate={isActive ? {
            scale: [1, 1.15, 1],
            opacity: [0.5, 0.6, 0.5]
          } : {}}
          transition={{
            duration: 1.2,
            repeat: isActive ? Infinity : 0,
            ease: "easeInOut",
            delay: 0.1
          }}
        >
          <defs>
            <linearGradient id="circleGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <circle 
            cx="100" 
            cy="100" 
            r="90" 
            fill="none" 
            stroke="url(#circleGradient2)" 
            strokeWidth="2"
            className="drop-shadow-[0_0_12px_rgba(139,92,246,0.6)]"
          />
        </motion.svg>
        
        {/* Círculo medio */}
        <motion.svg 
          width={size * 0.5} 
          height={size * 0.5} 
          viewBox="0 0 200 200" 
          className="absolute"
          animate={isActive ? {
            scale: [1, 1.15, 1],
            opacity: [0.6, 0.7, 0.6]
          } : {}}
          transition={{
            duration: 1.2,
            repeat: isActive ? Infinity : 0,
            ease: "easeInOut",
            delay: 0.2
          }}
        >
          <defs>
            <linearGradient id="circleGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          <circle 
            cx="100" 
            cy="100" 
            r="90" 
            fill="none" 
            stroke="url(#circleGradient3)" 
            strokeWidth="2.5"
            className="drop-shadow-[0_0_15px_rgba(139,92,246,0.7)]"
          />
        </motion.svg>
        
        {/* Círculo pequeño */}
        <motion.svg 
          width={size * 0.3} 
          height={size * 0.3} 
          viewBox="0 0 200 200" 
          className="absolute"
          animate={isActive ? {
            scale: [1, 1.15, 1],
            opacity: [0.7, 0.8, 0.7]
          } : {}}
          transition={{
            duration: 1.2,
            repeat: isActive ? Infinity : 0,
            ease: "easeInOut",
            delay: 0.3
          }}
        >
          <defs>
            <linearGradient id="circleGradient4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DDD6FE" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#C4B5FD" stopOpacity="0.7" />
            </linearGradient>
          </defs>
          <circle 
            cx="100" 
            cy="100" 
            r="90" 
            fill="none" 
            stroke="url(#circleGradient4)" 
            strokeWidth="3"
            className="drop-shadow-[0_0_20px_rgba(139,92,246,0.8)]"
          />
        </motion.svg>
        
        {/* Punto central brillante */}
        <motion.div
          className="absolute rounded-full bg-gradient-to-br from-purple-400 to-violet-500"
          style={{ width: size * 0.05, height: size * 0.05 }}
          animate={isActive ? {
            scale: [1, 1.5, 1],
            boxShadow: [
              '0 0 10px rgba(167,139,250,0.6)',
              '0 0 25px rgba(167,139,250,0.9)',
              '0 0 10px rgba(167,139,250,0.6)'
            ]
          } : {}}
          transition={{
            duration: 1,
            repeat: isActive ? Infinity : 0,
            ease: "easeInOut",
            delay: 0.4
          }}
        />
      </motion.div>
      
      {/* Partículas flotantes */}
      {isActive && [0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-purple-400"
          style={{
            left: '50%',
            top: '50%'
          }}
          animate={{
            x: [0, (Math.random() - 0.5) * 100],
            y: [0, (Math.random() - 0.5) * 100],
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
};

export default VibraCheckVisual;
