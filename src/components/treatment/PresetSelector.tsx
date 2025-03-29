
import { useState } from 'react';
import { Card } from '@/components/ui/card';

export type TreatmentPreset = {
  id: string;
  name: string;
  frequency: number;
  description: string;
  duration: number;
};

interface PresetSelectorProps {
  presets: TreatmentPreset[];
  selectedPreset: string;
  isPlaying: boolean;
  onSelectPreset: (preset: TreatmentPreset) => void;
}

const PresetSelector = ({
  presets,
  selectedPreset,
  isPlaying,
  onSelectPreset,
}: PresetSelectorProps) => {
  return (
    <Card className="quantum-card p-6">
      <h3 className="text-xl font-semibold mb-4">Seleccionar Tratamiento</h3>
      <div className="space-y-2">
        {presets.map((preset) => (
          <button
            key={preset.id}
            className={`w-full p-3 rounded-lg text-left transition-all ${
              selectedPreset === preset.id 
                ? 'bg-quantum-primary text-white' 
                : 'bg-muted hover:bg-muted/80'
            }`}
            onClick={() => onSelectPreset(preset)}
            disabled={isPlaying}
          >
            <div className="font-medium">{preset.name}</div>
            <div className={`text-sm ${selectedPreset === preset.id ? 'text-white/80' : 'text-muted-foreground'}`}>
              {preset.frequency} Hz · {preset.duration} min
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
};

export default PresetSelector;
