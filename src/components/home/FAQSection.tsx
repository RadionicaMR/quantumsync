import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from '@/context/LanguageContext';

const FAQSection = () => {
  const { t } = useLanguage();

  const faqs = [
    {
      questionKey: 'home.faq1Question',
      answerKey: 'home.faq1Answer'
    },
    {
      questionKey: 'home.faq2Question',
      answerKey: 'home.faq2Answer'
    },
    {
      questionKey: 'home.faq3Question',
      answerKey: 'home.faq3Answer'
    },
    {
      questionKey: 'home.faq4Question',
      answerKey: 'home.faq4Answer'
    },
    {
      questionKey: 'home.faq5Question',
      answerKey: 'home.faq5Answer'
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-[#0a0118] to-[#0f0520]">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="text-white">{t('home.faqTitle1')}</span>
            <br />
            <span className="gradient-text-quantum">{t('home.faqTitle2')}</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm rounded-2xl border border-purple-500/20 px-6 data-[state=open]:border-purple-500/40 transition-all duration-300"
              >
                <AccordionTrigger className="text-left text-lg font-semibold text-white hover:text-purple-300 py-6">
                  {t(faq.questionKey)}
                </AccordionTrigger>
                <AccordionContent className="text-purple-200/80 leading-relaxed pb-6">
                  {t(faq.answerKey)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;