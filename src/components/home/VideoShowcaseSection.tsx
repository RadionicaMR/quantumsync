import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

const VideoShowcaseSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-gradient-to-b from-[#0f0520] to-[#1a0b2e] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {t('home.videoShowcaseTitle')}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12"
        >
          {/* First Phone Mockup - New Video */}
          <div className="relative">
            <div className="relative w-[240px] md:w-[280px] lg:w-[320px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] p-3 shadow-[0_0_60px_rgba(168,85,247,0.3)]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-b-2xl z-20" />
              <div className="relative bg-black rounded-[2.5rem] overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-7 bg-black/50 z-10 flex items-center justify-between px-5">
                  <span className="text-white text-xs font-medium">9:41</span>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-2 border border-white rounded-sm">
                      <div className="w-3/4 h-full bg-white rounded-sm" />
                    </div>
                  </div>
                </div>
                <div className="aspect-[9/19.5] bg-black">
                  <iframe
                    src="https://drive.google.com/file/d/12U0y17fKGbnKQQo74wu5pPTOkFBx6hQc/preview"
                    className="w-full h-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title="QuantumSync App Preview 1"
                  />
                </div>
              </div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-gray-600 rounded-full" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-transparent to-blue-500/20 blur-2xl -z-10 scale-110" />
          </div>

          {/* Second Phone Mockup - Original Video */}
          <div className="relative">
            <div className="relative w-[240px] md:w-[280px] lg:w-[320px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] p-3 shadow-[0_0_60px_rgba(168,85,247,0.3)]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-b-2xl z-20" />
              <div className="relative bg-black rounded-[2.5rem] overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-7 bg-black/50 z-10 flex items-center justify-between px-5">
                  <span className="text-white text-xs font-medium">9:41</span>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-2 border border-white rounded-sm">
                      <div className="w-3/4 h-full bg-white rounded-sm" />
                    </div>
                  </div>
                </div>
                <div className="aspect-[9/19.5] bg-black">
                  <iframe
                    src="https://drive.google.com/file/d/1AGPos8mSqxKLMPtpuADE2m_GZNQyje87/preview"
                    className="w-full h-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title="QuantumSync App Preview 2"
                  />
                </div>
              </div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-gray-600 rounded-full" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-transparent to-purple-500/20 blur-2xl -z-10 scale-110" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoShowcaseSection;
