import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface SettingsTogglesProps {
  intensity: number[];
  setIntensity: (value: number[]) => void;
  isPlaying?: boolean;
}

const SettingsToggles = ({
  intensity,
  setIntensity,
  isPlaying = false,
}: SettingsTogglesProps) => {
  const { language } = useLanguage();
  const volume = intensity[0];
  
  return (
    <div className="flex items-center gap-3 w-full">
      <button
        type="button"
        onClick={() => !isPlaying && setIntensity([volume > 0 ? 0 : 50])}
        disabled={isPlaying}
        className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
      >
        {volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </button>
      <div className="flex-1">
        <Label className="text-xs text-muted-foreground mb-1 block">
          {language === 'en' ? 'Output Volume' : 'Volumen de Salida'} — {volume}%
        </Label>
        <Slider
          value={intensity}
          onValueChange={setIntensity}
          min={0}
          max={100}
          step={1}
          disabled={isPlaying}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default SettingsToggles;
