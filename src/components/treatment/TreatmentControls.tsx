
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { TreatmentPreset } from './PresetSelector';
import FrequencyControls from './FrequencyControls';
import TreatmentActions from './TreatmentActions';
import TreatmentEmptyState from './TreatmentEmptyState';
import TreatmentDescription from './TreatmentDescription';
import TreatmentFeedbackVisual from './TreatmentFeedbackVisual';
import SettingsToggles from './SettingsToggles';
import ImageGrid from './ImageGrid';

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
  radionicImage?: string | null;
  setRadionicImage?: (image: string | null) => void;
  radionicImages?: string[];
  setRadionicImages?: (images: string[]) => void;
  receptorImage?: string | null;
  setReceptorImage?: (image: string | null) => void;
  receptorImages?: string[];
  setReceptorImages?: (images: string[]) => void;
  backgroundModeActive?: boolean;
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
  radionicImage = null,
  setRadionicImage = () => {},
  radionicImages = [],
  setRadionicImages = () => {},
  receptorImage = null,
  setReceptorImage = () => {},
  receptorImages = [],
  setReceptorImages = () => {},
  backgroundModeActive = false,
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left panel - Treatment controls */}
      <div className="lg:col-span-1">
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
          </div>
        </Card>
      </div>
      
      {/* Right panel - Images and Visualizer */}
      <div className="lg:col-span-2">
        <div className="space-y-6">
          {/* Images module - now on top of the right side */}
          <Card className="quantum-card p-6">
            <h3 className="text-xl font-semibold mb-4">Imágenes del Tratamiento</h3>
            <ImageGrid
              radionicImage={radionicImage}
              setRadionicImage={setRadionicImage}
              radionicImages={radionicImages}
              setRadionicImages={setRadionicImages}
              receptorImage={receptorImage}
              setReceptorImage={setReceptorImage}
              receptorImages={receptorImages}
              setReceptorImages={setReceptorImages}
              isPlaying={isPlaying}
            />
          </Card>
          
          {/* Visualizer and actions */}
          <Card className="quantum-card p-6">
            <h3 className="text-xl font-semibold mb-4">Visualizador</h3>
            
            <TreatmentFeedbackVisual
              isPlaying={isPlaying}
              visualFeedback={visualFeedback}
              frequency={frequency}
              intensity={intensity}
            />
            
            <div className="mt-6">
              <TreatmentActions
                isPlaying={isPlaying}
                timeRemaining={timeRemaining}
                formatTime={formatTime}
                startTreatment={startTreatment}
                stopTreatment={stopTreatment}
                receptorName={receptorName}
                backgroundModeActive={backgroundModeActive}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TreatmentControls;
