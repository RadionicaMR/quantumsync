
import React, { useRef, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Play, CircleStop, FilePlus, Mic, Stop, Trash2 } from "lucide-react";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";

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
    setAudioFile(null);
    clearRecording();
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
        {/* File uploader */}
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

        {/* GRABAR AUDIO */}
        {!isRecording && (
          <button
            type="button"
            onClick={startRecording}
            disabled={isDisabled || isPlaying}
            className="flex items-center gap-1 px-3 py-2 rounded bg-green-600 text-white hover:bg-green-700 focus:outline focus:ring-2 focus:ring-green-600"
          >
            <Mic className="w-4 h-4" />
            Grabar audio
          </button>
        )}
        {isRecording && (
          <button
            type="button"
            onClick={stopRecording}
            disabled={isDisabled}
            className="flex items-center gap-1 px-3 py-2 rounded bg-red-600 text-white animate-pulse"
          >
            <Stop className="w-4 h-4" />
            Detener ({isRecording ? "Grabando..." : ""})
          </button>
        )}

        {audioFile && (
          <>
            <button
              onClick={handleRemove}
              disabled={isDisabled || isPlaying || isRecording}
              className="text-xs text-red-500 underline"
              type="button"
            >
              Quitar
            </button>
            <span className="text-xs text-zinc-600 max-w-xs overflow-hidden truncate">{audioFile.name}</span>
          </>
        )}
      </div>

      {/* Vista previa del audio grabado */}
      {audioURL && (
        <div className="flex gap-2 items-center my-1">
          <audio src={audioURL} controls className="h-5" />
          {!isRecording && (
            <button
              type="button"
              onClick={clearRecording}
              className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-100 text-zinc-700 hover:bg-zinc-200 text-xs"
              disabled={isDisabled || isPlaying}
            >
              <Trash2 className="w-4 h-4" />
              Borrar grabación
            </button>
          )}
        </div>
      )}

      {audioFile && (
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
      )}

      <p className="text-xs text-muted-foreground">
        Puedes seleccionar o grabar un audio de hasta 1 minuto. Deja el volumen en 0 para que funcione como audio subliminal.
      </p>
    </div>
  );
};

export default AudioSubliminalControls;
