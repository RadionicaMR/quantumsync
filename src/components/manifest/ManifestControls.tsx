
import React from 'react';
import IntentionInput from './controls/IntentionInput';
import FrequencyControl from './controls/FrequencyControl';
import ExposureTimeControl from './controls/ExposureTimeControl';
import VisualizationSpeedControl from './controls/VisualizationSpeedControl';
import RateInputs from '@/components/treatment/RateInputs';
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
  rate1: string;
  setRate1: (value: string) => void;
  rate2: string;
  setRate2: (value: string) => void;
  rate3: string;
  setRate3: (value: string) => void;
  isManifestActive: boolean;
  timeRemaining?: number | null;
  startManifestation?: () => void;
  stopManifestation?: () => void;
  formatTimeRemaining?: (time: number) => string;
  hideActionButtons?: boolean;
  canStart?: boolean;
  indefiniteTime?: boolean;
  setIndefiniteTime?: (value: boolean) => void;
}

export const ManifestControls = ({
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
  hideActionButtons = false,
  canStart = true,
  indefiniteTime = false,
  setIndefiniteTime = () => {}
}: ManifestControlsProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4">Controles de Manifestación</h3>
      
      {/* Intention Input */}
      <IntentionInput 
        intention={intention} 
        setIntention={setIntention} 
        isDisabled={isManifestActive}
      />
      
      {/* Frequency Control */}
      <FrequencyControl
        manifestSound={manifestSound}
        setManifestSound={setManifestSound}
        manifestFrequency={manifestFrequency}
        setManifestFrequency={setManifestFrequency}
        isDisabled={isManifestActive}
      />
      
      {/* Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ExposureTimeControl
          exposureTime={exposureTime}
          setExposureTime={setExposureTime}
          isDisabled={isManifestActive}
          indefiniteTime={indefiniteTime}
          setIndefiniteTime={setIndefiniteTime}
        />
        <VisualizationSpeedControl
          visualSpeed={visualSpeed}
          setVisualSpeed={setVisualSpeed}
          isDisabled={isManifestActive}
        />
      </div>
      
      {/* Rates Input */}
      <RateInputs
        rate1={rate1}
        setRate1={setRate1}
        rate2={rate2}
        setRate2={setRate2}
        rate3={rate3}
        setRate3={setRate3}
        isPlaying={isManifestActive}
      />
      
      {/* Action Buttons */}
      {!hideActionButtons && startManifestation && stopManifestation && formatTimeRemaining && (
        <ManifestActionButtons
          isManifestActive={isManifestActive}
          timeRemaining={timeRemaining || null}
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

export default ManifestControls;
