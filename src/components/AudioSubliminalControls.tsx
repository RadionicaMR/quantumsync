
import React, { useRef, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import AudioFileSelector from "./audio/AudioFileSelector";
import AudioRecorderButton from "./audio/AudioRecorderButton";
import AudioFileInfo from "./audio/AudioFileInfo";
import AudioPlaybackControls from "./audio/AudioPlaybackControls";
import AudioPreview from "./audio/AudioPreview";

interface AudioSubliminalControlsProps {
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  audioVolume: number;
  setAudioVolume: (vol: number) => void;
  isPlaying: boolean;
  playAudio: () => void;
  stopAudio: () => void;
  isDisabled?: boolean;
  maxVolume?: number;
  audioLoop?: boolean;
  setAudioLoop?: (loop: boolean) => void;
  clearAudio?: () => void;
}

const AudioSubliminalControls: React.FC<AudioSubliminalControlsProps> = ({
  audioFile,
  setAudioFile,
  audioVolume,
  setAudioVolume,
  isPlaying,
  playAudio,
  stopAudio,
  isDisabled = false,
  maxVolume = 20,
  audioLoop = true,
  setAudioLoop = () => {},
  clearAudio = () => {},
}) => {
  // Grabadora
  const {
    isRecording,
    audioURL,
    audioBlob,
    startRecording,
    stopRecording,
    clearRecording,
  } = useAudioRecorder(60);

  // Si audio grabado listo, convertir a archivo para usar el mismo flujo de audioFile
  useEffect(() => {
    if (audioBlob) {
      const file = new File([audioBlob], "grabacion-subliminal.webm", { type: "audio/webm" });
      setAudioFile(file);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioBlob]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    clearAudio();
    clearRecording();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="space-y-2 border border-zinc-200 p-3 rounded-xl mt-2 bg-muted/20">
      <Label className="mb-1 block font-semibold">Audio Subliminal (opcional)</Label>

      <div className="flex gap-3 items-center flex-wrap">
        <AudioFileSelector
          isDisabled={isDisabled}
          isPlaying={isPlaying}
          isRecording={isRecording}
          handleFileChange={handleFileChange}
        />

        <AudioRecorderButton
          isRecording={isRecording}
          isDisabled={isDisabled}
          isPlaying={isPlaying}
          startRecording={startRecording}
          stopRecording={stopRecording}
        />

        <AudioFileInfo
          audioFile={audioFile}
          isDisabled={isDisabled}
          isPlaying={isPlaying}
          isRecording={isRecording}
          audioLoop={audioLoop}
          handleRemove={handleRemove}
          setAudioLoop={setAudioLoop}
        />
      </div>

      <AudioPreview audioURL={audioURL} />

      <AudioPlaybackControls
        audioFile={audioFile}
        isPlaying={isPlaying}
        isDisabled={isDisabled}
        audioVolume={audioVolume}
        maxVolume={maxVolume}
        playAudio={playAudio}
        stopAudio={stopAudio}
        setAudioVolume={setAudioVolume}
      />

      <p className="text-xs text-muted-foreground">
        Puedes seleccionar o grabar un audio de hasta 1 minuto. Deja el volumen en 0 para que funcione como audio subliminal.
      </p>
    </div>
  );
};

export default AudioSubliminalControls;
