
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import AudioSubliminalControls from '@/components/AudioSubliminalControls';

interface AudioControlsProps {
  manifestSound: boolean;
  setManifestSound: (value: boolean) => void;
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
  isManifestActive?: boolean;
}

const AudioControls: React.FC<AudioControlsProps> = ({
  manifestSound,
  setManifestSound,
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
  isManifestActive = false,
}) => {
  const disabled = isManifestActive;

  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center justify-between">
        <Label htmlFor="manifest-sound" className="cursor-pointer">Sonido de manifestación</Label>
        <Switch 
          id="manifest-sound" 
          checked={manifestSound} 
          onCheckedChange={setManifestSound}
        />
      </div>
      
      <div className="space-y-2">
        <p className="text-sm font-medium">Audio Subliminal (opcional)</p>
        <AudioSubliminalControls 
          audioFile={audioFile}
          setAudioFile={setAudioFile}
          audioVolume={audioVolume}
          setAudioVolume={setAudioVolume}
          isPlaying={audioSubliminalPlaying}
          playAudio={playSubliminalAudio}
          stopAudio={stopSubliminalAudio}
          isDisabled={disabled}
          audioLoop={audioLoop}
          setAudioLoop={setAudioLoop}
          clearAudio={clearAudio}
        />
      </div>
    </div>
  );
};

export default AudioControls;
