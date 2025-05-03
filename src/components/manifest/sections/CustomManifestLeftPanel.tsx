
import React from 'react';
import { Card } from '@/components/ui/card';
import PatternSection from './PatternSection';
import ReceptorSection from './ReceptorSection';
import AudioSubliminalSection from './AudioSubliminalSection';
import { ManifestControls } from '../ManifestControls';

interface CustomManifestLeftPanelProps {
  patternImage: string | null;
  setPatternImage: (image: string | null) => void;
  patternImages: string[];
  setPatternImages: (images: string[]) => void;
  receptorImage: string | null;
  setReceptorImage: (image: string | null) => void;
  receptorImages: string[];
  setReceptorImages: (images: string[]) => void;
  receptorName: string;
  setReceptorName: (name: string) => void;
  isManifestActive: boolean;
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
  // Add these new props that were being passed to the component
  intention: string;
  setIntention: (intention: string) => void;
  manifestSound: boolean;
  setManifestSound: (sound: boolean) => void;
  manifestFrequency: number[];
  setManifestFrequency: (frequency: number[]) => void;
  visualSpeed: number[];
  setVisualSpeed: (speed: number[]) => void;
  exposureTime: number[];
  setExposureTime: (time: number[]) => void;
  rate1: string;
  setRate1: (rate: string) => void;
  rate2: string;
  setRate2: (rate: string) => void;
  rate3: string;
  setRate3: (rate: string) => void;
  indefiniteTime?: boolean;
  setIndefiniteTime?: (value: boolean) => void;
}

const CustomManifestLeftPanel = ({
  patternImage,
  setPatternImage,
  patternImages,
  setPatternImages,
  receptorImage,
  setReceptorImage,
  receptorImages,
  setReceptorImages,
  receptorName,
  setReceptorName,
  isManifestActive,
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
  indefiniteTime = false,
  setIndefiniteTime = () => {}
}: CustomManifestLeftPanelProps) => {
  // Calculate canStart here to determine button state
  const canStart = intention.trim() !== "" && 
                 (patternImage !== null || patternImages.length > 0);
  
  return (
    <div className="lg:col-span-1 space-y-6">
      <Card className="p-6 quantum-card">
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
          timeRemaining={null}
          startManifestation={() => {}}
          stopManifestation={() => {}}
          formatTimeRemaining={() => ""}
          canStart={canStart}
          indefiniteTime={indefiniteTime}
          setIndefiniteTime={setIndefiniteTime}
        />
      </Card>
      
      <PatternSection 
        patternImage={patternImage}
        setPatternImage={setPatternImage}
        patternImages={patternImages}
        setPatternImages={setPatternImages}
        isManifestActive={isManifestActive}
      />
      
      <ReceptorSection 
        receptorName={receptorName}
        setReceptorName={setReceptorName}
        receptorImage={receptorImage}
        setReceptorImage={setReceptorImage}
        receptorImages={receptorImages}
        setReceptorImages={setReceptorImages}
        isManifestActive={isManifestActive}
      />

      <AudioSubliminalSection 
        audioFile={audioFile}
        setAudioFile={setAudioFile}
        audioVolume={audioVolume}
        setAudioVolume={setAudioVolume}
        audioSubliminalPlaying={audioSubliminalPlaying}
        playSubliminalAudio={playSubliminalAudio}
        stopSubliminalAudio={stopSubliminalAudio}
        isManifestActive={isManifestActive}
        audioLoop={audioLoop}
        setAudioLoop={setAudioLoop}
        clearAudio={clearAudio}
      />
    </div>
  );
};

export default CustomManifestLeftPanel;
