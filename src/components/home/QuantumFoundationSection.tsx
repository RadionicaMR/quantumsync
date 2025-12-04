import { motion } from 'framer-motion';
import { Waves, Atom, Cpu } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const QuantumFoundationSection = () => {
  const { t } = useLanguage();

  const features = [
    { icon: Waves, titleKey: 'home.quantumFeature1Title', descKey: 'home.quantumFeature1Desc' },
    { icon: Atom, titleKey: 'home.quantumFeature2Title', descKey: 'home.quantumFeature2Desc' },
    { icon: Cpu, titleKey: 'home.quantumFeature3Title', descKey: 'home.quantumFeature3Desc' }
  ];

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
            <span className="gradient-text-quantum">{t('home.quantumTitle1')}</span>
            <br />
            <span className="text-white">{t('home.quantumTitle2')}</span>
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
              {t('home.quantumDesc1')} <span className="text-purple-300 font-semibold">{t('home.quantumEnergyMotion')}</span>.
            </p>
            <p className="text-lg text-purple-100/90 leading-relaxed">
              {t('home.quantumDesc2')} <span className="text-blue-300 font-semibold">{t('home.quantumRadionicsName')}</span> {t('home.quantumDesc2End')}
            </p>
            <p className="text-lg text-purple-100/90 leading-relaxed">
              {t('home.quantumDesc3')} <span className="text-purple-300 font-semibold">{t('home.quantumFrequenciesHz')}</span>{t('home.quantumDesc3End')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {features.map((item, index) => (
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
                    <h3 className="text-lg font-semibold text-white mb-2">{t(item.titleKey)}</h3>
                    <p className="text-purple-200/70">{t(item.descKey)}</p>
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
                {t('home.quantumQuote')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default QuantumFoundationSection;