import { motion } from 'framer-motion';
import { Smartphone, Sliders, Play } from 'lucide-react';
import mockupChakraBalance from '@/assets/mockup-chakra-balance.png';
import mockupFrequencySelector from '@/assets/mockup-frequency-selector.png';
import mockupActiveSession from '@/assets/mockup-active-session.png';

const AppShowcaseSection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-[#1a0b2e] to-[#0f0520]">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="text-white">Tecnología simple.</span>
            <br />
            <span className="gradient-text-quantum">Energía avanzada.</span>
          </h2>
          <p className="text-lg text-purple-200/80 max-w-2xl mx-auto">
            Diseñada para terapeutas, no técnicos. Interfaz intuitiva y soporte humano.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {[
            { icon: Smartphone, title: "Equilibrio de Chakras", desc: "Armoniza tu energía vital" },
            { icon: Sliders, title: "Selector de Frecuencia", desc: "Ajusta las vibraciones con precisión" },
            { icon: Play, title: "Sesión Activa", desc: "Monitoreo en tiempo real del tratamiento" }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-600/30 to-blue-600/30 flex items-center justify-center">
                <item.icon className="w-8 h-8 text-purple-300" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-purple-200/70">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-500/20 to-purple-600/20 blur-3xl" />
          <div className="relative bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-sm rounded-3xl p-8 border border-purple-500/30">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="aspect-[9/16] bg-black/40 rounded-2xl border border-purple-400/20 overflow-hidden">
                <img 
                  src={mockupChakraBalance} 
                  alt="Equilibrio de Chakras - Quantumsync"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[9/16] bg-black/40 rounded-2xl border border-purple-400/20 overflow-hidden">
                <img 
                  src={mockupFrequencySelector} 
                  alt="Selector de Frecuencia Cuántica - Quantumsync"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[9/16] bg-black/40 rounded-2xl border border-purple-400/20 overflow-hidden">
                <img 
                  src={mockupActiveSession} 
                  alt="Sesión Activa de Tratamiento - Quantumsync"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AppShowcaseSection;
