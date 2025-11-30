
import React from "react";
import { Trash2, Repeat } from "lucide-react";

interface AudioFileInfoProps {
  audioFile: File | null;
  isDisabled: boolean;
  isPlaying: boolean;
  isRecording: boolean;
  audioLoop: boolean;
  handleRemove: () => void;
  setAudioLoop: (loop: boolean) => void;
}

const AudioFileInfo: React.FC<AudioFileInfoProps> = ({
  audioFile,
  isDisabled,
  isPlaying,
  isRecording,
  audioLoop,
  handleRemove,
  setAudioLoop,
}) => {
  if (!audioFile) return null;

  return (
    <>
      <button
        onClick={handleRemove}
        disabled={isDisabled || isRecording}
        className="flex items-center gap-1 px-2 py-1 rounded text-red-500 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
        type="button"
      >
        <Trash2 className="w-4 h-4" />
        Quitar
      </button>
      <span className="text-xs text-zinc-600 max-w-xs overflow-hidden truncate">
        {audioFile.name}
      </span>
      <button
        type="button"
        className="ml-2 p-1 border rounded-xl text-xs bg-white hover:bg-zinc-100 flex items-center gap-1"
        onClick={() => setAudioLoop(!audioLoop)}
        disabled={isDisabled}
        title={audioLoop ? "Click para desactivar repetición" : "Click para activar repetición"}
      >
        <Repeat className={`w-4 h-4 transition-colors ${audioLoop ? "text-quantum-primary" : "text-zinc-400"}`} />
        {audioLoop ? "Loop activado" : "Sin loop"}
      </button>
    </>
  );
};

export default AudioFileInfo;
