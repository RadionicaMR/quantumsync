
import React from 'react';
import { Card } from '@/components/ui/card';
import FrequencyControlsSection from '../FrequencyControls';
import { TreatmentPreset } from '@/hooks/useTreatment';

interface PresetTreatmentLayoutProps {
  presets: TreatmentPreset[];
  selectedPreset: string;
  onSelectPreset: (preset: TreatmentPreset) => void;
  isPlaying: boolean;
  imageUploader: React.ReactNode;
  rateSection: React.ReactNode;
  receptorSection: React.ReactNode;
  visualizerSection: React.ReactNode;
  audioSection: React.ReactNode;
  frequency: number[];
  setFrequency: (value: number[]) => void;
  duration: number[];
  setDuration: (value: number[]) => void;
  intensity: number[];
  setIntensity: (value: number[]) => void;
  hypnoticSpeed?: number[];
  setHypnoticSpeed?: (value: number[]) => void;
}

const PresetTreatmentLayout: React.FC<PresetTreatmentLayoutProps> = ({
  presets,
  selectedPreset,
  onSelectPreset,
  isPlaying,
  imageUploader,
  rateSection,
  receptorSection,
  visualizerSection,
  audioSection,
  frequency,
  setFrequency,
  duration,
  setDuration,
  intensity,
  setIntensity,
  hypnoticSpeed = [10],
  setHypnoticSpeed = () => {},
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Selection and Configuration */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="quantum-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Patrones Predefinidos</h2>
            <select
              value={selectedPreset}
              onChange={(e) => {
                const preset = presets.find(p => p.id === e.target.value);
                if (preset) onSelectPreset(preset);
              }}
              disabled={isPlaying}
              className="border rounded p-2"
            >
              {presets.map(preset => (
                <option key={preset.id} value={preset.id}>
                  {preset.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Frequency Module - RESTORED */}
          <FrequencyControlsSection
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

          {imageUploader}
          {rateSection}
          {receptorSection}
          {audioSection}
        </Card>
      </div>
      
      {/* Right Column - Visualizer */}
      <div className="lg:col-span-2">
        {visualizerSection}
      </div>
    </div>
  );
};

export default PresetTreatmentLayout;
