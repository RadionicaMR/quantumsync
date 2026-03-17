
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Square, Disc } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import RateDial from '@/components/shared/RateDial';

interface RateInputsProps {
  rate1: string;
  setRate1: (value: string) => void;
  rate2: string;
  setRate2: (value: string) => void;
  rate3: string;
  setRate3: (value: string) => void;
  isPlaying: boolean;
}

const RateInputs = ({
  rate1,
  setRate1,
  rate2,
  setRate2,
  rate3,
  setRate3,
  isPlaying,
}: RateInputsProps) => {
  const [isGenerating1, setIsGenerating1] = useState(false);
  const [isGenerating2, setIsGenerating2] = useState(false);
  const [isGenerating3, setIsGenerating3] = useState(false);
  const [dialOpen, setDialOpen] = useState(false);
  const [activeRate, setActiveRate] = useState<1 | 2 | 3>(1);
  
  const generateRandomNumber = () => {
    return Math.floor(100000000 + Math.random() * 900000000).toString();
  };
  
  const handleInteractionStart = (setIsGenerating: (val: boolean) => void, setRate: (val: string) => void) => {
    if (isPlaying) return;
    setIsGenerating(true);
    setRate(generateRandomNumber());
    const intervalId = setInterval(() => {
      setRate(generateRandomNumber());
    }, 150);
    const handleInteractionEnd = () => {
      clearInterval(intervalId);
      setIsGenerating(false);
      document.removeEventListener('mouseup', handleInteractionEnd);
      document.removeEventListener('touchend', handleInteractionEnd);
      document.removeEventListener('touchcancel', handleInteractionEnd);
    };
    document.addEventListener('mouseup', handleInteractionEnd);
    document.addEventListener('touchend', handleInteractionEnd);
    document.addEventListener('touchcancel', handleInteractionEnd);
  };

  const openDial = (rateNum: 1 | 2 | 3) => {
    if (isPlaying) return;
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

  const renderRateField = (
    id: string,
    label: string,
    value: string,
    setValue: (v: string) => void,
    rateNum: 1 | 2 | 3,
    isGenerating: boolean,
    setIsGenerating: (v: boolean) => void,
    pulseClass: string
  ) => (
    <div className="flex flex-col">
      <Label htmlFor={id} className="mb-1">{label}</Label>
      <div className="flex gap-2">
        <Input
          id={id}
          type="text"
          maxLength={30}
          placeholder={`Ingrese ${label}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={isPlaying}
          className={isPlaying ? `${pulseClass} bg-quantum-primary/10 flex-1` : "flex-1"}
        />
        <Button
          variant="outline"
          size="icon"
          disabled={isPlaying}
          onClick={() => openDial(rateNum)}
          className="min-w-10 h-10 touch-manipulation"
          aria-label={`Abrir dial para ${label}`}
        >
          <Disc className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          disabled={isPlaying}
          onMouseDown={() => handleInteractionStart(setIsGenerating, setValue)}
          onTouchStart={(e) => {
            e.preventDefault();
            handleInteractionStart(setIsGenerating, setValue);
          }}
          className={`min-w-10 h-10 ${isGenerating ? 'bg-quantum-primary/20' : ''} touch-manipulation`}
          aria-label={`Generar ${label} aleatorio`}
        >
          <Square className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
  
  return (
    <div className="space-y-4">
      {renderRateField('rate1', 'RATE 1', rate1, setRate1, 1, isGenerating1, setIsGenerating1, 'animate-[pulse_1s_ease-in-out_infinite]')}
      {renderRateField('rate2', 'RATE 2', rate2, setRate2, 2, isGenerating2, setIsGenerating2, 'animate-[pulse_1.2s_ease-in-out_infinite]')}
      {renderRateField('rate3', 'RATE 3', rate3, setRate3, 3, isGenerating3, setIsGenerating3, 'animate-[pulse_1.4s_ease-in-out_infinite]')}
      
      <RateDial
        open={dialOpen}
        onClose={handleDialClose}
        initialValue={getCurrentRateAsNumber()}
      />
    </div>
  );
};

export default RateInputs;
