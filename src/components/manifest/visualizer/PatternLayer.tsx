
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
  if (!isVisible || !currentPatternImageSrc) {
    return null;
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
          transition: `opacity ${pulseDuration/2}s ease-in-out`,
          animation: `pulse ${pulseDuration}s infinite alternate ease-in-out`
        }}
      />
    </div>
  );
};

export default PatternLayer;
