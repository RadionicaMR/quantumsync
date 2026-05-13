
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Square, Disc } from 'lucide-react';
import RateDial from '@/components/shared/RateDial';

interface RateInputsProps {
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
  rate7?: string;
  setRate7?: (value: string) => void;
  rate8?: string;
  setRate8?: (value: string) => void;
  rate9?: string;
  setRate9?: (value: string) => void;
  isPlaying: boolean;
}

const RateInputs = ({
  rate1, setRate1,
  rate2, setRate2,
  rate3, setRate3,
  rate4 = '', setRate4 = () => {},
  rate5 = '', setRate5 = () => {},
  rate6 = '', setRate6 = () => {},
  rate7 = '', setRate7 = () => {},
  rate8 = '', setRate8 = () => {},
  rate9 = '', setRate9 = () => {},
  isPlaying,
}: RateInputsProps) => {
  const [generatingStates, setGeneratingStates] = useState<Record<number, boolean>>({});
  const [dialOpen, setDialOpen] = useState(false);
  const [activeRate, setActiveRate] = useState<number>(1);

  const rates = [
    { id: 1, value: rate1, setter: setRate1 },
    { id: 2, value: rate2, setter: setRate2 },
    { id: 3, value: rate3, setter: setRate3 },
    { id: 4, value: rate4, setter: setRate4 },
    { id: 5, value: rate5, setter: setRate5 },
    { id: 6, value: rate6, setter: setRate6 },
    { id: 7, value: rate7, setter: setRate7 },
    { id: 8, value: rate8, setter: setRate8 },
    { id: 9, value: rate9, setter: setRate9 },
  ];
  
  const generateRandomNumber = () => {
    return (Math.floor(Math.random() * 100)).toString();
  };
  
  const handleInteractionStart = (rateId: number, setRate: (val: string) => void) => {
    if (isPlaying) return;
    setGeneratingStates(prev => ({ ...prev, [rateId]: true }));
    setRate(generateRandomNumber());
    const intervalId = setInterval(() => {
      setRate(generateRandomNumber());
    }, 150);
    const handleInteractionEnd = () => {
      clearInterval(intervalId);
      setGeneratingStates(prev => ({ ...prev, [rateId]: false }));
      document.removeEventListener('mouseup', handleInteractionEnd);
      document.removeEventListener('touchend', handleInteractionEnd);
      document.removeEventListener('touchcancel', handleInteractionEnd);
    };
    document.addEventListener('mouseup', handleInteractionEnd);
    document.addEventListener('touchend', handleInteractionEnd);
    document.addEventListener('touchcancel', handleInteractionEnd);
  };

  const openDial = (rateNum: number) => {
    if (isPlaying) return;
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

  const pulseFor = (idx: number) => {
    const pulses = ['animate-[pulse_1s_ease-in-out_infinite]', 'animate-[pulse_1.2s_ease-in-out_infinite]', 'animate-[pulse_1.4s_ease-in-out_infinite]'];
    return pulses[idx % pulses.length];
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {rates.map((rate, idx) => (
          <div key={rate.id} className="flex items-end gap-1">
            {/* Input column */}
            <div className="flex-1 flex flex-col min-w-0">
              <Label htmlFor={`rate${rate.id}`} className="mb-1 text-xs">RATE {rate.id}</Label>
              <Input
                id={`rate${rate.id}`}
                type="text"
                maxLength={50}
                placeholder={`R${rate.id}`}
                value={rate.value}
                onChange={(e) => rate.setter(e.target.value)}
                disabled={isPlaying}
                className={`${isPlaying ? `${pulseFor(idx)} bg-quantum-primary/10` : ''} h-9 text-sm px-2 w-full`}
              />
            </div>

            {/* Dial column */}
            <div className="flex flex-col items-center">
              <Label className="mb-1 text-xs">DIAL</Label>
              <Button
                variant="outline"
                size="icon"
                disabled={isPlaying}
                onClick={() => openDial(rate.id)}
                className="min-w-8 h-9 touch-manipulation"
                aria-label={`Abrir dial para RATE ${rate.id}`}
              >
                <Disc className="h-4 w-4" />
              </Button>
            </div>

            {/* Random column */}
            <div className="flex flex-col items-center">
              <Label className="mb-1 text-xs opacity-0 select-none" aria-hidden>·</Label>
              <Button
                variant="outline"
                size="icon"
                disabled={isPlaying}
                onMouseDown={() => handleInteractionStart(rate.id, rate.setter)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleInteractionStart(rate.id, rate.setter);
                }}
                className={`min-w-8 h-9 ${generatingStates[rate.id] ? 'bg-quantum-primary/20' : ''} touch-manipulation`}
                aria-label={`Generar RATE ${rate.id} aleatorio`}
              >
                <Square className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <RateDial
        open={dialOpen}
        onClose={handleDialClose}
        initialValue={getCurrentRateAsNumber()}
      />
    </div>
  );
};

export default RateInputs;
