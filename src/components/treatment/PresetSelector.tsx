
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
      <h3 className="text-base font-semibold mb-1.5">Seleccionar Tratamiento</h3>
      <div className="space-y-1">
        {presets.map((preset) => (
          <button
            key={preset.id}
            className={`w-full px-2 py-1 rounded-md text-left text-xs leading-tight transition-all ${
              selectedPreset === preset.id 
                ? 'bg-quantum-primary text-white' 
                : 'bg-muted hover:bg-muted/80'
            }`}
            onClick={() => onSelectPreset(preset)}
            disabled={isPlaying}
          >
            <div className="font-medium">{preset.name}</div>
            <div className={`text-[11px] ${selectedPreset === preset.id ? 'text-white/80' : 'text-muted-foreground'}`}>
              {preset.frequency} Hz · {preset.duration} min
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
};

export default PresetSelector;
