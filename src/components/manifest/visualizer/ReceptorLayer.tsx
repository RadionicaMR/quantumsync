
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

  const hasReceptorName = receptorName && receptorName.trim().length > 0;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center z-20">
      {/* Show receptor image if available */}
      {hasReceptorImage && (
        <img 
          src={currentReceptorImageSrc || ''}
          alt="Imagen del receptor"
          className="absolute inset-0 w-full h-full object-contain"
          style={{ 
            opacity: 1,
            mixBlendMode: 'multiply',
            filter: 'contrast(1.2) brightness(1.1)',
            transition: `opacity ${pulseDuration/2}s ease-in-out`,
            animation: `pulse ${pulseDuration}s infinite alternate-reverse ease-in-out`
          }}
        />
      )}
      
      {/* Show receptor name when needed */}
      {hasReceptorName && (!hasReceptorImage) && (
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{
            opacity: 1,
            transition: `opacity ${pulseDuration/2}s ease-in-out`,
            animation: `pulse ${pulseDuration}s infinite alternate`
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
