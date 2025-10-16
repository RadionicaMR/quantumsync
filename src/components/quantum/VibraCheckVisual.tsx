
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
      
      {/* Figura geométrica principal - Hexágono con capas */}
      <motion.div 
        className="absolute flex items-center justify-center"
        style={{ width: size, height: size }}
        animate={isActive ? {
          scale: [1, 1.1, 1],
          rotate: [0, 360]
        } : {}}
        transition={{
          scale: {
            duration: 1.2,
            repeat: isActive ? Infinity : 0,
            ease: "easeInOut"
          },
          rotate: {
            duration: 20,
            repeat: isActive ? Infinity : 0,
            ease: "linear"
          }
        }}
      >
        {/* Hexágono exterior */}
        <svg width={size} height={size} viewBox="0 0 200 200" className="absolute">
          <defs>
            <linearGradient id="hexGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#7C3AED" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          <polygon 
            points="100,20 170,60 170,140 100,180 30,140 30,60" 
            fill="none" 
            stroke="url(#hexGradient1)" 
            strokeWidth="2"
            className="drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]"
          />
        </svg>
        
        {/* Hexágono medio */}
        <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 200 200" className="absolute">
          <defs>
            <linearGradient id="hexGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.7" />
            </linearGradient>
          </defs>
          <polygon 
            points="100,30 160,65 160,135 100,170 40,135 40,65" 
            fill="none" 
            stroke="url(#hexGradient2)" 
            strokeWidth="3"
            className="drop-shadow-[0_0_15px_rgba(139,92,246,0.7)]"
          />
        </svg>
        
        {/* Círculo central con efecto de latido */}
        <motion.div
          className="absolute rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center"
          style={{ width: size * 0.3, height: size * 0.3 }}
          animate={isActive ? {
            scale: [1, 1.2, 1],
            boxShadow: [
              '0 0 20px rgba(139,92,246,0.5)',
              '0 0 40px rgba(139,92,246,0.8)',
              '0 0 20px rgba(139,92,246,0.5)'
            ]
          } : {}}
          transition={{
            duration: 1,
            repeat: isActive ? Infinity : 0,
            ease: "easeInOut",
            delay: 0.1
          }}
        >
          <div className="text-white text-2xl font-bold holographic-gradient">Q</div>
        </motion.div>
        
        {/* Líneas conectoras radiales */}
        <svg width={size} height={size} viewBox="0 0 200 200" className="absolute">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0" />
              <stop offset="50%" stopColor="#A78BFA" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <line 
              key={i}
              x1="100" 
              y1="100" 
              x2={100 + 60 * Math.cos((angle * Math.PI) / 180)} 
              y2={100 + 60 * Math.sin((angle * Math.PI) / 180)} 
              stroke="url(#lineGradient)" 
              strokeWidth="1"
              opacity="0.5"
            />
          ))}
        </svg>
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
