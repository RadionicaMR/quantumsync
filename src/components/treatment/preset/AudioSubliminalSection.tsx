
import { Card } from '@/components/ui/card';
import AudioSubliminalControls from '@/components/AudioSubliminalControls';

interface AudioSubliminalSectionProps {
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  audioVolume: number;
  setAudioVolume: (volume: number) => void;
  audioSubliminalPlaying: boolean;
  playSubliminalAudio: () => void;
  stopSubliminalAudio: () => void;
  isPlaying: boolean;
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
  isPlaying,
  audioLoop = true,
  setAudioLoop = () => {},
  clearAudio = () => {},
}: AudioSubliminalSectionProps) => {
  return (
    <Card className="p-6 quantum-card">
      <h3 className="text-xl font-semibold mb-4">Audio Subliminal (opcional)</h3>
      <AudioSubliminalControls
        audioFile={audioFile}
        setAudioFile={setAudioFile}
        audioVolume={audioVolume}
        setAudioVolume={setAudioVolume}
        isPlaying={audioSubliminalPlaying}
        playAudio={playSubliminalAudio}
        stopAudio={stopSubliminalAudio}
        isDisabled={isPlaying}
        audioLoop={audioLoop}
        setAudioLoop={setAudioLoop}
        clearAudio={clearAudio}
      />
    </Card>
  );
};

export default AudioSubliminalSection;
