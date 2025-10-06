import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Target } from 'lucide-react';

const SolutionSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-[#1a0b2e] via-[#0f0520] to-[#0a0118]">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="text-white">Nace </span>
            <span className="gradient-text-quantum">Quantumsync:</span>
            <br />
            <span className="text-purple-200">la evolución de la Radiónica Cuántica</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <p className="text-lg text-purple-100/90 leading-relaxed">
              Quantumsync te permite realizar <span className="text-purple-300 font-semibold">terapias a distancia</span> con la misma precisión que si estuvieras presente físicamente.
            </p>
            <p className="text-lg text-purple-100/90 leading-relaxed">
              Mediante <span className="text-blue-300 font-semibold">frecuencias en Hertz</span> y tecnología cuántica, amplificás tu intención terapéutica sin necesidad de aparatos físicos.
            </p>
            <p className="text-lg text-purple-100/90 leading-relaxed">
              Todo desde tu dispositivo móvil o computadora.
            </p>

            <div className="mt-8 p-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl border border-purple-500/30">
              <div className="flex items-center justify-center gap-4 text-xl font-semibold">
                <span className="text-purple-300">Intención</span>
                <Zap className="w-6 h-6 text-blue-400" />
                <span className="text-blue-300">Frecuencia</span>
                <Zap className="w-6 h-6 text-purple-400" />
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
            <div className="relative space-y-4">
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
                  className="flex items-center gap-4 bg-gradient-to-r from-purple-900/40 to-blue-900/40 p-4 rounded-xl border border-purple-500/20 backdrop-blur-sm"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600/40 to-blue-600/40 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-purple-200" />
                  </div>
                  <p className="text-purple-100 font-medium">{item.text}</p>
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
          className="text-center"
        >
          <Button
            size="lg"
            onClick={() => navigate('/register')}
            className="bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 hover:from-purple-700 hover:via-purple-600 hover:to-blue-600 text-white text-lg px-12 py-6 h-auto rounded-full shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] transition-all duration-300 font-semibold"
          >
            Registrate ahora
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default SolutionSection;
