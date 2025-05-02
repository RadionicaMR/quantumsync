
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface ExposureTimeControlProps {
  exposureTime: number[];
  setExposureTime: (value: number[]) => void;
  isDisabled: boolean;
}

const ExposureTimeControl: React.FC<ExposureTimeControlProps> = ({
  exposureTime,
  setExposureTime,
  isDisabled
}) => {
  return (
    <div className="space-y-2 my-4">
      <div className="flex justify-between items-center">
        <Label htmlFor="exposure-time">Tiempo de Exposición</Label>
        <span className="text-muted-foreground font-mono text-sm">
          {exposureTime[0]} min
        </span>
      </div>
      <Slider
        id="exposure-time"
        value={exposureTime}
        onValueChange={setExposureTime}
        min={1}
        max={30}
        step={1}
        disabled={isDisabled}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>1 min</span>
        <span>30 min</span>
      </div>
    </div>
  );
};

export default ExposureTimeControl;
