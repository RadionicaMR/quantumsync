
import React from 'react';
import PatternLayer from './PatternLayer';
import ReceptorLayer from './ReceptorLayer';
import IntentionOverlay from './IntentionOverlay';
import StaticOverlayCircles from './StaticOverlayCircles';

interface VisualizationContainerProps {
  showPatternImage: boolean;
  showReceptorImage: boolean;
  patternImageSrc: string | null;
  receptorImageSrc: string | null;
  isActive: boolean;
  intention: string;
  receptorName?: string;
  visualSpeed?: number;
}

const VisualizationContainer: React.FC<VisualizationContainerProps> = ({
  showPatternImage,
  showReceptorImage,
  patternImageSrc,
  receptorImageSrc,
  isActive,
  intention,
  receptorName = "",
  visualSpeed = 10
}) => {
  console.log("VisualizationContainer render with:", { 
    isActive, 
    visualSpeed, 
    showPattern: showPatternImage, 
    showReceptor: showReceptorImage,
    intention
  });
  
  const showEmptyState = !isActive && !patternImageSrc && !receptorImageSrc && !receptorName;
  
  return (
    <div className="relative h-full w-full min-h-[300px] flex items-center justify-center border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
      {showEmptyState && (
        <div className="text-center p-4">
          <p className="text-muted-foreground">
            Configura tu manifestación seleccionando un patrón e intención
          </p>
        </div>
      )}

      {/* Pattern Layer */}
      <PatternLayer 
        isVisible={showPatternImage}
        currentPatternImageSrc={patternImageSrc}
        pulseDuration={0}
        noAnimation={true}
      />
      
      {/* Receptor Layer */}
      <ReceptorLayer 
        isVisible={showReceptorImage}
        currentReceptorImageSrc={receptorImageSrc}
        receptorName={receptorName}
        hasReceptorImage={Boolean(receptorImageSrc)}
        pulseDuration={0}
        noAnimation={true}
      />

      {/* Static overlay circles - using enhanced visual speed */}
      <StaticOverlayCircles 
        isVisible={isActive} 
        visualSpeed={visualSpeed}
      />
      
      {/* Intention overlay - always show when there's an intention */}
      <IntentionOverlay 
        intention={intention} 
        pulseDuration={5}
        noAnimation={!isActive}
      />
    </div>
  );
};

export default VisualizationContainer;
