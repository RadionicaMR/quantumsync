
import React, { useRef, useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Volume2, VolumeOff, FileAudio } from "lucide-react";

interface AudioUploaderProps {
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  audioVolume: number;
  setAudioVolume: (vol: number) => void;
  isDisabled?: boolean;
  label?: string;
  maxVolume?: number;
}

const AudioUploader: React.FC<AudioUploaderProps> = ({
  audioFile,
  setAudioFile,
  audioVolume,
  setAudioVolume,
  isDisabled = false,
  label = "Sube un audio subliminal (mp3)",
  maxVolume = 20,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  // Convert custom 0-20 to 0-1 (for HTMLAudio volume property)
  const normalizedVolume = Math.max(0, Math.min(1, audioVolume / maxVolume));

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = normalizedVolume;
    }
  }, [audioVolume, normalizedVolume, audioFile]);

  // Loop the audio when done
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = true;
    }
  }, [audioFile]);

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setAudioFile(null);
  };

  return (
    <div className="space-y-2">
      <Label className="mb-1 block">{label}</Label>
      <div className="flex items-center gap-3">
        <input
          type="file"
          accept=".mp3,audio/mp3"
          onChange={handleAudioChange}
          disabled={isDisabled}
          className="block file:px-3 file:py-2 file:rounded file:bg-quantum-primary file:text-white file:mr-3"
        />
        {audioFile && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={isDisabled}
            className="text-xs text-red-500 underline"
          >
            Quitar
          </button>
        )}
      </div>
      {audioFile && (
        <div className="flex items-center gap-3">
          <FileAudio className="w-5 h-5 text-quantum-primary" />
          <audio
            ref={audioRef}
            src={URL.createObjectURL(audioFile)}
            autoPlay
            controls={false}
            loop
            style={{ display: "none" }}
          />
          <VolumeOff className="w-4 h-4 mr-1" />
          <Slider
            min={0}
            max={maxVolume}
            value={[audioVolume]}
            onValueChange={vals => setAudioVolume(vals[0])}
            className="w-32"
            disabled={isDisabled}
          />
          <Volume2 className="w-4 h-4 ml-1" />
          <span className="text-xs ml-2">Vol: {audioVolume}</span>
        </div>
      )}
    </div>
  );
};

export default AudioUploader;
