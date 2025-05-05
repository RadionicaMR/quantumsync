
import React, { useEffect } from 'react';
import { ManifestPattern } from '@/data/manifestPatterns';
import IntentionOverlay from './visualizer/IntentionOverlay';
import PatternLayer from './visualizer/PatternLayer';
import ReceptorLayer from './visualizer/ReceptorLayer';

interface ManifestVisualizerProps {
  currentImage: 'pattern' | 'receptor' | 'mix' | 'radionic';
  patternImage: string | null;
  patternImages: string[];
  receptorImage: string | null;
  receptorImages: string[];
  isActive: boolean;
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

const ManifestVisualizer: React.FC<ManifestVisualizerProps> = ({
  currentImage,
  patternImage,
  patternImages,
  receptorImage,
  receptorImages,
  isActive,
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
}) => {
  // Debug log for visualization
  useEffect(() => {
    console.log("ManifestVisualizer render:", {
      currentImage,
      isActive,
      patternImage,
      receptorImage,
      patternImagesCount: patternImages.length,
      receptorImagesCount: receptorImages.length,
      selectedPattern,
      intention,
      visualSpeed
    });
  }, [currentImage, isActive, patternImage, receptorImage, patternImages, receptorImages, selectedPattern, intention, visualSpeed]);

  // Get the current pattern image
  const getPatternImageSrc = () => {
    if (patternImage) {
      return patternImage;
    } else if (patternImages.length > 0) {
      // Return the first image from the array
      return patternImages[0];
    } else if (selectedPattern && manifestPatterns[selectedPattern]) {
      return manifestPatterns[selectedPattern];
    }
    return null;
  };

  // Get the current receptor image or name
  const getReceptorImageSrc = () => {
    if (receptorImage) {
      return receptorImage;
    } else if (receptorImages.length > 0) {
      // Return the first image from the array
      return receptorImages[0];
    }
    return null;
  };

  const patternImageSrc = getPatternImageSrc();
  const receptorImageSrc = getReceptorImageSrc();
  
  // For preset patterns, determine which images to show based on current mode
  let showPatternImage = true;
  let showReceptorImage = true;
  
  // For predefined manifests, toggle between pattern and receptor if active
  if (isActive && currentImage !== 'mix') {
    showPatternImage = currentImage === 'pattern' || currentImage === 'radionic';
    showReceptorImage = currentImage === 'receptor';
  }

  return (
    <div className="relative min-h-[300px] bg-black/20 dark:bg-black/40 rounded-lg overflow-hidden p-4">
      <div className="absolute inset-0 flex items-center justify-center">
        {!isActive && !patternImageSrc && !receptorImageSrc && !receptorName && (
          <div className="text-center p-4">
            <p className="text-muted-foreground">
              Configura tu manifestación seleccionando un patrón e intención
            </p>
          </div>
        )}

        {/* Pattern Layer - Show only when it should be visible */}
        <PatternLayer 
          isVisible={showPatternImage}
          currentPatternImageSrc={patternImageSrc}
          pulseDuration={0}
          noAnimation={true}
        />
        
        {/* Receptor Layer - Show only when it should be visible */}
        <ReceptorLayer 
          isVisible={showReceptorImage}
          currentReceptorImageSrc={receptorImageSrc}
          receptorName={receptorName}
          hasReceptorImage={Boolean(receptorImageSrc)}
          pulseDuration={0}
          noAnimation={true}
        />
      </div>

      {/* Overlay information when active */}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-3 text-sm">
          <div className="grid grid-cols-2 gap-2 text-center">
            <div>Frecuencia: {manifestFrequency[0]}Hz</div>
            <div>Velocidad: {visualSpeed[0]}</div>
            {rate1 && <div>Tasa 1: {rate1}</div>}
            {rate2 && <div>Tasa 2: {rate2}</div>}
            {rate3 && <div>Tasa 3: {rate3}</div>}
          </div>
        </div>
      )}
      
      {/* Static circles instead of pulsing overlay */}
      {isActive && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div className="w-12 h-12 bg-quantum-primary/20 rounded-full"></div>
          <div className="w-24 h-24 bg-quantum-primary/15 rounded-full"></div>
          <div className="w-36 h-36 bg-quantum-primary/10 rounded-full"></div>
        </div>
      )}
      
      {/* Intention overlay - Always show when active regardless of currentImage */}
      {isActive && intention && (
        <IntentionOverlay 
          intention={intention} 
          pulseDuration={0}
          noAnimation={true}
        />
      )}
    </div>
  );
};

export default ManifestVisualizer;
