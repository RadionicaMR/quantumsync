
import React, { useRef } from "react";
import { FilePlus } from "lucide-react";

interface AudioFileSelectorProps {
  isDisabled: boolean;
  isPlaying: boolean;
  isRecording: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AudioFileSelector: React.FC<AudioFileSelectorProps> = ({
  isDisabled,
  isPlaying,
  isRecording,
  handleFileChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    if (!isDisabled && !isPlaying) {
      fileInputRef.current?.click();
    }
  };

  return (
    <>
      <input
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        disabled={isDisabled || isPlaying || isRecording}
        ref={fileInputRef}
        className="hidden"
      />
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={isDisabled || isPlaying || isRecording}
        className="flex items-center gap-1 px-3 py-2 rounded bg-quantum-primary text-white hover:bg-quantum-primary/90 focus:outline focus:ring-2 focus:ring-quantum-primary"
      >
        <FilePlus className="w-4 h-4" />
        Seleccionar archivo
      </button>
    </>
  );
};

export default AudioFileSelector;
