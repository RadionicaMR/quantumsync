import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const NewTestimonialsSection = () => {
  const testimonials = [
    {
      name: "María González",
      role: "Terapeuta Holística",
      content: "Desde que uso Quantumsync, mis sesiones a distancia tienen resultados medibles. Mis pacientes sienten la energía como si estuviera presente.",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      name: "Carlos Mendoza",
      role: "Biodescodificador",
      content: "La precisión de las frecuencias me permite trabajar con varios pacientes al día sin agotarme. Es la evolución que necesitaba mi práctica.",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      name: "Ana Fernández",
      role: "Reikista Certificada",
      content: "Quantumsync complementa perfectamente mi Reiki. Ahora puedo llegar a personas en otros países y mantener la efectividad de las sesiones.",
      image: "https://randomuser.me/api/portraits/women/68.jpg"
    }
  ];

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
            <span className="text-white">Lo invisible ahora tiene</span>
            <br />
            <span className="gradient-text-quantum">resultados visibles</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 h-full flex flex-col">
                <Quote className="w-10 h-10 text-purple-400/50 mb-4" />
                <p className="text-purple-100/90 leading-relaxed mb-6 flex-grow italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full border-2 border-purple-500/30"
                  />
                  <div>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-purple-300/70 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewTestimonialsSection;
