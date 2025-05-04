
import React from 'react';
import { ManifestPattern } from '@/data/manifestPatterns';
import ManifestInterfaceSection from './ManifestInterfaceSection';

interface PresetManifestInterfaceProps {
  currentImage: 'pattern' | 'receptor' | 'mix' | 'radionic';  // Updated to include 'radionic'
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

const PresetManifestInterface: React.FC<PresetManifestInterfaceProps> = ({
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
}) => {
  return (
    <div className="lg:col-span-2">
      <ManifestInterfaceSection
        currentImage={currentImage}
        isManifestActive={isManifestActive}
        patternImage={patternImage}
        patternImages={patternImages}
        receptorImage={receptorImage}
        receptorImages={receptorImages}
        canStart={canStart}
        timeRemaining={timeRemaining}
        startManifestation={startManifestation}
        stopManifestation={stopManifestation}
        formatTimeRemaining={formatTimeRemaining}
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
        backgroundModeActive={backgroundModeActive}
        indefiniteTime={indefiniteTime}
      />
    </div>
  );
};

export default PresetManifestInterface;
