import { motion } from 'framer-motion';
import { Waves, Atom, Cpu } from 'lucide-react';

const QuantumFoundationSection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-[#0f0520] via-[#1a0b2e] to-[#0a0118] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="gradient-text-quantum">La energía es información.</span>
            <br />
            <span className="text-white">La frecuencia es el lenguaje del cambio.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <p className="text-lg text-purple-100/90 leading-relaxed">
              La física cuántica ha demostrado que todo en el universo vibra a una frecuencia específica. Desde las partículas subatómicas hasta las células de tu cuerpo, todo es <span className="text-purple-300 font-semibold">energía en movimiento</span>.
            </p>
            <p className="text-lg text-purple-100/90 leading-relaxed">
              La <span className="text-blue-300 font-semibold">Radiónica Cuántica</span> se basa en el principio de que cuando emitimos frecuencias específicas con una intención clara, podemos influir en el campo energético de una persona, independientemente de la distancia física.
            </p>
            <p className="text-lg text-purple-100/90 leading-relaxed">
              Quantumsync traduce tu intención terapéutica en <span className="text-purple-300 font-semibold">frecuencias medidas en Hertz</span>, creando un puente entre la conciencia y la materia.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {[
              { icon: Waves, title: "Coherencia Vibracional", desc: "Las ondas se sincronizan creando resonancia" },
              { icon: Atom, title: "Campo Cuántico", desc: "Conexión más allá del espacio-tiempo" },
              { icon: Cpu, title: "Tecnología Consciente", desc: "Hardware que responde a la intención" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-sm p-6 rounded-2xl border border-purple-500/20"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/40 to-blue-600/40 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-purple-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-purple-200/70">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-500/10 to-purple-600/10 blur-2xl" />
            <div className="relative bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/30">
              <p className="text-xl text-purple-100 italic leading-relaxed">
                "La intención enfocada + Frecuencia precisa = Transformación energética real"
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default QuantumFoundationSection;
