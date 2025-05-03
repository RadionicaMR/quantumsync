
import React from 'react';

interface FrequencyInfoProps {
  frequency: number;
}

const FrequencyInfo: React.FC<FrequencyInfoProps> = ({ frequency }) => {
  return (
    <div className="absolute bottom-3 left-3 text-xs md:text-sm text-white z-40 font-mono bg-black/40 px-2 py-1 rounded">
      Frecuencia: {frequency} Hz
    </div>
  );
};

export default FrequencyInfo;
