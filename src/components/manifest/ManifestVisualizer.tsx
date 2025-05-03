import React, { useState, useEffect } from 'react';
import { ManifestPattern } from '@/data/manifestPatterns';
import { useIsMobile } from '@/hooks/use-mobile';

interface ManifestVisualizerProps {
  isActive: boolean;
  currentImage: 'pattern' | 'receptor' | 'mix';
  patternImage: string | null;
  patternImages?: string[];
  receptorImage: string | null;
  receptorImages?: string[];
  selectedPattern: string;
  patterns: ManifestPattern[];
  manifestPatterns: Record<string, string>;
  intention: string;
  manifestSound: boolean;
  manifestFrequency: number[];
  exposureTime: number[];
  manifestSpeed: number[];
  visualSpeed?: number[];
  rate1?: string;
  rate2?: string;
  rate3?: string;
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
  manifestSound,
  manifestFrequency,
  exposureTime,
  manifestSpeed,
  visualSpeed = [10],
  rate1 = "",
  rate2 = "",
  rate3 = "",
  receptorName = ""
}: ManifestVisualizerProps) => {
  const [currentPatternIndex, setCurrentPatternIndex] = useState(0);
  const [currentReceptorIndex, setCurrentReceptorIndex] = useState(0);
  const { isIOS } = useIsMobile();

  console.log("ManifestVisualizer RENDER:", { 
    isActive, 
    currentImage, 
    hasPatternImage: !!patternImage || (patternImages && patternImages.length > 0), 
    hasSelectedPattern: !!selectedPattern,
    intention,
    patternImagesCount: patternImages ? patternImages.length : 0,
    receptorImagesCount: receptorImages ? receptorImages.length : 0
  });

  // Rotate through multiple images when active
  useEffect(() => {
    if (!isActive) return;
    
    // Only setup rotation if we have multiple images
    if ((patternImages && patternImages.length > 1) || (receptorImages && receptorImages.length > 1)) {
      const speedValue = visualSpeed && visualSpeed.length > 0 ? visualSpeed[0] : 10;
      
      const rotationInterval = Math.max(1000, 3000 - (speedValue * 100));
      
      const rotationTimer = setInterval(() => {
        if (patternImages && patternImages.length > 1) {
          setCurrentPatternIndex(prev => (prev + 1) % patternImages.length);
        }
        
        if (receptorImages && receptorImages.length > 1) {
          setCurrentReceptorIndex(prev => (prev + 1) % receptorImages.length);
        }
      }, rotationInterval);
      
      return () => clearInterval(rotationTimer);
    }
  }, [isActive, patternImages, receptorImages, visualSpeed]);

  // Get the current pattern image to display
  const getPatternImage = () => {
    if (patternImages && patternImages.length > 0) {
      return patternImages[currentPatternIndex];
    }
    if (patternImage) {
      return patternImage;
    }
    if (selectedPattern) {
      const selectedPatternObj = patterns.find(p => p.id === selectedPattern);
      if (selectedPatternObj) {
        return selectedPatternObj.image;
      } else if (manifestPatterns && manifestPatterns[selectedPattern]) {
        return manifestPatterns[selectedPattern];
      }
    }
    return null;
  };

  // Get the current receptor image to display
  const getReceptorImage = () => {
    if (receptorImages && receptorImages.length > 0) {
      return receptorImages[currentReceptorIndex];
    }
    return receptorImage;
  };

  const currentPatternImageSrc = getPatternImage();
  const currentReceptorImageSrc = getReceptorImage();

  const hasPatternImage = !!currentPatternImageSrc;
  const hasReceptorImage = !!currentReceptorImageSrc;
  const hasReceptorName = receptorName && receptorName.trim().length > 0;
  const hasContent = hasPatternImage || hasReceptorImage || hasReceptorName || intention;

  // Calculate animation speeds based on visualSpeed
  const speedValue = visualSpeed && visualSpeed.length > 0 ? visualSpeed[0] : 10;
  const rateAnimationDuration = Math.max(5, 15 - speedValue);
  const pulseDuration = Math.max(0.5, 5 - (speedValue / 4));

  // If not active, render placeholder
  if (!isActive) {
    return (
      <div className="mt-6 relative overflow-hidden rounded-lg bg-card/90 dark:bg-black/40 aspect-square">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-muted-foreground">
            El visualizador se activará al iniciar la manifestación
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`mt-6 relative overflow-hidden rounded-lg bg-black aspect-square ${isIOS ? 'ios-momentum-scroll' : ''}`}>
      {/* Pattern Images Layer */}
      {(currentImage === 'pattern' || currentImage === 'mix') && hasPatternImage && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <img 
            src={currentPatternImageSrc || ''}
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
      )}
      
      {/* Receptor Layer */}
      {(currentImage === 'receptor' || currentImage === 'mix') && (
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
      )}
      
      {/* Pulsing overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
        <div className="w-12 h-12 bg-quantum-primary/20 rounded-full animate-ping"></div>
        <div className="w-24 h-24 bg-quantum-primary/15 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-36 h-36 bg-quantum-primary/10 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
      </div>

      {/* Intention text overlay */}
      {intention && (
        <div className="absolute inset-0 flex items-center justify-center z-40">
          <div 
            className="max-w-[80%] text-white font-bold text-xl md:text-2xl p-4 text-center bg-black/30 rounded line-clamp-3"
            style={{
              animation: `pulse ${pulseDuration}s infinite alternate ease-in-out`,
              textShadow: '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(155,135,245,0.8)'
            }}
          >
            {intention}
          </div>
        </div>
      )}

      {/* Rates with random movement */}
      {(rate1 || rate2 || rate3) && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
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
      
      {/* Frequency info */}
      <div className="absolute bottom-3 left-3 text-xs md:text-sm text-white z-40 font-mono bg-black/40 px-2 py-1 rounded">
        Frecuencia: {manifestFrequency[0]} Hz
      </div>
    </div>
  );
};

export default ManifestVisualizer;
