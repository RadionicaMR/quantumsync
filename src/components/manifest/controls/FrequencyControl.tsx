
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface FrequencyControlProps {
  manifestFrequency: number[];
  setManifestFrequency: (value: number[]) => void;
  isDisabled: boolean;
}

const FrequencyControl: React.FC<FrequencyControlProps> = ({
  manifestFrequency,
  setManifestFrequency,
  isDisabled
}) => {
  return (
    <div className="space-y-4 my-4">
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
          disabled={isDisabled}
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
