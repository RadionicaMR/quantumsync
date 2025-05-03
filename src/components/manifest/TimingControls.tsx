
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Infinity } from 'lucide-react';

interface TimingControlsProps {
  exposureTime: number[];
  setExposureTime: (value: number[]) => void;
  visualSpeed: number[];
  setVisualSpeed: (value: number[]) => void;
  isDisabled?: boolean;
  indefiniteTime?: boolean;
  setIndefiniteTime?: (value: boolean) => void;
}

const TimingControls: React.FC<TimingControlsProps> = ({
  exposureTime,
  setExposureTime,
  visualSpeed, 
  setVisualSpeed,
  isDisabled = false,
  indefiniteTime = false,
  setIndefiniteTime = () => {}
}) => {
  return (
    <div className="space-y-6 mb-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="exposure-time">Tiempo de Exposición</Label>
          <span className="text-muted-foreground font-mono text-sm">
            {indefiniteTime ? "∞" : `${exposureTime[0]} min`}
          </span>
        </div>
        <Slider
          id="exposure-time"
          value={exposureTime}
          onValueChange={(value) => setExposureTime(value)}
          min={1}
          max={180}
          step={1}
          disabled={isDisabled || indefiniteTime}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1 min</span>
          <span>180 min</span>
        </div>
        
        <div className="flex items-center justify-between pt-2 pb-1">
          <div className="flex items-center space-x-2">
            <Switch
              id="indefinite-time"
              checked={indefiniteTime}
              onCheckedChange={setIndefiniteTime}
              disabled={isDisabled}
            />
            <Label htmlFor="indefinite-time" className="flex items-center cursor-pointer">
              <Infinity className="h-3 w-3 mr-1" /> Tiempo Indefinido
            </Label>
          </div>
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
