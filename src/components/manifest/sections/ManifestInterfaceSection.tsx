
import React, { memo } from 'react';
import ManifestVisualizer from '../ManifestVisualizer';
import ManifestActions from '../ManifestActions';
import { ManifestPattern } from '@/data/manifestPatterns';
import { useEffect } from 'react';

interface ManifestInterfaceSectionProps {
  currentImage: 'pattern' | 'receptor' | 'mix' | 'radionic';  // Includes 'pattern' and 'radionic'
  isManifestActive: boolean;
  patternImage: string | null;
  patternImages: string[];
  receptorImage: string | null;
  receptorImages: string[];
  canStart: boolean;
  timeRemaining: number | null;
  startManifestation: (intention?: string) => void;
  stopManifestation: () => void;
  formatTimeRemaining: (time: number) => string;
  backgroundModeActive?: boolean;
  // Added properties to resolve type errors
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
  currentImage,
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
  // Added props
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
  // Convert manifestPatterns record to array if needed
  const patternsArray = Array.isArray(patterns) ? patterns : [];
  
  // Log intention changes for debugging
  useEffect(() => {
    console.log("ManifestInterfaceSection - Intention actualizada:", {
      intention,
      intentionLength: intention ? intention.length : 0,
      intentionValid: intention && intention.trim() !== "",
      isManifestActive
    });
  }, [intention, isManifestActive]);
  
  // CRUCIAL: Explícitamente pasar la intención cuando se inicia la manifestación
  const handleStartManifestation = () => {
    console.log("ManifestInterfaceSection - Iniciando con intención:", intention);
    if (intention && intention.trim() !== "") {
      startManifestation(intention);
    }
  };
  
  return (
    <div className="bg-card/90 dark:bg-black/40 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Interfaz de Manifestación</h3>
      
      <ManifestVisualizer
        currentImage={currentImage}
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
        stopManifestation={stopManifestation}
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
