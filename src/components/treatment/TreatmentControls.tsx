
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { TreatmentPreset } from './PresetSelector';
import FrequencyControls from './FrequencyControls';
import TreatmentActions from './TreatmentActions';
import TreatmentEmptyState from './TreatmentEmptyState';
import TreatmentDescription from './TreatmentDescription';
import TreatmentFeedbackVisual from './TreatmentFeedbackVisual';
import SettingsToggles from './SettingsToggles';

interface TreatmentControlsProps {
  selectedPreset: string | null;
  presets: TreatmentPreset[];
  frequency: number[];
  setFrequency: (value: number[]) => void;
  duration: number[];
  setDuration: (value: number[]) => void;
  intensity: number[];
  setIntensity: (value: number[]) => void;
  useHeadphones: boolean;
  setUseHeadphones: (value: boolean) => void;
  visualFeedback: boolean;
  setVisualFeedback: (value: boolean) => void;
  isPlaying: boolean;
  timeRemaining: number;
  startTreatment: () => void;
  stopTreatment: () => void;
  formatTime: (minutes: number) => string;
  hypnoticSpeed?: number[];
  setHypnoticSpeed?: (value: number[]) => void;
  receptorName?: string;
}

const TreatmentControls = ({
  selectedPreset,
  presets,
  frequency,
  setFrequency,
  duration,
  setDuration,
  intensity,
  setIntensity,
  useHeadphones,
  setUseHeadphones,
  visualFeedback, 
  setVisualFeedback,
  isPlaying,
  timeRemaining,
  startTreatment,
  stopTreatment,
  formatTime,
  hypnoticSpeed = [10],
  setHypnoticSpeed = () => {},
  receptorName = '',
}: TreatmentControlsProps) => {
  const selectedPresetData = presets.find(p => p.id === selectedPreset);
  
  if (!selectedPreset) {
    return (
      <Card className="quantum-card p-6 h-full">
        <h3 className="text-xl font-semibold mb-4">Control de Tratamiento</h3>
        <TreatmentEmptyState />
      </Card>
    );
  }
  
  return (
    <Card className="quantum-card p-6 h-full">
      <h3 className="text-xl font-semibold mb-4">Control de Tratamiento</h3>
      
      <div className="space-y-6">
        <TreatmentDescription selectedPresetData={selectedPresetData} />
        
        <FrequencyControls
          frequency={frequency}
          setFrequency={setFrequency}
          duration={duration}
          setDuration={setDuration}
          intensity={intensity}
          setIntensity={setIntensity}
          hypnoticSpeed={hypnoticSpeed}
          setHypnoticSpeed={setHypnoticSpeed}
          isPlaying={isPlaying}
        />
        
        <SettingsToggles
          useHeadphones={useHeadphones}
          setUseHeadphones={setUseHeadphones}
          visualFeedback={visualFeedback}
          setVisualFeedback={setVisualFeedback}
          isPlaying={isPlaying}
        />
        
        <TreatmentActions
          isPlaying={isPlaying}
          timeRemaining={timeRemaining}
          formatTime={formatTime}
          startTreatment={startTreatment}
          stopTreatment={stopTreatment}
          receptorName={receptorName}
        />
        
        <TreatmentFeedbackVisual
          isPlaying={isPlaying}
          visualFeedback={visualFeedback}
          frequency={frequency}
          intensity={intensity}
        />
      </div>
    </Card>
  );
};

export default TreatmentControls;
