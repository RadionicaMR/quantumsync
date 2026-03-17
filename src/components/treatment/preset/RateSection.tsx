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
  const { t, language } = useLanguage();
  const disabled = isDisabled || isPlaying;
  const [dialOpen, setDialOpen] = useState(false);
  const [activeRate, setActiveRate] = useState<1 | 2 | 3>(1);

  const openDial = (rateNum: 1 | 2 | 3) => {
    if (disabled) return;
    setActiveRate(rateNum);
    setDialOpen(true);
  };

  const handleDialClose = (value: number | null) => {
    setDialOpen(false);
    if (value === null) return;
    const setter = activeRate === 1 ? setRate1 : activeRate === 2 ? setRate2 : setRate3;
    setter(value.toString());
  };

  const getCurrentRateAsNumber = (): number => {
    const raw = activeRate === 1 ? rate1 : activeRate === 2 ? rate2 : rate3;
    const n = parseInt(raw, 10);
    return isNaN(n) ? 0 : Math.min(Math.round(n / 10), 100);
  };

  return (
    <Card className="p-6 quantum-card">
      <div className="mb-4">
        <h3 className="text-xl font-semibold">{t('rate.title')} (RATES)</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {language === 'en' 
            ? 'Enter numeric values or words for the RATES'
            : 'Ingrese valores numéricos o palabras para los RATES'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="rate1">RATE 1</Label>
          <div className="flex gap-2">
            <Input
              id="rate1"
              value={rate1}
              onChange={(e) => setRate1(e.target.value)}
              placeholder={language === 'en' ? 'E.g.: 23-45-67' : 'Ej: 23-45-67'}
              className="font-mono flex-1"
              disabled={disabled}
            />
            <Button variant="outline" size="icon" disabled={disabled} onClick={() => openDial(1)} className="min-w-10 h-10">
              <Disc className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div>
          <Label htmlFor="rate2">RATE 2</Label>
          <div className="flex gap-2">
            <Input
              id="rate2"
              value={rate2}
              onChange={(e) => setRate2(e.target.value)}
              placeholder={language === 'en' ? 'E.g.: 98-76-54' : 'Ej: 98-76-54'}
              className="font-mono flex-1"
              disabled={disabled}
            />
            <Button variant="outline" size="icon" disabled={disabled} onClick={() => openDial(2)} className="min-w-10 h-10">
              <Disc className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div>
          <Label htmlFor="rate3">RATE 3</Label>
          <div className="flex gap-2">
            <Input
              id="rate3"
              value={rate3}
              onChange={(e) => setRate3(e.target.value)}
              placeholder={language === 'en' ? 'E.g.: Energy' : 'Ej: Energía'}
              className="font-mono flex-1"
              disabled={disabled}
            />
            <Button variant="outline" size="icon" disabled={disabled} onClick={() => openDial(3)} className="min-w-10 h-10">
              <Disc className="h-4 w-4" />
            </Button>
          </div>
        </div>
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
