import { motion } from 'framer-motion';
import { Heart, Users, TrendingUp } from 'lucide-react';

const ProblemSection = () => {
  const problems = [
    {
      icon: Heart,
      text: "Limitaciones del trabajo presencial"
    },
    {
      icon: Users,
      text: "Dificultad para medir resultados tangibles"
    },
    {
      icon: TrendingUp,
      text: "Necesidad de evolucionar tu práctica"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-[#0f0520] to-[#1a0b2e]">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="text-white">Tu energía sana.</span>
            <br />
            <span className="gradient-text-quantum">Pero sentís que podrías llegar más lejos.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-600/30 to-blue-600/30 flex items-center justify-center">
                <problem.icon className="w-8 h-8 text-purple-300" />
              </div>
              <p className="text-purple-100 text-lg">{problem.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-500/10 to-purple-600/10 blur-2xl" />
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl border border-purple-400/20 flex items-center justify-center p-8">
                <p className="text-purple-200/80 text-lg italic">
                  "Visualiza tu energía expandiéndose más allá de las limitaciones físicas..."
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSection;
