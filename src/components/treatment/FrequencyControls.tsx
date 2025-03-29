
import { Slider } from '@/components/ui/slider';

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
        <h4 className="font-medium mb-2">Frecuencia: {frequency[0]} Hz</h4>
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
        
        <h4 className="font-medium mb-2">Duración: {duration[0]} minutos</h4>
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
