
import React from "react";
import { Play, CircleStop } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface AudioPlaybackControlsProps {
  audioFile: File | null;
  isPlaying: boolean;
  isDisabled: boolean;
  audioVolume: number;
  maxVolume: number;
  playAudio: () => void;
  stopAudio: () => void;
  setAudioVolume: (vol: number) => void;
}

const AudioPlaybackControls: React.FC<AudioPlaybackControlsProps> = ({
  audioFile,
  isPlaying,
  isDisabled,
  audioVolume,
  maxVolume,
  playAudio,
  stopAudio,
  setAudioVolume,
}) => {
  if (!audioFile) return null;

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={isPlaying ? stopAudio : playAudio}
        disabled={isDisabled}
        className="p-2 rounded-xl border border-zinc-200 bg-white shadow hover:bg-zinc-100 focus:outline focus:ring-2 focus:ring-quantum-primary"
        aria-label={isPlaying ? "Detener audio" : "Reproducir audio"}
      >
        {isPlaying ? (
          <CircleStop className="w-5 h-5 text-red-500" />
        ) : (
          <Play className="w-5 h-5 text-green-600" />
        )}
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
  );
};

export default AudioPlaybackControls;
