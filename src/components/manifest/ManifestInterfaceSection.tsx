
import React, { memo, useCallback, useState, useEffect } from 'react';
import ManifestVisualizer from './ManifestVisualizer';
import ManifestActions from './ManifestActions';
import { ManifestPattern } from '@/data/manifestPatterns';

interface ManifestInterfaceSectionProps {
  currentImage: 'pattern' | 'receptor' | 'mix' | 'radionic';
  isManifestActive: boolean;
  patternImage: string | null;
  patternImages: string[];
  receptorImage: string | null;
  receptorImages: string[];
  canStart: boolean;
  timeRemaining: number | null;
  startManifestation: (intention?: string) => any;
  stopManifestation: () => any;
  formatTimeRemaining: (time: number) => string;
  backgroundModeActive?: boolean;
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
  indefiniteTime?: boolean;
}

// Memoize the component to prevent unnecessary re-renders
const ManifestInterfaceSection = memo(({
  currentImage: externalCurrentImage,
  isManifestActive,
  patternImage,
  patternImages,
  receptorImage,
  receptorImages,
  canStart,
  timeRemaining,
  startManifestation,
  stopManifestation,
  formatTimeRemaining,
  backgroundModeActive = false,
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
  receptorName = "",
  indefiniteTime = false
}: ManifestInterfaceSectionProps) => {
  // Local state to manage the current image
  const [localCurrentImage, setLocalCurrentImage] = 
      useState<'pattern' | 'receptor' | 'mix' | 'radionic'>(externalCurrentImage);
  
  // Store image alternation functions
  const [startImageAlternationFn, setStartImageAlternationFn] = useState<any>(null);
  const [stopImageAlternationFn, setStopImageAlternationFn] = useState<any>(null);
  
  // Ensure we use a stable currentImage value for the visualizer
  const stableCurrentImage = localCurrentImage === 'radionic' ? 'pattern' : localCurrentImage;
  
  // Update local state when external state changes
  useEffect(() => {
    if (!isManifestActive) {
      setLocalCurrentImage('mix');
    }
  }, [isManifestActive]);
  
  // Convert manifestPatterns record to array if needed
  const patternsArray = Array.isArray(patterns) ? patterns : [];
  
  // Handle start manifestation
  const handleStartManifestation = useCallback(() => {
    // Start manifestation and get the function to start image alternation
    const startImageAlternationWithState = startManifestation(intention);
    
    // Store the function to use later
    setStartImageAlternationFn(() => startImageAlternationWithState);
    
    // Call the function with current state
    if (startImageAlternationWithState) {
      startImageAlternationWithState(localCurrentImage, setLocalCurrentImage);
    }
  }, [intention, startManifestation, localCurrentImage]);
  
  // Handle stop manifestation
  const handleStopManifestation = useCallback(() => {
    // Stop manifestation and get the function to stop image alternation
    const stopImageAlternationWithState = stopManifestation();
    
    // Store the function to use later
    setStopImageAlternationFn(() => stopImageAlternationWithState);
    
    // Call the function with current state
    if (stopImageAlternationWithState) {
      stopImageAlternationWithState(setLocalCurrentImage);
    }
  }, [stopManifestation]);
  
  return (
    <div className="bg-card/90 dark:bg-black/40 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Interfaz de Manifestación</h3>
      
      <ManifestVisualizer
        currentImage={stableCurrentImage}
        patternImage={patternImage}
        patternImages={patternImages}
        receptorImage={receptorImage}
        receptorImages={receptorImages}
        isActive={isManifestActive}
        selectedPattern={selectedPattern}
        patterns={patternsArray}
        manifestPatterns={manifestPatterns}
        intention={intention}
        manifestSound={manifestSound}
        manifestFrequency={manifestFrequency}
        exposureTime={exposureTime}
        manifestSpeed={manifestSpeed}
        visualSpeed={visualSpeed}
        rate1={rate1}
        rate2={rate2}
        rate3={rate3}
        receptorName={receptorName}
      />
      
      <ManifestActions 
        isManifestActive={isManifestActive}
        canStart={canStart}
        timeRemaining={timeRemaining}
        startManifestation={handleStartManifestation}
        stopManifestation={handleStopManifestation}
        formatTimeRemaining={formatTimeRemaining}
        backgroundModeActive={backgroundModeActive}
        indefiniteTime={indefiniteTime}
        intention={intention}
      />
    </div>
  );
});

ManifestInterfaceSection.displayName = 'ManifestInterfaceSection';

export default ManifestInterfaceSection;
