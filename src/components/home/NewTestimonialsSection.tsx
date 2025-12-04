import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const NewTestimonialsSection = () => {
  const { t } = useLanguage();

  const testimonials = [
    {
      nameKey: 'home.testimonial1Name',
      roleKey: 'home.testimonial1Role',
      contentKey: 'home.testimonial1Content',
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      nameKey: 'home.testimonial2Name',
      roleKey: 'home.testimonial2Role',
      contentKey: 'home.testimonial2Content',
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      nameKey: 'home.testimonial3Name',
      roleKey: 'home.testimonial3Role',
      contentKey: 'home.testimonial3Content',
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
            <span className="text-white">{t('home.testimonialsTitle1')}</span>
            <br />
            <span className="gradient-text-quantum">{t('home.testimonialsTitle2')}</span>
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
                  "{t(testimonial.contentKey)}"
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={t(testimonial.nameKey)}
                    className="w-14 h-14 rounded-full border-2 border-purple-500/30"
                  />
                  <div>
                    <p className="text-white font-semibold">{t(testimonial.nameKey)}</p>
                    <p className="text-purple-300/70 text-sm">{t(testimonial.roleKey)}</p>
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