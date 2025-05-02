
import React from 'react';
import ManifestControls from '../ManifestControls';
import ManifestVisualizer from '../ManifestVisualizer';

interface Pattern {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface ManifestInterfaceSectionProps {
  patterns: Pattern[];
  intention: string;
  setIntention: (value: string) => void;
  manifestSound: boolean;
  setManifestSound: (value: boolean) => void;
  manifestFrequency: number[];
  setManifestFrequency: (value: number[]) => void;
  visualSpeed: number[];
  setVisualSpeed: (value: number[]) => void;
  exposureTime: number[];
  setExposureTime: (value: number[]) => void;
  rate1: string;
  setRate1: (value: string) => void;
  rate2: string;
  setRate2: (value: string) => void;
  rate3: string;
  setRate3: (value: string) => void;
  isManifestActive: boolean;
  timeRemaining: number | null;
  startManifestation: () => void;
  stopManifestation: () => void;
  formatTimeRemaining: (minutes: number) => string;
  patternImage: string | null;
  patternImages: string[];
  receptorImage: string | null;
  receptorImages: string[];
  currentImage: 'pattern' | 'receptor' | 'mix';
  receptorName: string;
  canStart?: boolean;
}

const ManifestInterfaceSection = ({
  patterns,
  intention,
  setIntention,
  manifestSound,
  setManifestSound,
  manifestFrequency,
  setManifestFrequency,
  visualSpeed,
  setVisualSpeed,
  exposureTime,
  setExposureTime,
  rate1,
  setRate1,
  rate2,
  setRate2,
  rate3,
  setRate3,
  isManifestActive,
  timeRemaining,
  startManifestation,
  stopManifestation,
  formatTimeRemaining,
  patternImage,
  patternImages,
  receptorImage,
  receptorImages,
  currentImage,
  receptorName,
  canStart
}: ManifestInterfaceSectionProps) => {
  return (
    <div className="space-y-6">
      <ManifestControls
        intention={intention}
        setIntention={setIntention}
        manifestSound={manifestSound}
        setManifestSound={setManifestSound}
        manifestFrequency={manifestFrequency}
        setManifestFrequency={setManifestFrequency}
        visualSpeed={visualSpeed}
        setVisualSpeed={setVisualSpeed}
        exposureTime={exposureTime}
        setExposureTime={setExposureTime}
        rate1={rate1}
        setRate1={setRate1}
        rate2={rate2}
        setRate2={setRate2}
        rate3={rate3}
        setRate3={setRate3}
        isManifestActive={isManifestActive}
        timeRemaining={timeRemaining}
        startManifestation={startManifestation}
        stopManifestation={stopManifestation}
        formatTimeRemaining={formatTimeRemaining}
        canStart={canStart || patternImages.length > 0 || !!receptorName.trim()}
      />
      
      <ManifestVisualizer
        isActive={isManifestActive}
        currentImage={currentImage}
        patternImage={patternImage}
        patternImages={patternImages}
        receptorImage={receptorImage}
        receptorImages={receptorImages}
        selectedPattern=""
        patterns={patterns}
        manifestPatterns={patterns}
        intention={intention}
        visualSpeed={visualSpeed}
        exposureTime={exposureTime}
        rate1={rate1}
        rate2={rate2}
        rate3={rate3}
        receptorName={receptorName}
      />
    </div>
  );
};

export default ManifestInterfaceSection;
