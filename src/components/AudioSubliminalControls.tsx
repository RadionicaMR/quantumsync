
import React, { useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Play, CircleStop, FilePlus } from "lucide-react";

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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setAudioFile(null);
  };

  const handleButtonClick = () => {
    if (!isDisabled && !isPlaying) {
      fileInputRef.current?.click();
    }
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
          ref={fileInputRef}
          className="hidden"
        />
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={isDisabled || isPlaying}
          className="flex items-center gap-1 px-3 py-2 rounded bg-quantum-primary text-white hover:bg-quantum-primary/90 focus:outline focus:ring-2 focus:ring-quantum-primary"
        >
          <FilePlus className="w-4 h-4" />
          Seleccionar archivo
        </button>
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

