
import { useState, useEffect } from 'react';
import RateInputs from '@/components/treatment/RateInputs';
import IntentionInput from './controls/IntentionInput';
import FrequencyControl from './controls/FrequencyControl';
import VisualizationSpeedControl from './controls/VisualizationSpeedControl';
import ExposureTimeControl from './controls/ExposureTimeControl';
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
  timeRemaining: number | null;
  startManifestation: () => void;
  stopManifestation: () => void;
  formatTimeRemaining: (minutes: number) => string;
  canStart: boolean;
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
  timeRemaining,
  startManifestation,
  stopManifestation,
  formatTimeRemaining,
  canStart
}) => {
  
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <IntentionInput 
          intention={intention}
          setIntention={setIntention}
          isDisabled={isManifestActive}
        />
        
        <FrequencyControl
          manifestSound={manifestSound}
          setManifestSound={setManifestSound}
          manifestFrequency={manifestFrequency}
          setManifestFrequency={setManifestFrequency}
          isDisabled={isManifestActive}
        />
        
        <VisualizationSpeedControl
          visualSpeed={visualSpeed}
          setVisualSpeed={setVisualSpeed}
          isDisabled={isManifestActive}
        />

        <ExposureTimeControl
          exposureTime={exposureTime}
          setExposureTime={setExposureTime}
          isDisabled={isManifestActive}
        />

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
      
      <ManifestActionButtons
        isManifestActive={isManifestActive}
        timeRemaining={timeRemaining}
        formatTimeRemaining={formatTimeRemaining}
        startManifestation={startManifestation}
        stopManifestation={stopManifestation}
        canStart={canStart}
        intention={intention}
      />
    </div>
  );
};

export default ManifestControls;
