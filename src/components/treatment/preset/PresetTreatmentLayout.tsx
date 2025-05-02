import React from 'react';

interface PresetTreatmentLayoutProps {
  presets: any[];
  selectedPreset: string;
  onSelectPreset: (preset: any) => void;
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
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Patrones Predefinidos</h2>
        <select
          value={selectedPreset}
          onChange={(e) => onSelectPreset(presets.find(p => p.id === e.target.value))}
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

      {imageUploader}
      {rateSection}
      {receptorSection}
      {visualizerSection}
      {audioSection}
    </div>
  );
};

export default PresetTreatmentLayout;
