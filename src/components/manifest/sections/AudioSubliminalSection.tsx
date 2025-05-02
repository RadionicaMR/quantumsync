
import React from 'react';
import AudioSubliminalControls from '@/components/AudioSubliminalControls';

interface AudioSubliminalSectionProps {
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  audioVolume: number;
  setAudioVolume: (vol: number) => void;
  audioSubliminalPlaying: boolean;
  playSubliminalAudio: () => void;
  stopSubliminalAudio: () => void;
  isManifestActive: boolean;
  audioLoop?: boolean;
  setAudioLoop?: (loop: boolean) => void;
  clearAudio?: () => void;
}

const AudioSubliminalSection = ({
  audioFile,
  setAudioFile,
  audioVolume,
  setAudioVolume,
  audioSubliminalPlaying,
  playSubliminalAudio,
  stopSubliminalAudio,
  isManifestActive,
  audioLoop = true,
  setAudioLoop = () => {},
  clearAudio = () => {}
}: AudioSubliminalSectionProps) => {
  return (
    <div className="mt-6">
      <AudioSubliminalControls
        audioFile={audioFile}
        setAudioFile={setAudioFile}
        audioVolume={audioVolume}
        setAudioVolume={setAudioVolume}
        isPlaying={audioSubliminalPlaying}
        playAudio={playSubliminalAudio}
        stopAudio={stopSubliminalAudio}
        isDisabled={isManifestActive}
        maxVolume={20}
        audioLoop={audioLoop}
        setAudioLoop={setAudioLoop}
        clearAudio={clearAudio}
      />
    </div>
  );
};

export default AudioSubliminalSection;
