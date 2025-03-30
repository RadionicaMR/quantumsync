
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface SettingsTogglesProps {
  useHeadphones: boolean;
  setUseHeadphones: (value: boolean) => void;
  visualFeedback: boolean;
  setVisualFeedback: (value: boolean) => void;
  isPlaying: boolean;
}

const SettingsToggles = ({
  useHeadphones,
  setUseHeadphones,
  visualFeedback,
  setVisualFeedback,
  isPlaying,
}: SettingsTogglesProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-6 justify-between w-full">
      <div className="flex items-center gap-2">
        <Switch 
          id="custom-headphones" 
          checked={useHeadphones}
          onCheckedChange={setUseHeadphones}
          disabled={isPlaying}
        />
        <Label htmlFor="custom-headphones">Usar auriculares</Label>
      </div>
      
      <div className="flex items-center gap-2">
        <Switch 
          id="custom-visual" 
          checked={visualFeedback}
          onCheckedChange={setVisualFeedback}
          disabled={isPlaying}
        />
        <Label htmlFor="custom-visual">Mostrar entrenamiento visual</Label>
      </div>
    </div>
  );
};

export default SettingsToggles;
