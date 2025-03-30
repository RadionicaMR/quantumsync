
import React from 'react';
import { TreatmentPreset } from './PresetSelector';

interface TreatmentDescriptionProps {
  selectedPresetData?: TreatmentPreset;
}

const TreatmentDescription = ({ selectedPresetData }: TreatmentDescriptionProps) => {
  if (!selectedPresetData) return null;
  
  return (
    <div>
      <h4 className="font-medium">{selectedPresetData.name}</h4>
      <p className="text-muted-foreground">{selectedPresetData.description}</p>
    </div>
  );
};

export default TreatmentDescription;
