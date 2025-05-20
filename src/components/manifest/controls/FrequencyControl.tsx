
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

interface FrequencyControlProps {
  manifestFrequency: number[];
  setManifestFrequency: (value: number[]) => void;
  isDisabled: boolean;
  manifestSound?: boolean;
  setManifestSound?: (value: boolean) => void;
}

const FrequencyControl: React.FC<FrequencyControlProps> = ({
  manifestFrequency,
  setManifestFrequency,
  isDisabled,
  manifestSound,
  setManifestSound
}) => {
  return (
    <div className="space-y-4 my-4">
      {setManifestSound && (
        <div className="flex items-center justify-between">
          <Label htmlFor="manifest-sound" className="cursor-pointer">Sonido de Manifestación</Label>
          <Switch
            id="manifest-sound"
            checked={manifestSound}
            onCheckedChange={setManifestSound}
            disabled={isDisabled}
          />
        </div>
      )}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="manifest-frequency">Frecuencia de Manifestación</Label>
          <span className="text-muted-foreground font-mono text-sm">
            {manifestFrequency[0]} Hz
          </span>
        </div>
        <Slider
          id="manifest-frequency"
          value={manifestFrequency}
          onValueChange={setManifestFrequency}
          min={396}
          max={963}
          step={1}
          disabled={isDisabled || (manifestSound === false && setManifestSound !== undefined)}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>396 Hz</span>
          <span>963 Hz</span>
        </div>
      </div>
    </div>
  );
};

export default FrequencyControl;
