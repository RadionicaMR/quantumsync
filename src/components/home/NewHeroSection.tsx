import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import mockupChakraBalance from '@/assets/mockup-chakra-balance.png';

const NewHeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-[#0f0520]">
      {/* Animated background waves */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse-soft" />
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse-soft" style={{ animationDelay: '1s' }} />
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse-soft" style={{ animationDelay: '2s' }} />
      </div>

      {/* Geometric sacred background */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-purple-500" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="gradient-text-quantum">
                Transformá la energía de tus pacientes
              </span>
              <br />
              <span className="text-white">
                a distancia con precisión cuántica
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-purple-200/90 max-w-3xl mx-auto leading-relaxed"
          >
            Quantumsync es una tecnología de <span className="text-purple-300 font-semibold">Radiónica Cuántica</span> que amplifica el poder de tus terapias energéticas mediante frecuencias en Hertz, conectando <span className="text-blue-300 font-semibold">ciencia y conciencia</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center mt-12"
          >
            <Button
              size="lg"
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 hover:from-purple-700 hover:via-purple-600 hover:to-blue-600 text-white text-lg px-12 py-6 h-auto rounded-full shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] transition-all duration-300 font-semibold"
            >
              Registrate ahora
            </Button>
          </motion.div>

          {/* Mockup placeholder with glow effect */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-16 relative"
          >
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-500/20 to-purple-600/20 blur-3xl" />
              <div className="relative bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-sm rounded-3xl p-8 border border-purple-500/30 shadow-2xl">
                <div className="aspect-video bg-black/40 rounded-2xl border border-purple-400/20 flex items-center justify-center overflow-hidden">
                  <img 
                    src={mockupChakraBalance} 
                    alt="QuantumSync App Interface - Equilibrio de Chakras"
                    className="h-full w-auto object-contain"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default NewHeroSection;
