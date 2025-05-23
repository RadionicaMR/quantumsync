
import React from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface RateSectionProps {
  rate1: string;
  setRate1: (value: string) => void;
  rate2: string;
  setRate2: (value: string) => void;
  rate3: string;
  setRate3: (value: string) => void;
  isPlaying?: boolean;
  isDisabled?: boolean;
}

const RateSection: React.FC<RateSectionProps> = ({
  rate1,
  setRate1,
  rate2,
  setRate2,
  rate3,
  setRate3,
  isPlaying = false,
  isDisabled = false,
}) => {
  const disabled = isDisabled || isPlaying;

  return (
    <Card className="p-6 quantum-card">
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Valores Radiónicos (RATES)</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Ingrese valores numéricos o palabras para los RATES
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="rate1">RATE 1</Label>
          <Input
            id="rate1"
            value={rate1}
            onChange={(e) => setRate1(e.target.value)}
            placeholder="Ej: 23-45-67"
            className="font-mono"
            disabled={disabled}
          />
        </div>
        
        <div>
          <Label htmlFor="rate2">RATE 2</Label>
          <Input
            id="rate2"
            value={rate2}
            onChange={(e) => setRate2(e.target.value)}
            placeholder="Ej: 98-76-54"
            className="font-mono"
            disabled={disabled}
          />
        </div>
        
        <div>
          <Label htmlFor="rate3">RATE 3</Label>
          <Input
            id="rate3"
            value={rate3}
            onChange={(e) => setRate3(e.target.value)}
            placeholder="Ej: Energía"
            className="font-mono"
            disabled={disabled}
          />
        </div>
      </div>
    </Card>
  );
};

export default RateSection;
