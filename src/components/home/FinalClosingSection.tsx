import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const FinalClosingSection = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-[#0a0118] to-black relative overflow-hidden">
      {/* Subtle animated stars */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse-soft"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              backgroundColor: 'rgba(168, 85, 247, 0.4)',
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 2}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center space-y-12"
        >
          <div className="flex justify-center mb-8">
            <Sparkles className="w-16 h-16 text-purple-400 animate-pulse-soft" />
          </div>

          <div className="space-y-6">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-2xl md:text-3xl font-light text-purple-200 leading-relaxed"
            >
              La intención crea la vibración.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-2xl md:text-3xl font-light text-blue-200 leading-relaxed"
            >
              La vibración crea la realidad.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-2xl md:text-3xl font-light text-purple-100 leading-relaxed"
            >
              Con Quantumsync, cada pensamiento se convierte en frecuencia,
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-2xl md:text-3xl font-light text-white leading-relaxed"
            >
              y cada frecuencia, en transformación.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 1 }}
            className="pt-12"
          >
            <p className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-purple-300 via-blue-300 to-purple-200 bg-clip-text text-transparent">
              💫 Ciencia para el alma.
            </p>
            <p className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-blue-200 via-purple-300 to-purple-400 bg-clip-text text-transparent mt-2">
              Frecuencia para la vida.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 1.2 }}
            className="pt-8"
          >
            <div className="h-px w-64 mx-auto bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalClosingSection;
