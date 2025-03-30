
import { useState } from 'react';
import { Volume2, VolumeX, Clock } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import QuantumButton from '@/components/QuantumButton';
import RateInputs from '@/components/treatment/RateInputs';

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
            <Label>Frecuencia de Manifestación: {manifestFrequency[0]} Hz</Label>
            <div className="flex items-center">
              <Switch
                checked={manifestSound}
                onCheckedChange={setManifestSound}
                disabled={isManifestActive}
                id="sound-toggle"
                className="mr-2"
              />
              <Label htmlFor="sound-toggle" className="cursor-pointer">
                {manifestSound ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </Label>
            </div>
          </div>
          <Slider
            min={100}
            max={963}
            step={1}
            value={manifestFrequency}
            onValueChange={setManifestFrequency}
            disabled={isManifestActive}
            className="mb-6"
          />
        </div>
        
        <div className="mt-4">
          <Label className="mb-2 block">Velocidad de Visualización: {visualSpeed[0]}</Label>
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
          <Label className="mb-2 flex items-center gap-2">
            <Clock size={16} className="text-quantum-primary" />
            Tiempo de Exposición: {exposureTime[0]} minutos
          </Label>
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
