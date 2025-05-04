
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import PresetManifest from './PresetManifest';
import CustomManifest from './CustomManifest';
import { ManifestPattern } from '@/data/manifestPatterns';

interface ManifestTabsContentProps {
  activeTab: string;
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
  patternImages: string[];
  setPatternImages: (images: string[]) => void;
  receptorImage: string | null;
  setReceptorImage: (image: string | null) => void;
  receptorImages: string[];
  setReceptorImages: (images: string[]) => void;
  isManifestActive: boolean;
  timeRemaining: number | null;
  currentImage: 'pattern' | 'receptor' | 'mix' | 'radionic';
  selectPattern: (pattern: ManifestPattern) => void;
  startManifestation: (intention?: string) => void;
  stopManifestation: () => void;
  formatTimeRemaining: (time: number) => string;
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  audioVolume: number;
  setAudioVolume: (value: number) => void;
  audioSubliminalPlaying: boolean;
  playSubliminalAudio: () => void;
  stopSubliminalAudio: () => void;
  audioLoop?: boolean;
  setAudioLoop?: (value: boolean) => void;
  clearAudio?: () => void;
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

const ManifestTabsContent: React.FC<ManifestTabsContentProps> = ({
  activeTab,
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
  patternImages,
  setPatternImages,
  receptorImage,
  setReceptorImage,
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
  audioLoop = true,
  setAudioLoop = () => {},
  clearAudio = () => {},
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
  return (
    <>
      <TabsContent value="presets" className="space-y-4">
        <PresetManifest
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
          patternImage={patternImage}
          setPatternImage={setPatternImage}
          receptorImage={receptorImage}
          setReceptorImage={setReceptorImage}
          patternImages={patternImages}
          setPatternImages={setPatternImages}
          receptorImages={receptorImages}
          setReceptorImages={setReceptorImages}
          isManifestActive={isManifestActive}
          timeRemaining={timeRemaining}
          currentImage={currentImage}
          selectPattern={selectPattern}
          startManifestation={startManifestation}
          stopManifestation={stopManifestation}
          formatTimeRemaining={formatTimeRemaining}
          audioFile={audioFile}
          setAudioFile={setAudioFile}
          audioVolume={audioVolume}
          setAudioVolume={setAudioVolume}
          audioSubliminalPlaying={audioSubliminalPlaying}
          playSubliminalAudio={playSubliminalAudio}
          stopSubliminalAudio={stopSubliminalAudio}
          backgroundModeActive={backgroundModeActive}
          rate1={rate1}
          rate2={rate2}
          rate3={rate3}
          setRate1={setRate1}
          setRate2={setRate2}
          setRate3={setRate3}
          receptorName={receptorName}
          setReceptorName={setReceptorName}
          indefiniteTime={indefiniteTime}
          setIndefiniteTime={setIndefiniteTime}
        />
      </TabsContent>
      
      <TabsContent value="custom">
        <CustomManifest
          intention={intention}
          setIntention={setIntention}
          patternImage={patternImage}
          setPatternImage={setPatternImage}
          patternImages={patternImages}
          setPatternImages={setPatternImages}
          receptorImage={receptorImage}
          setReceptorImage={setReceptorImage}
          receptorImages={receptorImages}
          setReceptorImages={setReceptorImages}
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
          currentImage={currentImage}
          receptorName={receptorName}
          setReceptorName={setReceptorName}
          audioFile={audioFile}
          setAudioFile={setAudioFile}
          audioVolume={audioVolume}
          setAudioVolume={setAudioVolume}
          audioSubliminalPlaying={audioSubliminalPlaying}
          playSubliminalAudio={playSubliminalAudio}
          stopSubliminalAudio={stopSubliminalAudio}
          audioLoop={audioLoop}
          setAudioLoop={setAudioLoop}
          clearAudio={clearAudio}
          backgroundModeActive={backgroundModeActive}
          patterns={patterns}
          indefiniteTime={indefiniteTime}
          setIndefiniteTime={setIndefiniteTime}
        />
      </TabsContent>
    </>
  );
};

export default ManifestTabsContent;
