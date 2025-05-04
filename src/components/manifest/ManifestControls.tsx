
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import IntentionInput from './controls/IntentionInput';
import FrequencyControl from './controls/FrequencyControl';
import ExposureTimeControl from './controls/ExposureTimeControl';
import VisualizationSpeedControl from './controls/VisualizationSpeedControl';
import ManifestActionButtons from './controls/ManifestActionButtons';

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
  rate1?: string;
  setRate1?: (value: string) => void;
  rate2?: string;
  setRate2?: (value: string) => void;
  rate3?: string;
  setRate3?: (value: string) => void;
  isManifestActive: boolean;
  timeRemaining?: number | null;
  startManifestation?: () => void;
  stopManifestation?: () => void;
  formatTimeRemaining?: (time: number) => string;
  canStart?: boolean;
  indefiniteTime?: boolean;
  setIndefiniteTime?: (value: boolean) => void;
  hideActionButtons?: boolean; // Nueva prop para ocultar los botones de acción
}

export const ManifestControls: React.FC<ManifestControlsProps> = ({
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
  timeRemaining = null,
  startManifestation = () => {},
  stopManifestation = () => {},
  formatTimeRemaining = (time) => "",
  canStart = false,
  indefiniteTime = false,
  setIndefiniteTime = () => {},
  hideActionButtons = false // Por defecto, mostrar los botones
}) => {
  return (
    <div className="space-y-6">
      <IntentionInput 
        intention={intention}
        setIntention={setIntention}
        isDisabled={isManifestActive}
      />
      
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="sound-toggle"
            checked={manifestSound}
            onCheckedChange={setManifestSound}
            disabled={isManifestActive}
          />
          <Label htmlFor="sound-toggle">Sonido de manifestación</Label>
        </div>
        
        {manifestSound && (
          <FrequencyControl 
            manifestFrequency={manifestFrequency}
            setManifestFrequency={setManifestFrequency}
            isDisabled={isManifestActive}
          />
        )}
        
        <div className="flex items-center space-x-2">
          <Switch
            id="indefinite-time"
            checked={indefiniteTime}
            onCheckedChange={setIndefiniteTime}
            disabled={isManifestActive}
          />
          <Label htmlFor="indefinite-time">Tiempo indefinido</Label>
        </div>
        
        {!indefiniteTime && (
          <ExposureTimeControl 
            exposureTime={exposureTime}
            setExposureTime={setExposureTime}
            isDisabled={isManifestActive}
          />
        )}
        
        <VisualizationSpeedControl 
          visualSpeed={visualSpeed}
          setVisualSpeed={setVisualSpeed}
          isDisabled={isManifestActive}
        />
      </div>

      {/* Botones de control solo si hideActionButtons es falso */}
      {!hideActionButtons && (
        <ManifestActionButtons 
          isManifestActive={isManifestActive}
          timeRemaining={timeRemaining}
          formatTimeRemaining={formatTimeRemaining}
          startManifestation={startManifestation}
          stopManifestation={stopManifestation}
          canStart={canStart}
          intention={intention}
        />
      )}
    </div>
  );
};
