
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface VisualizationSpeedControlProps {
  visualSpeed: number[];
  setVisualSpeed: (value: number[]) => void;
  isDisabled: boolean;
}

const VisualizationSpeedControl: React.FC<VisualizationSpeedControlProps> = ({
  visualSpeed,
  setVisualSpeed,
  isDisabled
}) => {
  return (
    <div className="space-y-2 my-4">
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
  );
};

export default VisualizationSpeedControl;
