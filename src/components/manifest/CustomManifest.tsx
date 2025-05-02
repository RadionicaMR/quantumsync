
import React from 'react';
import { Card } from '@/components/ui/card';
import CustomManifestLeftPanel from './sections/CustomManifestLeftPanel';
import ManifestInterfaceSection from './sections/ManifestInterfaceSection';

interface Pattern {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface CustomManifestProps {
  patterns: Pattern[];
  intention: string;
  setIntention: (value: string) => void;
  patternImage: string | null;
  setPatternImage: (image: string | null) => void;
  patternImages: string[];
  setPatternImages: (images: string[]) => void;
  receptorImage: string | null;
  setReceptorImage: (image: string | null) => void;
  receptorImages: string[];
  setReceptorImages: (images: string[]) => void;
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
  currentImage: 'pattern' | 'receptor' | 'mix';
  receptorName: string;
  setReceptorName: (name: string) => void;
  // Audio props:
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  audioVolume: number;
  setAudioVolume: (vol: number) => void;
  audioSubliminalPlaying: boolean;
  playSubliminalAudio: () => void;
  stopSubliminalAudio: () => void;
  audioLoop?: boolean;
  setAudioLoop?: (loop: boolean) => void;
  clearAudio?: () => void;
}

const CustomManifest = ({
  patterns,
  intention,
  setIntention,
  patternImage,
  setPatternImage,
  patternImages,
  setPatternImages,
  receptorImage,
  setReceptorImage,
  receptorImages,
  setReceptorImages,
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
  currentImage,
  receptorName,
  setReceptorName,
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
}: CustomManifestProps) => {
  return (
    <Card className="quantum-card p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel: Pattern upload, receptor info, audio controls */}
        <CustomManifestLeftPanel 
          patternImage={patternImage}
          setPatternImage={setPatternImage}
          patternImages={patternImages}
          setPatternImages={setPatternImages}
          receptorImage={receptorImage}
          setReceptorImage={setReceptorImage}
          receptorImages={receptorImages}
          setReceptorImages={setReceptorImages}
          receptorName={receptorName}
          setReceptorName={setReceptorName}
          isManifestActive={isManifestActive}
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
        />
        
        {/* Right Panel: Intention setup and visualization */}
        <div className="lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4">Programa tu Intención</h3>
          
          <ManifestInterfaceSection 
            patterns={patterns}
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
            patternImage={patternImage}
            patternImages={patternImages}
            receptorImage={receptorImage}
            receptorImages={receptorImages}
            currentImage={currentImage}
            receptorName={receptorName}
          />
        </div>
      </div>
    </Card>
  );
};

export default CustomManifest;
