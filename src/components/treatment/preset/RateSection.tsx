import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Disc } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import RateDial from '@/components/shared/RateDial';

interface RateSectionProps {
  rate1: string;
  setRate1: (value: string) => void;
  rate2: string;
  setRate2: (value: string) => void;
  rate3: string;
  setRate3: (value: string) => void;
  rate4?: string;
  setRate4?: (value: string) => void;
  rate5?: string;
  setRate5?: (value: string) => void;
  rate6?: string;
  setRate6?: (value: string) => void;
  isPlaying?: boolean;
  isDisabled?: boolean;
}

const RateSection: React.FC<RateSectionProps> = ({
  rate1, setRate1,
  rate2, setRate2,
  rate3, setRate3,
  rate4 = '', setRate4 = () => {},
  rate5 = '', setRate5 = () => {},
  rate6 = '', setRate6 = () => {},
  isPlaying = false,
  isDisabled = false,
}) => {
  const { t, language } = useLanguage();
  const disabled = isDisabled || isPlaying;
  const [dialOpen, setDialOpen] = useState(false);
  const [activeRate, setActiveRate] = useState<number>(1);

  const rates = [
    { id: 1, value: rate1, setter: setRate1 },
    { id: 2, value: rate2, setter: setRate2 },
    { id: 3, value: rate3, setter: setRate3 },
    { id: 4, value: rate4, setter: setRate4 },
    { id: 5, value: rate5, setter: setRate5 },
    { id: 6, value: rate6, setter: setRate6 },
  ];

  const openDial = (rateNum: number) => {
    if (disabled) return;
    setActiveRate(rateNum);
    setDialOpen(true);
  };

  const handleDialClose = (value: number | null) => {
    setDialOpen(false);
    if (value === null) return;
    const rate = rates.find(r => r.id === activeRate);
    if (rate) rate.setter(value.toString());
  };

  const getCurrentRateAsNumber = (): number => {
    const rate = rates.find(r => r.id === activeRate);
    const n = parseInt(rate?.value || '0', 10);
    return isNaN(n) ? 0 : Math.min(n, 100);
  };

  return (
    <Card className="p-6 quantum-card">
      <div className="mb-4">
        <h3 className="text-xl font-semibold">{t('rate.title')} (RATES)</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {language === 'en' 
            ? 'Enter numeric values or words for the RATES (0-100)'
            : 'Ingrese valores numéricos o palabras para los RATES (0-100)'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {rates.map((rate) => (
          <div key={rate.id}>
            <Label htmlFor={`rate${rate.id}`} className="text-xs">RATE {rate.id}</Label>
            <div className="flex gap-1">
              <Input
                id={`rate${rate.id}`}
                value={rate.value}
                onChange={(e) => rate.setter(e.target.value)}
                placeholder={`R${rate.id}`}
                className="font-mono flex-1 text-sm px-2"
                maxLength={3}
                disabled={disabled}
              />
              <div className="flex flex-col">
                <Label className="text-xs">DIAL</Label>
                <Button variant="outline" size="icon" disabled={disabled} onClick={() => openDial(rate.id)} className="min-w-8 h-9">
                  <Disc className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <RateDial
        open={dialOpen}
        onClose={handleDialClose}
        initialValue={getCurrentRateAsNumber()}
      />
    </Card>
  );
};

export default RateSection;
