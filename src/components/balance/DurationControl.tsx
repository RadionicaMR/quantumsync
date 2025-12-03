import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/context/LanguageContext';

interface DurationControlProps {
  duration: number[];
  setDuration: (value: number[]) => void;
  isPlaying: boolean;
}

const DurationControl = ({ duration, setDuration, isPlaying }: DurationControlProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="mb-8">
      <Label className="block mb-2">
        {t('chakras.durationLabel')}: {duration[0]} {duration[0] === 1 ? t('chakras.minute') : t('chakras.minutes')}
      </Label>
      <Slider
        value={duration}
        onValueChange={setDuration}
        min={1}
        max={5}
        step={1}
        disabled={isPlaying}
      />
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>1 min</span>
        <span>2 min</span>
        <span>3 min</span>
        <span>4 min</span>
        <span>5 min</span>
      </div>
    </div>
  );
};

export default DurationControl;
