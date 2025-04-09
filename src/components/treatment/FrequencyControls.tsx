
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { Info } from 'lucide-react';

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
  const [frequencyInput, setFrequencyInput] = useState(frequency[0].toString());

  // Update input when frequency slider changes
  useEffect(() => {
    setFrequencyInput(frequency[0].toString());
  }, [frequency[0]]);

  // Parse input with support for decimal comma
  const parseFrequencyInput = (value: string): number => {
    // Replace comma with dot for proper parsing
    const normalizedValue = value.replace(',', '.');
    const parsed = parseFloat(normalizedValue);
    
    if (isNaN(parsed)) return 0;
    if (parsed < 0) return 0;
    if (parsed > 10000) return 10000;
    
    return parsed;
  };

  // Handle input changes
  const handleFrequencyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setFrequencyInput(inputValue);
    
    // Only update actual frequency when input is valid
    if (inputValue.trim() !== '' && inputValue !== ',') {
      const parsedValue = parseFrequencyInput(inputValue);
      setFrequency([parsedValue]);
    }
  };

  // Handle blur to ensure valid value
  const handleFrequencyInputBlur = () => {
    if (frequencyInput.trim() === '' || frequencyInput === ',') {
      setFrequency([0]);
      setFrequencyInput('0');
    } else {
      const parsedValue = parseFrequencyInput(frequencyInput);
      setFrequency([parsedValue]);
      setFrequencyInput(parsedValue.toString().replace('.', ','));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">Frecuencia:</h4>
          <div className="flex items-center">
            <Input
              type="text"
              value={frequencyInput}
              onChange={handleFrequencyInputChange}
              onBlur={handleFrequencyInputBlur}
              disabled={isPlaying}
              className="w-24 ml-2"
            />
            <span className="ml-2 text-sm text-muted-foreground">Hz</span>
          </div>
        </div>
        <Slider
          defaultValue={frequency}
          min={0}
          max={10000}
          step={0.1}
          value={frequency}
          onValueChange={setFrequency}
          disabled={isPlaying}
          className="mb-4"
        />
        
        {frequency[0] < 100 && (
          <div className="text-sm flex items-start mb-4 p-2 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md">
            <Info className="text-amber-500 mr-2 flex-shrink-0 mt-0.5" size={16} />
            <span>
              Las frecuencias por debajo de 100 Hz pueden ser difíciles de escuchar en parlantes pequeños. 
              Se ha mejorado la audibilidad con armónicos, pero para una experiencia óptima, usa auriculares.
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">Duración:</h4>
          <div className="flex items-center">
            <Input
              type="number"
              value={duration[0]}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value) && value >= 1 && value <= 180) {
                  setDuration([value]);
                }
              }}
              disabled={isPlaying}
              className="w-24 ml-2"
              min={1}
              max={180}
            />
            <span className="ml-2 text-sm text-muted-foreground">min</span>
          </div>
        </div>
        <Slider
          defaultValue={duration}
          min={1}
          max={180}
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
        
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">Velocidad Visualización:</h4>
          <div className="flex items-center">
            <Input
              type="number"
              value={hypnoticSpeed[0]}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value) && value >= 1 && value <= 20) {
                  setHypnoticSpeed([value]);
                }
              }}
              disabled={isPlaying}
              className="w-24 ml-2"
              min={1}
              max={20}
            />
          </div>
        </div>
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
