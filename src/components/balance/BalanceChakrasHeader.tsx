import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

interface BalanceChakrasHeaderProps {
  personName: string;
}

const BalanceChakrasHeader = ({ personName }: BalanceChakrasHeaderProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="text-center mb-6">
      <h2 className="text-2xl font-bold holographic-gradient mb-2">{t('chakras.title')}</h2>
      <p className="text-muted-foreground">
        {t('chakras.harmonizeDesc')}
        {personName && ` ${t('common.for')} ${personName}`}
      </p>
    </div>
  );
};

export default BalanceChakrasHeader;
