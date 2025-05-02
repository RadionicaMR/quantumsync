
import React from "react";

interface AudioPreviewProps {
  audioURL: string | null;
}

const AudioPreview: React.FC<AudioPreviewProps> = ({ audioURL }) => {
  if (!audioURL) return null;

  return (
    <div className="flex gap-2 items-center my-1">
      <audio src={audioURL} controls className="h-5" />
    </div>
  );
};

export default AudioPreview;
