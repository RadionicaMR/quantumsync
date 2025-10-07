import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Target } from 'lucide-react';

const SolutionSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-12 md:py-20 px-4 bg-gradient-to-br from-[#1a0b2e] via-[#0f0520] to-[#0a0118]">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16 px-2"
        >
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">
            <span className="text-white">Nace </span>
            <span className="gradient-text-quantum">Quantumsync:</span>
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            <span className="text-purple-200">la evolución de la Radiónica Cuántica</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4 md:space-y-6"
          >
            <p className="text-base md:text-lg text-purple-100/90 leading-relaxed">
              Quantumsync te permite realizar <span className="text-purple-300 font-semibold">terapias a distancia</span> con la misma precisión que si estuvieras presente físicamente.
            </p>
            <p className="text-base md:text-lg text-purple-100/90 leading-relaxed">
              Mediante <span className="text-blue-300 font-semibold">frecuencias en Hertz</span> y tecnología cuántica, amplificás tu intención terapéutica sin necesidad de aparatos físicos.
            </p>
            <p className="text-base md:text-lg text-purple-100/90 leading-relaxed">
              Todo desde tu dispositivo móvil o computadora.
            </p>

            <div className="mt-6 md:mt-8 p-4 md:p-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl border border-purple-500/30">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-base sm:text-lg md:text-xl font-semibold">
                <span className="text-purple-300">Intención</span>
                <Zap className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                <span className="text-blue-300">Frecuencia</span>
                <Zap className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                <span className="text-purple-200">Transformación</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-500/20 to-purple-600/20 blur-3xl" />
            <div className="relative space-y-3 md:space-y-4">
              {[
                { icon: Sparkles, text: "Sin aparatos físicos costosos" },
                { icon: Target, text: "Precisión cuántica en cada sesión" },
                { icon: Zap, text: "Amplifica tu don terapéutico" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-center gap-3 md:gap-4 bg-gradient-to-r from-purple-900/40 to-blue-900/40 p-3 md:p-4 rounded-xl border border-purple-500/20 backdrop-blur-sm"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-purple-600/40 to-blue-600/40 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 md:w-6 md:h-6 text-purple-200" />
                  </div>
                  <p className="text-sm md:text-base text-purple-100 font-medium">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center px-4"
        >
          <Button
            size="lg"
            onClick={() => navigate('/purchase')}
            className="bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 hover:from-purple-700 hover:via-purple-600 hover:to-blue-600 text-white text-base md:text-lg px-8 md:px-12 py-4 md:py-6 h-auto rounded-full shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] transition-all duration-300 font-semibold w-full sm:w-auto"
          >
            INICIA AHORA
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default SolutionSection;
