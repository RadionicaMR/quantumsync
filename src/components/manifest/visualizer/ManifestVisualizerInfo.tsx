
import React from 'react';

interface ManifestVisualizerInfoProps {
  isActive: boolean;
  manifestFrequency: number[];
  visualSpeed: number[];
  rate1?: string;
  rate2?: string;
  rate3?: string;
}

const ManifestVisualizerInfo: React.FC<ManifestVisualizerInfoProps> = ({
  isActive,
  manifestFrequency,
  visualSpeed,
  rate1,
  rate2,
  rate3
}) => {
  if (!isActive) {
    return null;
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-3 text-sm">
      <div className="grid grid-cols-2 gap-2 text-center">
        <div>Frecuencia: {manifestFrequency[0]}Hz</div>
        <div>Velocidad: {visualSpeed[0]}</div>
        {rate1 && <div>Tasa 1: {rate1}</div>}
        {rate2 && <div>Tasa 2: {rate2}</div>}
        {rate3 && <div>Tasa 3: {rate3}</div>}
      </div>
    </div>
  );
};

export default ManifestVisualizerInfo;
