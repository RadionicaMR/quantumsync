
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface TimingControlsProps {
  exposureTime: number[];
  setExposureTime: (value: number[]) => void;
  visualSpeed: number[];
  setVisualSpeed: (value: number[]) => void;
  isDisabled?: boolean;
}

const TimingControls: React.FC<TimingControlsProps> = ({
  exposureTime,
  setExposureTime,
  visualSpeed, 
  setVisualSpeed,
  isDisabled = false
}) => {
  return (
    <div className="space-y-6 mb-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="exposure-time">Tiempo de Exposición</Label>
          <span className="text-muted-foreground font-mono text-sm">
            {exposureTime[0]} min
          </span>
        </div>
        <Slider
          id="exposure-time"
          value={exposureTime}
          onValueChange={(value) => setExposureTime(value)}
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
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="visual-speed">Velocidad de Visualización</Label>
          <span className="text-muted-foreground font-mono text-sm">
            {visualSpeed[0]}
          </span>
        </div>
        <Slider
          id="visual-speed"
          value={visualSpeed}
          onValueChange={(value) => setVisualSpeed(value)}
          min={1}
          max={20}
          step={1}
          disabled={isDisabled}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Lento</span>
          <span>Rápido</span>
        </div>
      </div>
    </div>
  );
};

export default TimingControls;
