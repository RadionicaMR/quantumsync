
import React, { useState, useEffect } from 'react';
import { ManifestPattern } from '@/data/manifestPatterns';
import { useIsMobile } from '@/hooks/use-mobile';
import { calculateAnimationSpeeds, getCurrentPatternImage, getCurrentReceptorImage } from '@/utils/visualizerUtils';
import PatternLayer from './visualizer/PatternLayer';
import ReceptorLayer from './visualizer/ReceptorLayer';
import PulsingOverlay from './visualizer/PulsingOverlay';
import IntentionOverlay from './visualizer/IntentionOverlay';
import RatesDisplay from './visualizer/RatesDisplay';
import FrequencyInfo from './visualizer/FrequencyInfo';

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
    receptorImagesCount: receptorImages ? receptorImages.length : 0,
    selectedPattern,
    manifestPatterns
  });

  // Rotate through multiple images when active
  useEffect(() => {
    if (!isActive) return;
    
    console.log("Configurando rotación de imágenes:", {
      patternImagesLength: patternImages.length,
      receptorImagesLength: receptorImages.length
    });
    
    // Only setup rotation if we have multiple images
    if ((patternImages && patternImages.length > 1) || (receptorImages && receptorImages.length > 1)) {
      const speedValue = visualSpeed && visualSpeed.length > 0 ? visualSpeed[0] : 10;
      const rotationInterval = Math.max(1000, 3000 - (speedValue * 100));
      
      console.log("Iniciando rotación de imágenes con intervalo:", rotationInterval);
      
      const rotationTimer = setInterval(() => {
        if (!document.hidden) {
          if (patternImages && patternImages.length > 1) {
            setCurrentPatternIndex(prev => (prev + 1) % patternImages.length);
          }
          
          if (receptorImages && receptorImages.length > 1) {
            setCurrentReceptorIndex(prev => (prev + 1) % receptorImages.length);
          }
        }
      }, rotationInterval);
      
      return () => clearInterval(rotationTimer);
    }
  }, [isActive, patternImages, receptorImages, visualSpeed]);

  // Get the selected pattern image
  const getSelectedPatternImage = (): string | null => {
    if (selectedPattern) {
      console.log("Buscando patrón seleccionado:", selectedPattern, "en", patterns);
      const selectedPatternObj = patterns.find(p => p.id === selectedPattern);
      if (selectedPatternObj) {
        console.log("Patrón encontrado en el array patterns:", selectedPatternObj);
        return selectedPatternObj.image;
      } else if (manifestPatterns && manifestPatterns[selectedPattern]) {
        console.log("Patrón encontrado en manifestPatterns:", manifestPatterns[selectedPattern]);
        return manifestPatterns[selectedPattern];
      }
    }
    return null;
  };

  const selectedPatternImage = getSelectedPatternImage();
  
  console.log("Imágenes disponibles:", {
    selectedPatternImage,
    patternImages,
    patternImage,
    receptorImages,
    receptorImage
  });
  
  // Seleccionar la imagen correcta para mostrar
  const currentPatternImageSrc = getCurrentPatternImage(patternImages, currentPatternIndex, patternImage, selectedPatternImage);
  const currentReceptorImageSrc = getCurrentReceptorImage(receptorImages, currentReceptorIndex, receptorImage);

  console.log("Imágenes seleccionadas para mostrar:", {
    currentPatternImageSrc,
    currentReceptorImageSrc
  });

  const hasPatternImage = !!currentPatternImageSrc;
  const hasReceptorImage = !!currentReceptorImageSrc;
  const hasContent = hasPatternImage || hasReceptorImage || (receptorName && receptorName.trim().length > 0) || intention;

  // Calculate animation speeds
  const speedValue = visualSpeed && visualSpeed.length > 0 ? visualSpeed[0] : 10;
  const { rateAnimationDuration, pulseDuration } = calculateAnimationSpeeds(speedValue);

  // Si no está activo, mostrar un placeholder
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
      {/* Pattern Layer */}
      <PatternLayer 
        isVisible={currentImage === 'pattern' || currentImage === 'mix'} 
        currentPatternImageSrc={currentPatternImageSrc}
        pulseDuration={pulseDuration}
      />
      
      {/* Receptor Layer */}
      <ReceptorLayer 
        isVisible={currentImage === 'receptor' || currentImage === 'mix'} 
        currentReceptorImageSrc={currentReceptorImageSrc}
        receptorName={receptorName}
        hasReceptorImage={hasReceptorImage}
        pulseDuration={pulseDuration}
      />
      
      {/* Pulsing Background Effect */}
      <PulsingOverlay />
      
      {/* Intention Text Overlay */}
      <IntentionOverlay 
        intention={intention} 
        pulseDuration={pulseDuration} 
      />
      
      {/* Rates Display */}
      <RatesDisplay 
        rate1={rate1} 
        rate2={rate2} 
        rate3={rate3} 
        rateAnimationDuration={rateAnimationDuration} 
      />
      
      {/* Frequency Info */}
      <FrequencyInfo frequency={manifestFrequency[0]} />
    </div>
  );
};

export default ManifestVisualizer;
