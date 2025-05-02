
import React from "react";

interface AudioPreviewProps {
  audioURL: string | null;
}

const AudioPreview: React.FC<AudioPreviewProps> = ({ audioURL }) => {
  if (!audioURL) return null;

  // Eliminamos el control de audio que se mostraba aquí
  // ya que crea confusión con los controles principales
  return (
    <div className="flex gap-2 items-center my-1">
      <span className="text-xs text-green-600">Audio grabado correctamente</span>
    </div>
  );
};

export default AudioPreview;
