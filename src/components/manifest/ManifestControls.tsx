
import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Clock, Info } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import QuantumButton from '@/components/QuantumButton';
import RateInputs from '@/components/treatment/RateInputs';
import { Input } from '@/components/ui/input';

interface ManifestControlsProps {
  intention: string;
  setIntention: (value: string) => void;
  manifestSound: boolean;
  setManifestSound: (value: boolean) => void;
  manifestFrequency: number[];
  setManifestFrequency: (value: number[]) => void;
  visualSpeed: number[];
  setVisualSpeed: (value: number[]) => void;
  exposureTime: number[];
  setExposureTime: (value: number[]) => void;
  rate1: string;
  setRate1: (value: string) => void;
  rate2: string;
  setRate2: (value: string) => void;
  rate3: string;
  setRate3: (value: string) => void;
  isManifestActive: boolean;
  timeRemaining: number | null;
  startManifestation: () => void;
  stopManifestation: () => void;
  formatTimeRemaining: (minutes: number) => string;
  canStart: boolean;
}

const ManifestControls = ({
  intention,
  setIntention,
  manifestSound,
  setManifestSound,
  manifestFrequency,
  setManifestFrequency,
  visualSpeed,
  setVisualSpeed,
  exposureTime,
  setExposureTime,
  rate1,
  setRate1,
  rate2,
  setRate2,
  rate3,
  setRate3,
  isManifestActive,
  timeRemaining,
  startManifestation,
  stopManifestation,
  formatTimeRemaining,
  canStart
}: ManifestControlsProps) => {
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
    <div className="space-y-6">
      <div className="mb-6">
        <Label htmlFor="intention" className="mb-2 block">Establece tu intención</Label>
        <Textarea 
          id="intention" 
          placeholder="Escribe tu intención con claridad y precisión..."
          className="min-h-[100px] quantum-input"
          value={intention}
          onChange={(e) => setIntention(e.target.value)}
          disabled={isManifestActive}
        />
        
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <Label>Frecuencia de Manifestación:</Label>
            <div className="flex items-center">
              <Input
                type="text"
                value={frequencyInput}
                onChange={handleFrequencyInputChange}
                onBlur={handleFrequencyInputBlur}
                disabled={isManifestActive}
                className="w-24 ml-2"
              />
              <span className="ml-2 text-sm text-muted-foreground">Hz</span>
              <Switch
                checked={manifestSound}
                onCheckedChange={setManifestSound}
                disabled={isManifestActive}
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
            disabled={isManifestActive}
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
        
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <Label>Velocidad de Visualización:</Label>
            <div className="flex items-center">
              <Input
                type="number"
                value={visualSpeed[0]}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value >= 1 && value <= 30) {
                    setVisualSpeed([value]);
                  }
                }}
                disabled={isManifestActive}
                className="w-24 ml-2"
                min={1}
                max={30}
              />
            </div>
          </div>
          <Slider
            min={1}
            max={30}
            step={1}
            value={visualSpeed}
            onValueChange={setVisualSpeed}
            disabled={isManifestActive}
            className="mb-4"
          />
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <Label className="flex items-center gap-2">
              <Clock size={16} className="text-quantum-primary" />
              Tiempo de Exposición:
            </Label>
            <div className="flex items-center">
              <Input
                type="number"
                value={exposureTime[0]}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value >= 1 && value <= 180) {
                    setExposureTime([value]);
                  }
                }}
                disabled={isManifestActive}
                className="w-24 ml-2"
                min={1}
                max={180}
              />
              <span className="ml-2 text-sm text-muted-foreground">min</span>
            </div>
          </div>
          <Slider
            min={1}
            max={180}
            step={1}
            value={exposureTime}
            onValueChange={setExposureTime}
            disabled={isManifestActive}
            className="mb-4"
          />
        </div>

        {/* Campos RATE */}
        <div className="mt-6">
          <RateInputs 
            rate1={rate1}
            setRate1={setRate1}
            rate2={rate2}
            setRate2={setRate2}
            rate3={rate3}
            setRate3={setRate3}
            isPlaying={isManifestActive}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        {isManifestActive ? (
          <>
            <div className="text-quantum-primary font-medium">
              {timeRemaining !== null && (
                <span>Tiempo restante: {formatTimeRemaining(Math.ceil(timeRemaining))}</span>
              )}
            </div>
            <QuantumButton 
              variant="outline"
              onClick={stopManifestation}
            >
              Detener Manifestación
            </QuantumButton>
          </>
        ) : (
          <>
            <div className="text-muted-foreground">
              {canStart ? 'Listo para iniciar manifestación' : 'Selecciona un patrón para continuar'}
            </div>
            <QuantumButton 
              onClick={startManifestation}
              disabled={!canStart || !intention.trim()}
            >
              Activar Manifestación
            </QuantumButton>
          </>
        )}
      </div>
    </div>
  );
};

export default ManifestControls;
