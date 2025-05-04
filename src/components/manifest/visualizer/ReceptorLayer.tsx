
import React from 'react';

interface ReceptorLayerProps {
  isVisible: boolean;
  currentReceptorImageSrc: string | null;
  receptorName: string;
  hasReceptorImage: boolean;
  pulseDuration: number;
}

const ReceptorLayer: React.FC<ReceptorLayerProps> = ({
  isVisible,
  currentReceptorImageSrc,
  receptorName,
  hasReceptorImage,
  pulseDuration
}) => {
  if (!isVisible) {
    return null;
  }

  const hasReceptorNameText = receptorName && receptorName.trim().length > 0;
  
  // Si no hay imagen ni nombre, mostrar placeholder
  if (!hasReceptorImage && !hasReceptorNameText) {
    return (
      <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/80">
        <div className="text-quantum-primary text-lg font-semibold">
          Receptor no definido
        </div>
      </div>
    );
  }
  
  // Calculate optimized pulse duration based on pulseDuration input
  // Lower values (faster speed) should result in quicker pulses but different from pattern
  const optimizedPulseDuration = Math.max(1, 6 - (pulseDuration / 2));
  
  return (
    <div className="absolute inset-0 flex items-center justify-center z-20">
      {/* Show receptor image if available */}
      {hasReceptorImage && currentReceptorImageSrc && (
        <img 
          src={currentReceptorImageSrc}
          alt="Imagen del receptor"
          className="absolute inset-0 w-full h-full object-contain"
          style={{ 
            opacity: 1,
            mixBlendMode: 'multiply',
            filter: 'contrast(1.2) brightness(1.1)',
            animation: isVisible ? `pulse ${optimizedPulseDuration}s infinite alternate-reverse ease-in-out` : 'none'
          }}
        />
      )}
      
      {/* Show receptor name when needed */}
      {hasReceptorNameText && (!hasReceptorImage) && (
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{
            opacity: 1,
            animation: isVisible ? `pulse ${optimizedPulseDuration}s infinite alternate` : 'none'
          }}
        >
          <div className="text-2xl font-bold text-white bg-black/50 px-6 py-4 rounded-lg">
            {receptorName}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceptorLayer;
