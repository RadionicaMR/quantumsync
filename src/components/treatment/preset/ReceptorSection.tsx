
import React from 'react';
import { Card } from '@/components/ui/card';
import ReceptorNameInput from '@/components/treatment/ReceptorNameInput';

interface ReceptorSectionProps {
  receptorName: string;
  setReceptorName: (name: string) => void;
  isPlaying: boolean;
  receptorImage?: string | null;
  receptorImages?: string[];
}

const ReceptorSection: React.FC<ReceptorSectionProps> = ({
  receptorName,
  setReceptorName,
  isPlaying,
  receptorImage,
  receptorImages,
}) => {
  return (
    <Card className="p-6 quantum-card">
      <h3 className="text-xl font-semibold mb-4">Datos del Receptor</h3>
      <ReceptorNameInput
        receptorName={receptorName}
        setReceptorName={setReceptorName}
        isPlaying={isPlaying}
      />
    </Card>
  );
};

export default ReceptorSection;
