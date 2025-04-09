
import { useState, useEffect } from 'react';
import { Info, Volume2, VolumeX } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

interface FrequencyControlProps {
  manifestSound: boolean;
  setManifestSound: (value: boolean) => void;
  manifestFrequency: number[];
  setManifestFrequency: (value: number[]) => void;
  isDisabled: boolean;
}

const FrequencyControl = ({
  manifestSound,
  setManifestSound,
  manifestFrequency,
  setManifestFrequency,
  isDisabled
}: FrequencyControlProps) => {
  const [frequencyInput, setFrequencyInput] = useState(manifestFrequency[0].toString());

  // Update input when frequency slider changes
  useEffect(() => {
    setFrequencyInput(manifestFrequency[0].toString());
  }, [manifestFrequency[0]]);

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
      setManifestFrequency([parsedValue]);
    }
  };

  // Handle blur to ensure valid value
  const handleFrequencyInputBlur = () => {
    if (frequencyInput.trim() === '' || frequencyInput === ',') {
      setManifestFrequency([0]);
      setFrequencyInput('0');
    } else {
      const parsedValue = parseFrequencyInput(frequencyInput);
      setManifestFrequency([parsedValue]);
      setFrequencyInput(parsedValue.toString().replace('.', ','));
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <Label>Frecuencia de Manifestación:</Label>
        <div className="flex items-center">
          <Input
            type="text"
            value={frequencyInput}
            onChange={handleFrequencyInputChange}
            onBlur={handleFrequencyInputBlur}
            disabled={isDisabled}
            className="w-24 ml-2"
          />
          <span className="ml-2 text-sm text-muted-foreground">Hz</span>
          <Switch
            checked={manifestSound}
            onCheckedChange={setManifestSound}
            disabled={isDisabled}
            id="sound-toggle"
            className="ml-4 mr-2"
          />
          <Label htmlFor="sound-toggle" className="cursor-pointer">
            {manifestSound ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </Label>
        </div>
      </div>
      <Slider
        min={0}
        max={10000}
        step={0.1}
        value={manifestFrequency}
        onValueChange={setManifestFrequency}
        disabled={isDisabled}
        className="mb-6"
      />
      
      {manifestSound && manifestFrequency[0] < 100 && (
        <div className="text-sm flex items-start mb-4 p-2 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md">
          <Info className="text-amber-500 mr-2 flex-shrink-0 mt-0.5" size={16} />
          <span>
            Las frecuencias por debajo de 100 Hz pueden ser difíciles de escuchar en parlantes pequeños. 
            Se ha mejorado la audibilidad con armónicos, pero para una experiencia óptima, usa auriculares.
          </span>
        </div>
      )}
    </div>
  );
};

export default FrequencyControl;
