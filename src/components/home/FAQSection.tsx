import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "¿Necesito conocimientos técnicos para usar Quantumsync?",
      answer: "No. La interfaz está diseñada para terapeutas, no para técnicos. Si sabes usar un smartphone, puedes usar Quantumsync. Incluye guías paso a paso y soporte personalizado."
    },
    {
      question: "¿Requiere equipos o aparatos físicos?",
      answer: "No necesitas ningún aparato radiónico físico. Todo funciona desde tu dispositivo móvil, tablet o computadora. La tecnología está integrada en la aplicación."
    },
    {
      question: "¿Cómo funciona la terapia a distancia?",
      answer: "Basado en principios de Radiónica Cuántica, la aplicación emite frecuencias específicas dirigidas a tu paciente mediante tu intención y sus datos. La física cuántica demuestra que la distancia no es una barrera para la información energética."
    },
    {
      question: "¿Puedo probar antes de comprometerme?",
      answer: "Sí, ofrecemos acceso gratuito para que explores las funcionalidades básicas. Puedes comenzar sin tarjeta de crédito y decidir si es para ti."
    },
    {
      question: "¿Es compatible con otras terapias?",
      answer: "Absolutamente. Quantumsync complementa Reiki, Biodescodificación, terapias florales, y cualquier otra práctica energética. No reemplaza tu método, lo amplifica."
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
            <span className="text-white">Preguntas que seguro</span>
            <br />
            <span className="gradient-text-quantum">te hiciste...</span>
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
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-purple-200/80 leading-relaxed pb-6">
                  {faq.answer}
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
