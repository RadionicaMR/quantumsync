import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

const PricingSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-[#1a0b2e] via-[#0f0520] to-[#0a0118] relative overflow-hidden">
      {/* Animated glow effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse-soft" />
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-8"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="gradient-text-quantum">Tu energía merece evolucionar</span>
          </h2>

          <p className="text-xl text-purple-200/90 max-w-2xl mx-auto leading-relaxed">
            Cada día que pasa sin amplificar tu potencial terapéutico es una oportunidad perdida de transformar más vidas.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative max-w-2xl mx-auto mt-12"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-500/20 to-purple-600/20 blur-3xl" />
            <div className="relative bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-sm p-12 rounded-3xl border border-purple-500/30">
              <Sparkles className="w-12 h-12 text-purple-300 mx-auto mb-6" />
              <p className="text-lg text-purple-100 mb-8 leading-relaxed">
                No es solo una herramienta. Es el puente entre tu intención y el campo cuántico. Es la evolución que tu práctica necesita.
              </p>
              <Button
                size="lg"
                onClick={() => navigate('/purchase')}
                className="w-full md:w-auto bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 hover:from-purple-700 hover:via-purple-600 hover:to-blue-600 text-white text-lg px-12 py-6 h-auto rounded-full shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] transition-all duration-300 font-semibold"
              >
                INICIA AHORA
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12"
          >
            <div className="relative max-w-4xl mx-auto">
              {/* Glow effect particles */}
              <div className="absolute -top-20 left-1/4 w-32 h-32 bg-purple-500/30 rounded-full blur-3xl animate-pulse-soft" />
              <div className="absolute -bottom-20 right-1/4 w-32 h-32 bg-blue-500/30 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
              
              {/* Decorative elements */}
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-24 bg-gradient-to-b from-purple-500 via-blue-500 to-purple-500 rounded-full opacity-60" />
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-2 h-24 bg-gradient-to-b from-purple-500 via-blue-500 to-purple-500 rounded-full opacity-60" />
              
              <div className="relative bg-gradient-to-br from-purple-900/40 via-blue-900/30 to-purple-900/40 backdrop-blur-sm rounded-3xl border-2 border-purple-400/30 shadow-[0_0_50px_rgba(168,85,247,0.3)] overflow-hidden p-10 md:p-12">
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent animate-shimmer" />
                
                {/* Quote marks */}
                <div className="absolute top-4 left-6 text-6xl text-purple-400/20 font-cormorant leading-none">"</div>
                <div className="absolute bottom-4 right-6 text-6xl text-purple-400/20 font-cormorant leading-none rotate-180">"</div>
                
                <div className="relative z-10">
                  <p className="font-cormorant text-2xl md:text-4xl text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-purple-200 italic leading-relaxed tracking-wide">
                    Un terapeuta frente a una interfaz de energía expandiéndose hacia infinitas posibilidades...
                  </p>
                  
                  {/* Subtle decorative line */}
                  <div className="flex items-center justify-center mt-8 gap-3">
                    <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-purple-400" />
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse-soft" />
                    <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-purple-400" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
