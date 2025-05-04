
import React from 'react';

interface PatternLayerProps {
  isVisible: boolean;
  currentPatternImageSrc: string | null;
  pulseDuration: number;
}

const PatternLayer: React.FC<PatternLayerProps> = ({
  isVisible,
  currentPatternImageSrc,
  pulseDuration
}) => {
  if (!isVisible) {
    return null;
  }
  
  // Si no hay imagen, devuelve un placeholder
  if (!currentPatternImageSrc) {
    return (
      <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/80">
        <div className="text-quantum-primary text-lg font-semibold">
          Patrón no seleccionado
        </div>
      </div>
    );
  }
  
  // Calculate optimized pulse duration based on pulseDuration input
  // Lower values (faster speed) should result in quicker pulses
  const optimizedPulseDuration = Math.max(1, 6 - (pulseDuration / 1.5));
  
  return (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <img 
        src={currentPatternImageSrc}
        alt="Patrón de manifestación"
        className="absolute inset-0 w-full h-full object-contain"
        style={{ 
          opacity: 1,
          mixBlendMode: 'screen',
          filter: 'contrast(1.2) brightness(1.1)',
          animation: `pulse ${optimizedPulseDuration}s infinite alternate ease-in-out`
        }}
      />
    </div>
  );
};

export default PatternLayer;
