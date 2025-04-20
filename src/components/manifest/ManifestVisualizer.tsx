
import React, { useState, useEffect } from 'react';

interface ManifestVisualizerProps {
  isActive: boolean;
  currentImage: 'pattern' | 'receptor' | 'mix';
  patternImage: string | null;
  patternImages?: string[];
  receptorImage: string | null;
  receptorImages?: string[];
  selectedPattern: string;
  patterns: Array<{ id: string; name: string; description: string; image: string }>;
  manifestPatterns: Array<{ id: string; name: string; description: string; image: string }>;
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
  patternImages = [],
  receptorImage,
  receptorImages = [],
  selectedPattern,
  patterns,
  manifestPatterns,
  intention,
  visualSpeed,
  exposureTime,
  rate1,
  rate2,
  rate3,
  receptorName = ''
}: ManifestVisualizerProps) => {
  const [currentPatternIndex, setCurrentPatternIndex] = useState(0);
  const [currentReceptorIndex, setCurrentReceptorIndex] = useState(0);

  // Rotate through multiple images
  useEffect(() => {
    if (!isActive) return;
    
    // Only setup image rotation if we have multiple images
    if (patternImages.length > 1 || receptorImages.length > 1) {
      const rotationInterval = 2000; // 2 seconds between image changes
      
      const rotationTimer = setInterval(() => {
        if (patternImages.length > 1) {
          setCurrentPatternIndex(prev => (prev + 1) % patternImages.length);
        }
        
        if (receptorImages.length > 1) {
          setCurrentReceptorIndex(prev => (prev + 1) % receptorImages.length);
        }
      }, rotationInterval);
      
      return () => clearInterval(rotationTimer);
    }
  }, [isActive, patternImages.length, receptorImages.length]);

  if (!isActive) {
    return null;
  }

  // Determine which pattern image to use
  const getPatternImage = () => {
    if (patternImages && patternImages.length > 0) {
      return patternImages[currentPatternIndex];
    }
    if (patternImage) {
      return patternImage;
    }
    if (selectedPattern) {
      const patternsToUse = patterns || manifestPatterns;
      return patternsToUse.find(p => p.id === selectedPattern)?.image;
    }
    return null;
  };

  // Determine which receptor image to use
  const getReceptorImage = () => {
    if (receptorImages && receptorImages.length > 0) {
      return receptorImages[currentReceptorIndex];
    }
    return receptorImage;
  };

  const hasPatternImage = !!getPatternImage();
  const hasReceptorImage = !!getReceptorImage();
  const hasImages = hasPatternImage || hasReceptorImage;
  const hasContent = hasImages || receptorName || intention;
  
  // Calculate rate animation speed based on visual speed
  const rateAnimationDuration = Math.max(5, 15 - visualSpeed[0]);

  return (
    <div className="mt-6 relative overflow-hidden rounded-lg bg-white aspect-square">
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Mostrar imagen según el estado actual */}
        {currentImage === 'pattern' && hasPatternImage && (
          <img 
            src={getPatternImage()}
            alt="Patrón de manifestación"
            className="max-h-full max-w-full object-contain opacity-80 transition-opacity duration-300"
            style={{ animation: `pulse ${60/visualSpeed[0]}s infinite alternate` }}
          />
        )}
        
        {currentImage === 'receptor' && hasReceptorImage && (
          <img 
            src={getReceptorImage()}
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
                src={getPatternImage()}
                alt="Mezcla de imágenes"
                className="absolute inset-0 max-h-full max-w-full object-contain opacity-40 mix-blend-overlay"
                style={{ animation: `pulse ${60/visualSpeed[0]}s infinite alternate` }}
              />
            )}
            
            {hasReceptorImage && (
              <img 
                src={getReceptorImage()}
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
              <div className="absolute text-blue-400 font-mono bg-black/60 px-3 py-2 rounded text-sm md:text-base shadow-lg border border-blue-500/30" 
                  style={{ 
                    left: '20%', 
                    top: '20%',
                    maxWidth: '80%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    animation: `random-move ${rateAnimationDuration}s infinite alternate`,
                    textShadow: '0 0 5px rgba(59, 130, 246, 0.7)'
                  }}>
                {rate1}
              </div>
            )}
            {rate2 && (
              <div className="absolute text-blue-400 font-mono bg-black/60 px-3 py-2 rounded text-sm md:text-base shadow-lg border border-blue-500/30"
                  style={{ 
                    left: '50%', 
                    top: '40%',
                    maxWidth: '80%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    animation: `random-move ${rateAnimationDuration + 3}s infinite alternate-reverse`,
                    textShadow: '0 0 5px rgba(59, 130, 246, 0.7)'
                  }}>
                {rate2}
              </div>
            )}
            {rate3 && (
              <div className="absolute text-blue-400 font-mono bg-black/60 px-3 py-2 rounded text-sm md:text-base shadow-lg border border-blue-500/30"
                  style={{ 
                    left: '30%', 
                    top: '60%',
                    maxWidth: '80%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    animation: `random-move ${rateAnimationDuration + 5}s infinite`,
                    textShadow: '0 0 5px rgba(59, 130, 246, 0.7)'
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
