import React from 'react';
import AudioSubliminalSection from './sections/AudioSubliminalSection';
import PatternSection from './sections/PatternSection';
import ReceptorSection from './sections/ReceptorSection';
import ManifestInterfaceSection from './sections/ManifestInterfaceSection';
import CustomManifestLeftPanel from './sections/CustomManifestLeftPanel';

interface CustomManifestProps {
  patterns: any[];
  intention: string;
  setIntention: (intention: string) => void;
  patternImage: string | null;
  setPatternImage: (image: string | null) => void;
  patternImages: string[];
  setPatternImages: (images: string[]) => void;
  receptorImage: string | null;
  setReceptorImage: (image: string | null) => void;
  receptorImages: string[];
  setReceptorImages: (images: string[]) => void;
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
  isManifestActive: boolean;
  timeRemaining: number | null;
  startManifestation: () => void;
  stopManifestation: () => void;
  formatTimeRemaining: (time: number) => string;
  currentImage: 'pattern' | 'receptor' | 'mix';
  receptorName: string;
  setReceptorName: (name: string) => void;
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  audioVolume: number;
  setAudioVolume: (vol: number) => void;
  audioSubliminalPlaying: boolean;
  playSubliminalAudio: () => void;
  stopSubliminalAudio: () => void;
  audioLoop: boolean;
  setAudioLoop: (loop: boolean) => void;
  clearAudio: () => void;
  backgroundModeActive?: boolean;
}

const CustomManifest: React.FC<CustomManifestProps> = ({
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
  audioLoop,
  setAudioLoop,
  clearAudio,
  backgroundModeActive = false,
}) => {

  // Calculated values
  const canStart = intention.trim() !== "" && 
                 (patternImage !== null || patternImages.length > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Panel izquierdo: configuraciones */}
      <div className="lg:col-span-1 space-y-6">
        <CustomManifestLeftPanel
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
        />
        
        {/* Audio Subliminal Section */}
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
      
      {/* Panel derecho: visualización y controles principales */}
      <div className="lg:col-span-2 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
        </div>
        
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
          backgroundModeActive={backgroundModeActive}
        />
      </div>
    </div>
  );
};

export default CustomManifest;
