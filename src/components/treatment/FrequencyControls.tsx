
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface FrequencyControlsProps {
  frequency: number[];
  setFrequency: (value: number[]) => void;
  duration: number[];
  setDuration: (value: number[]) => void;
  intensity: number[];
  setIntensity: (value: number[]) => void;
  hypnoticSpeed: number[];
  setHypnoticSpeed: (value: number[]) => void;
  isPlaying: boolean;
}

const FrequencyControls = ({
  frequency,
  setFrequency,
  duration,
  setDuration,
  intensity,
  setIntensity,
  hypnoticSpeed,
  setHypnoticSpeed,
  isPlaying,
}: FrequencyControlsProps) => {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">Frecuencia:</h4>
          <div className="flex items-center">
            <Input
              type="number"
              value={frequency[0]}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value) && value >= 20 && value <= 20000) {
                  setFrequency([value]);
                }
              }}
              disabled={isPlaying}
              className="w-24 ml-2"
              min={20}
              max={20000}
            />
            <span className="ml-2 text-sm text-muted-foreground">Hz</span>
          </div>
        </div>
        <Slider
          defaultValue={frequency}
          min={20}
          max={20000}
          step={1}
          value={frequency}
          onValueChange={setFrequency}
          disabled={isPlaying}
          className="mb-4"
        />
        
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">Duración:</h4>
          <div className="flex items-center">
            <Input
              type="number"
              value={duration[0]}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value) && value >= 1 && value <= 60) {
                  setDuration([value]);
                }
              }}
              disabled={isPlaying}
              className="w-24 ml-2"
              min={1}
              max={60}
            />
            <span className="ml-2 text-sm text-muted-foreground">min</span>
          </div>
        </div>
        <Slider
          defaultValue={duration}
          min={1}
          max={60}
          step={1}
          value={duration}
          onValueChange={setDuration}
          disabled={isPlaying}
          className="mb-4"
        />
        
        <h4 className="font-medium mb-2">Intensidad: {intensity[0]}%</h4>
        <Slider
          defaultValue={intensity}
          min={10}
          max={100}
          step={1}
          value={intensity}
          onValueChange={setIntensity}
          disabled={isPlaying}
          className="mb-4"
        />
        
        <h4 className="font-medium mb-2">Velocidad Hipnótica: {hypnoticSpeed[0]}</h4>
        <Slider
          defaultValue={hypnoticSpeed}
          min={1}
          max={20}
          step={1}
          value={hypnoticSpeed}
          onValueChange={setHypnoticSpeed}
          disabled={isPlaying}
          className="mb-4"
        />
      </div>
    </div>
  );
};

export default FrequencyControls;
