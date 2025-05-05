
import React from 'react';
import { ManifestPattern } from '@/data/manifestPatterns';
import { Card } from '@/components/ui/card';
import ManifestVisualizer from '../ManifestVisualizer';
import ManifestActions from '../ManifestActions';

interface PresetManifestInterfaceProps {
  currentImage: 'pattern' | 'receptor' | 'mix' | 'radionic';
  isManifestActive: boolean;
  patternImage: string | null;
  patternImages: string[];
  receptorImage: string | null;
  receptorImages: string[];
  canStart: boolean;
  timeRemaining: number | null;
  startManifestation: () => void;
  stopManifestation: () => void;
  formatTimeRemaining: (time: number) => string;
  selectedPattern: string;
  patterns: ManifestPattern[];
  manifestPatterns: Record<string, string>;
  intention: string;
  manifestSound: boolean;
  manifestFrequency: number[];
  exposureTime: number[];
  manifestSpeed: number[];
  visualSpeed: number[];
  rate1: string;
  rate2: string;
  rate3: string;
  receptorName: string;
  backgroundModeActive: boolean;
  indefiniteTime: boolean;
}

const PresetManifestInterface = ({
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
  selectedPattern,
  patterns,
  manifestPatterns,
  intention,
  manifestSound,
  manifestFrequency,
  exposureTime,
  manifestSpeed,
  visualSpeed,
  rate1,
  rate2,
  rate3,
  receptorName,
  backgroundModeActive,
  indefiniteTime
}: PresetManifestInterfaceProps) => {
  console.log("PresetManifestInterface render:", { 
    isManifestActive, 
    canStart, 
    intention, 
    currentImage 
  });

  return (
    <div className="space-y-4">
      {/* Visualizer Card */}
      <Card className="bg-card/90 dark:bg-black/40 p-6 rounded-lg">
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4">Visualizador de Manifestación</h3>
          
          <ManifestVisualizer 
            currentImage={currentImage}
            patternImage={patternImage}
            patternImages={patternImages}
            receptorImage={receptorImage}
            receptorImages={receptorImages}
            isActive={isManifestActive}
            selectedPattern={selectedPattern}
            patterns={patterns}
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
        </div>
        
        {/* Single ManifestActions component with intention passed explicitly */}
        <ManifestActions 
          isManifestActive={isManifestActive}
          canStart={canStart}
          timeRemaining={timeRemaining}
          startManifestation={startManifestation}
          stopManifestation={stopManifestation}
          formatTimeRemaining={formatTimeRemaining}
          backgroundModeActive={backgroundModeActive}
          indefiniteTime={indefiniteTime}
          intention={intention}
        />
      </Card>
    </div>
  );
};

export default PresetManifestInterface;
