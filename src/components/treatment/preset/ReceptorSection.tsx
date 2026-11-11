import React from 'react';
import { Card } from '@/components/ui/card';
import ReceptorNameInput from '@/components/treatment/ReceptorNameInput';
import { useLanguage } from '@/context/LanguageContext';

interface ReceptorSectionProps {
  receptorName: string;
  setReceptorName: (name: string) => void;
  isPlaying?: boolean;
  receptorImage?: string | null;
  receptorImages?: string[];
  isDisabled?: boolean;
}

const ReceptorSection: React.FC<ReceptorSectionProps> = ({
  receptorName,
  setReceptorName,
  isPlaying = false,
  receptorImage,
  receptorImages,
  isDisabled = false,
}) => {
  const { t } = useLanguage();
  
  return (
    <Card className="p-6 quantum-card">
      <h3 className="text-base font-semibold mb-1.5">{t('receptor.title')}</h3>
      <ReceptorNameInput
        receptorName={receptorName}
        setReceptorName={setReceptorName}
        isPlaying={isDisabled || isPlaying}
      />
    </Card>
  );
};

export default ReceptorSection;
