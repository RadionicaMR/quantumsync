
import React from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Play, CircleStop } from "lucide-react";

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
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setAudioFile(null);
  };

  return (
    <div className="space-y-2 border border-zinc-200 p-3 rounded-xl mt-2 bg-muted/20">
      <Label className="mb-1 block font-semibold">Audio Subliminal (opcional)</Label>
      <div className="flex gap-3 items-center flex-wrap">
        <input
          type="file"
          accept=".mp3,audio/mp3"
          onChange={handleFileChange}
          disabled={isDisabled || isPlaying}
          className="block file:px-3 file:py-2 file:rounded file:bg-quantum-primary file:text-white file:mr-3"
        />
        {audioFile && (
          <>
            <button
              onClick={handleRemove}
              disabled={isDisabled || isPlaying}
              className="text-xs text-red-500 underline"
              type="button"
            >
              Quitar
            </button>
            <span className="text-xs text-zinc-600">{audioFile.name}</span>
          </>
        )}
      </div>
      {audioFile && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={isPlaying ? stopAudio : playAudio}
            disabled={isDisabled}
            className="p-2 rounded-xl border border-zinc-200 bg-white shadow hover:bg-zinc-100 focus:outline focus:ring-2 focus:ring-quantum-primary"
            aria-label={isPlaying ? "Detener audio" : "Reproducir audio"}
          >
            {isPlaying ? <CircleStop className="w-5 h-5 text-red-500" /> : <Play className="w-5 h-5 text-green-600" />}
          </button>
          <Slider
            min={0}
            max={maxVolume}
            value={[audioVolume]}
            onValueChange={vals => setAudioVolume(vals[0])}
            className="w-32"
            disabled={isDisabled}
          />
          <span className="ml-2 text-xs">Volumen: {audioVolume}</span>
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        Puedes dejar el volumen en 0 (inaudible) para que funcione como audio subliminal.
      </p>
    </div>
  );
};

export default AudioSubliminalControls;

