
import React from "react";
import { Mic, CircleStop } from "lucide-react";

interface AudioRecorderButtonProps {
  isRecording: boolean;
  isDisabled: boolean;
  isPlaying: boolean;
  startRecording: () => void;
  stopRecording: () => void;
}

const AudioRecorderButton: React.FC<AudioRecorderButtonProps> = ({
  isRecording,
  isDisabled,
  isPlaying,
  startRecording,
  stopRecording,
}) => {
  if (isRecording) {
    return (
      <button
        type="button"
        onClick={stopRecording}
        disabled={isDisabled}
        className="flex items-center gap-1 px-3 py-2 rounded bg-red-600 text-white animate-pulse"
      >
        <CircleStop className="w-4 h-4" />
        Detener ({isRecording ? "Grabando..." : ""})
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={startRecording}
      disabled={isDisabled || isPlaying}
      className="flex items-center gap-1 px-3 py-2 rounded bg-green-600 text-white hover:bg-green-700 focus:outline focus:ring-2 focus:ring-green-600"
    >
      <Mic className="w-4 h-4" />
      Grabar audio
    </button>
  );
};

export default AudioRecorderButton;
