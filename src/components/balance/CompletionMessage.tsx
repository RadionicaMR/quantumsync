import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

interface CompletionMessageProps {
  completed: boolean;
}

const CompletionMessage = ({ completed }: CompletionMessageProps) => {
  const { t } = useLanguage();
  
  if (!completed) return null;

  return (
    <motion.div
      className="flex items-center justify-center p-4 mb-8 rounded-lg bg-green-100 text-green-800"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Check className="mr-2" size={20} />
      <span className="font-medium">{t('chakras.completed')}</span>
    </motion.div>
  );
};

export default CompletionMessage;
