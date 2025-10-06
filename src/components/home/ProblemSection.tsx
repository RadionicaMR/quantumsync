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
                  Visualiza tu energía expandiéndose más allá de las limitaciones físicas...
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
      </div>
    </section>
  );
};

export default ProblemSection;
