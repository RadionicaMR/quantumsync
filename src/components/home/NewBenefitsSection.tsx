import { motion } from 'framer-motion';
import { Sparkles, Globe, FileText, TrendingUp, Battery, Shield } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const NewBenefitsSection = () => {
  const { t } = useLanguage();

  const benefits = [
    {
      icon: Sparkles,
      titleKey: 'home.benefit1Title',
      descKey: 'home.benefit1Desc'
    },
    {
      icon: Globe,
      titleKey: 'home.benefit2Title',
      descKey: 'home.benefit2Desc'
    },
    {
      icon: FileText,
      titleKey: 'home.benefit3Title',
      descKey: 'home.benefit3Desc'
    },
    {
      icon: TrendingUp,
      titleKey: 'home.benefit4Title',
      descKey: 'home.benefit4Desc'
    },
    {
      icon: Battery,
      titleKey: 'home.benefit5Title',
      descKey: 'home.benefit5Desc'
    },
    {
      icon: Shield,
      titleKey: 'home.benefit6Title',
      descKey: 'home.benefit6Desc'
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-[#0a0118] via-[#0f0520] to-[#1a0b2e]">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="text-white">{t('home.benefitsTitle1')}</span>
            <br />
            <span className="gradient-text-quantum">{t('home.benefitsTitle2')}</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 h-full">
                <div className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-purple-600/30 to-blue-600/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-7 h-7 text-purple-300" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{t(benefit.titleKey)}</h3>
                <p className="text-purple-200/80 leading-relaxed">{t(benefit.descKey)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewBenefitsSection;