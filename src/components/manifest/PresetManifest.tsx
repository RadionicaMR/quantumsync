import React from 'react';
import { Card } from '@/components/ui/card';
import { ManifestPattern } from '@/data/manifestPatterns';
import ManifestInterfaceSection from './sections/ManifestInterfaceSection';
import PatternSelection from './PatternSelection';
import IntentionInput from './IntentionInput';
import AudioControls from './AudioControls';
import FrequencyControls from './FrequencyControls';
import TimingControls from './TimingControls';

// Added backgroundModeActive to interface
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
  manifestSpeed: number[];
  setManifestSpeed: (value: number[]) => void;
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
  currentImage: 'pattern' | 'receptor' | 'mix';
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
  manifestSpeed,
  setManifestSpeed,
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
}) => {
  // Convert patterns array to a record for easier access
  const manifestPatterns: Record<string, string> = patterns.reduce((acc, pattern) => {
    acc[pattern.id] = pattern.image;
    return acc;
  }, {});

  const canStart =
    selectedPattern !== null &&
    selectedPattern !== undefined &&
    selectedPattern !== '';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Panel - Configuration */}
      <div className="lg:col-span-1">
        <Card className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Configuración</h3>

          <PatternSelection
            patterns={patterns}
            selectedPattern={selectedPattern}
            selectPattern={selectPattern}
          />

          <IntentionInput intention={intention} setIntention={setIntention} />

          <AudioControls
            manifestSound={manifestSound}
            setManifestSound={setManifestSound}
            audioFile={audioFile}
            setAudioFile={setAudioFile}
            audioVolume={audioVolume}
            setAudioVolume={setAudioVolume}
            audioSubliminalPlaying={audioSubliminalPlaying}
            playSubliminalAudio={playSubliminalAudio}
            stopSubliminalAudio={stopSubliminalAudio}
          />

          <FrequencyControls
            manifestFrequency={manifestFrequency}
            setManifestFrequency={setManifestFrequency}
          />

          <TimingControls
            exposureTime={exposureTime}
            setExposureTime={setExposureTime}
            manifestSpeed={manifestSpeed}
            setManifestSpeed={setManifestSpeed}
          />
        </Card>
      </div>

      {/* Right Panel - Interface */}
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
          backgroundModeActive={backgroundModeActive}
        />
      </div>
    </div>
  );
};

export default PresetManifest;
