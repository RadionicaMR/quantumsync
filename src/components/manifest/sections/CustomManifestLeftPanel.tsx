
import React from 'react';
import PatternSection from './PatternSection';
import ReceptorSection from './ReceptorSection';
import AudioSubliminalSection from './AudioSubliminalSection';

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
  clearAudio = () => {}
}: CustomManifestLeftPanelProps) => {
  return (
    <div className="lg:col-span-1">
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
