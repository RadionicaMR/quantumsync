
import React from 'react';

interface ManifestVisualizerProps {
  isActive: boolean;
  currentImage: 'pattern' | 'receptor' | 'mix';
  patternImage: string | null;
  receptorImage: string | null;
  selectedPattern: string;
  patterns: Array<{ id: string; name: string; description: string; image: string }>;
  intention: string;
  visualSpeed: number[];
  exposureTime: number[];
  rate1: string;
  rate2: string;
  rate3: string;
  receptorName?: string;
}

const ManifestVisualizer = ({
  isActive,
  currentImage,
  patternImage,
  receptorImage,
  selectedPattern,
  patterns,
  intention,
  visualSpeed,
  exposureTime,
  rate1,
  rate2,
  rate3,
  receptorName = ''
}: ManifestVisualizerProps) => {
  if (!isActive) {
    return null;
  }

  const hasPatternImage = patternImage || (selectedPattern && patterns.find(p => p.id === selectedPattern)?.image);
  const hasReceptorImage = !!receptorImage;
  const hasImages = hasPatternImage || hasReceptorImage;
  const hasContent = hasImages || receptorName || intention;

  return (
    <div className="mt-6 relative overflow-hidden rounded-lg bg-white aspect-square">
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Mostrar imagen según el estado actual */}
        {currentImage === 'pattern' && hasPatternImage && (
          <img 
            src={patternImage || patterns.find(p => p.id === selectedPattern)?.image}
            alt="Patrón de manifestación"
            className="max-h-full max-w-full object-contain opacity-80 transition-opacity duration-300"
            style={{ animation: `pulse ${60/visualSpeed[0]}s infinite alternate` }}
          />
        )}
        
        {currentImage === 'receptor' && hasReceptorImage && (
          <img 
            src={receptorImage}
            alt="Imagen del receptor"
            className="max-h-full max-w-full object-contain opacity-80 transition-opacity duration-300"
            style={{ animation: `pulse ${60/visualSpeed[0]}s infinite alternate` }}
          />
        )}
        
        {currentImage === 'mix' && (
          <>
            {/* Superposición de ambas imágenes */}
            {hasPatternImage && (
              <img 
                src={patternImage || patterns.find(p => p.id === selectedPattern)?.image}
                alt="Mezcla de imágenes"
                className="absolute inset-0 max-h-full max-w-full object-contain opacity-40 mix-blend-overlay"
                style={{ animation: `pulse ${60/visualSpeed[0]}s infinite alternate` }}
              />
            )}
            
            {hasReceptorImage && (
              <img 
                src={receptorImage}
                alt="Mezcla de imágenes"
                className="absolute inset-0 max-h-full max-w-full object-contain opacity-40 mix-blend-multiply"
                style={{ animation: `pulse ${60/visualSpeed[0]}s infinite alternate` }}
              />
            )}
          </>
        )}
        
        {/* Mostrar nombre del receptor si no hay imágenes disponibles */}
        {!hasImages && receptorName && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-3xl font-bold text-quantum-primary bg-black/10 px-6 py-4 rounded-lg">
              {receptorName}
            </div>
          </div>
        )}
        
        {/* Texto de la intención */}
        {intention && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div 
              className="max-w-[80%] text-white font-bold text-xl md:text-2xl p-4 text-center bg-black/30 rounded line-clamp-3"
              style={{
                animation: `pulse ${60/visualSpeed[0]}s infinite alternate ease-in-out`,
                textShadow: '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(155,135,245,0.8)'
              }}
            >
              {intention}
            </div>
          </div>
        )}
      </div>

      {/* RATES con movimiento aleatorio */}
      {(rate1 || rate2 || rate3) && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-full h-full max-w-[90%] max-h-[90%]">
            {rate1 && (
              <div className="absolute text-white font-mono bg-black/40 px-2 py-1 rounded text-sm md:text-base" 
                  style={{ 
                    left: '20%', 
                    top: '20%',
                    maxWidth: '80%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    animation: 'random-move 15s infinite alternate'
                  }}>
                {rate1}
              </div>
            )}
            {rate2 && (
              <div className="absolute text-white font-mono bg-black/40 px-2 py-1 rounded text-sm md:text-base"
                  style={{ 
                    left: '50%', 
                    top: '40%',
                    maxWidth: '80%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    animation: 'random-move 18s infinite alternate-reverse'
                  }}>
                {rate2}
              </div>
            )}
            {rate3 && (
              <div className="absolute text-white font-mono bg-black/40 px-2 py-1 rounded text-sm md:text-base"
                  style={{ 
                    left: '30%', 
                    top: '60%',
                    maxWidth: '80%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    animation: 'random-move 20s infinite'
                  }}>
                {rate3}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManifestVisualizer;
