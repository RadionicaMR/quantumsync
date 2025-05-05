
import React from 'react';

interface PatternLayerProps {
  isVisible: boolean;
  currentPatternImageSrc: string | null;
  pulseDuration: number;
  noAnimation?: boolean;
}

const PatternLayer: React.FC<PatternLayerProps> = ({
  isVisible,
  currentPatternImageSrc,
  pulseDuration,
  noAnimation = false
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
          animation: 'none' // Never animate
        }}
      />
    </div>
  );
};

export default PatternLayer;
