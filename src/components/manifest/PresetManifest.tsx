
import React from 'react';
import { ManifestPattern } from '@/data/manifestPatterns';
import PresetManifestConfigPanel from './sections/PresetManifestConfigPanel';
import PresetManifestInterface from './sections/PresetManifestInterface';

interface PresetManifestProps {
  patterns: ManifestPattern[];
  selectedPattern: string;
  intention: string;
  setIntention: (value: string) => void;
  manifestSound: boolean;
  setManifestSound: (value: boolean) => void;
  manifestFrequency: number[];
  setManifestFrequency: (value: number[]) => void;
  exposureTime: number[];
  setExposureTime: (value: number[]) => void;
  visualSpeed: number[];
  setVisualSpeed: (value: number[]) => void;
  patternImage: string | null;
  setPatternImage: (image: string | null) => void;
  receptorImage: string | null;
  setReceptorImage: (image: string | null) => void;
  patternImages: string[];
  setPatternImages: (images: string[]) => void;
  receptorImages: string[];
  setReceptorImages: (images: string[]) => void;
  isManifestActive: boolean;
  timeRemaining: number | null;
  currentImage: 'pattern' | 'receptor' | 'mix' | 'radionic';  // Updated to include 'radionic'
  selectPattern: (pattern: ManifestPattern) => void;
  startManifestation: () => void;
  stopManifestation: () => void;
  formatTimeRemaining: (time: number) => string;
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  audioVolume: number;
  setAudioVolume: (value: number) => void;
  audioSubliminalPlaying: boolean;
  playSubliminalAudio: () => void;
  stopSubliminalAudio: () => void;
  backgroundModeActive?: boolean;
  rate1: string;
  rate2: string;
  rate3: string;
  setRate1: (value: string) => void;
  setRate2: (value: string) => void;
  setRate3: (value: string) => void;
  receptorName?: string;
  setReceptorName?: (value: string) => void;
  indefiniteTime?: boolean;
  setIndefiniteTime?: (value: boolean) => void;
}

const PresetManifest: React.FC<PresetManifestProps> = ({
  patterns,
  selectedPattern,
  intention,
  setIntention,
  manifestSound,
  setManifestSound,
  manifestFrequency,
  setManifestFrequency,
  exposureTime,
  setExposureTime,
  visualSpeed,
  setVisualSpeed,
  patternImage,
  setPatternImage,
  receptorImage,
  setReceptorImage,
  patternImages,
  setPatternImages,
  receptorImages,
  setReceptorImages,
  isManifestActive,
  timeRemaining,
  currentImage,
  selectPattern,
  startManifestation,
  stopManifestation,
  formatTimeRemaining,
  audioFile,
  setAudioFile,
  audioVolume,
  setAudioVolume,
  audioSubliminalPlaying,
  playSubliminalAudio,
  stopSubliminalAudio,
  backgroundModeActive = false,
  rate1,
  rate2,
  rate3,
  setRate1,
  setRate2,
  setRate3,
  receptorName = "",
  setReceptorName = () => {},
  indefiniteTime = false,
  setIndefiniteTime = () => {}
}) => {
  // Convert patterns array to a record for easier access
  const manifestPatterns: Record<string, string> = patterns.reduce((acc, pattern) => {
    acc[pattern.id] = pattern.image;
    return acc;
  }, {} as Record<string, string>);

  // Validate intention exists
  const isIntentionValid = intention && intention.trim() !== "";
  const canStart = isIntentionValid;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Panel - Configuration */}
      <PresetManifestConfigPanel
        patterns={patterns}
        selectedPattern={selectedPattern}
        intention={intention}
        setIntention={setIntention}
        manifestSound={manifestSound}
        setManifestSound={setManifestSound}
        manifestFrequency={manifestFrequency}
        setManifestFrequency={setManifestFrequency}
        exposureTime={exposureTime}
        setExposureTime={setExposureTime}
        visualSpeed={visualSpeed}
        setVisualSpeed={setVisualSpeed}
        isManifestActive={isManifestActive}
        audioFile={audioFile}
        setAudioFile={setAudioFile}
        audioVolume={audioVolume}
        setAudioVolume={setAudioVolume}
        audioSubliminalPlaying={audioSubliminalPlaying}
        playSubliminalAudio={playSubliminalAudio}
        stopSubliminalAudio={stopSubliminalAudio}
        receptorName={receptorName}
        setReceptorName={setReceptorName}
        selectPattern={selectPattern}
        indefiniteTime={indefiniteTime}
        setIndefiniteTime={setIndefiniteTime}
      />

      {/* Right Panel - Interface */}
      <PresetManifestInterface
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
        manifestSpeed={visualSpeed}
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

export default PresetManifest;
