
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
  isPlaying?: boolean;
  audioLoop?: boolean;
  setAudioLoop?: (loop: boolean) => void;
  clearAudio?: () => void;
  isDisabled?: boolean;
}

const AudioSubliminalSection = ({
  audioFile,
  setAudioFile,
  audioVolume,
  setAudioVolume,
  audioSubliminalPlaying,
  playSubliminalAudio,
  stopSubliminalAudio,
  isPlaying = false,
  audioLoop = true,
  setAudioLoop = () => {},
  clearAudio = () => {},
  isDisabled = false,
}: AudioSubliminalSectionProps) => {
  // Combine isPlaying and isDisabled
  const disabled = isDisabled || (isPlaying && !audioSubliminalPlaying);
  
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
        isDisabled={disabled}
        audioLoop={audioLoop}
        setAudioLoop={setAudioLoop}
        clearAudio={clearAudio}
      />
    </Card>
  );
};

export default AudioSubliminalSection;
