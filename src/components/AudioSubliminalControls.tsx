
import React, { useRef, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import AudioFileSelector from "./audio/AudioFileSelector";
import AudioRecorderButton from "./audio/AudioRecorderButton";
import AudioFileInfo from "./audio/AudioFileInfo";
import AudioPlaybackControls from "./audio/AudioPlaybackControls";
import AudioPreview from "./audio/AudioPreview";

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
  audioLoop?: boolean;
  setAudioLoop?: (loop: boolean) => void;
  clearAudio?: () => void;
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
  audioLoop = true,
  setAudioLoop = () => {},
  clearAudio = () => {},
}) => {
  // Estado local para reproducción de prueba
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const previewAudioSourceRef = useRef<string | null>(null);

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
      // Determinar el nombre y extensión correcta según el tipo MIME
      let fileName = "grabacion-subliminal.webm";
      let fileType = "audio/webm";
      
      if (audioBlob.type) {
        fileType = audioBlob.type;
        if (audioBlob.type.includes('mp4')) {
          fileName = "grabacion-subliminal.mp4";
        } else if (audioBlob.type.includes('ogg')) {
          fileName = "grabacion-subliminal.ogg";
        }
      }
      
      const file = new File([audioBlob], fileName, { type: fileType });
      console.log("Audio convertido a archivo:", {
        name: file.name,
        type: file.type,
        size: file.size
      });
      setAudioFile(file);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioBlob]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      console.log("Archivo de audio seleccionado:", {
        name: file.name,
        type: file.type,
        size: file.size
      });
      setAudioFile(file);
    }
  };

  // Función para reproducir audio de prueba
  const playPreviewAudio = () => {
    if (!audioFile || isPreviewPlaying) return;

    try {
      // Detener audio previo si existe
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current = null;
      }

      // Limpiar URL previa
      if (previewAudioSourceRef.current) {
        URL.revokeObjectURL(previewAudioSourceRef.current);
      }

      const audioURL = URL.createObjectURL(audioFile);
      previewAudioSourceRef.current = audioURL;

      const audio = new Audio(audioURL);
      audio.volume = audioVolume / maxVolume;
      audio.loop = false; // No hacer loop en preview

      audio.onended = () => {
        setIsPreviewPlaying(false);
      };

      audio.onerror = () => {
        console.error("Error al reproducir preview de audio");
        setIsPreviewPlaying(false);
      };

      previewAudioRef.current = audio;

      audio.play()
        .then(() => {
          setIsPreviewPlaying(true);
          console.log("Preview de audio reproduciendo");
        })
        .catch((err) => {
          console.error("Error al iniciar preview:", err);
          setIsPreviewPlaying(false);
        });
    } catch (error) {
      console.error("Error al crear preview de audio:", error);
      setIsPreviewPlaying(false);
    }
  };

  // Función para detener audio de prueba
  const stopPreviewAudio = () => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      setIsPreviewPlaying(false);
    }
  };

  const handleRemove = () => {
    stopPreviewAudio(); // Detener preview si está reproduciendo
    clearAudio();
    clearRecording();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Actualizar volumen del preview cuando cambia
  useEffect(() => {
    if (previewAudioRef.current) {
      previewAudioRef.current.volume = audioVolume / maxVolume;
    }
  }, [audioVolume, maxVolume]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current = null;
      }
      if (previewAudioSourceRef.current) {
        URL.revokeObjectURL(previewAudioSourceRef.current);
        previewAudioSourceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="space-y-2 border border-zinc-200 p-3 rounded-xl mt-2 bg-muted/20">
      <Label className="mb-1 block font-semibold">Audio Subliminal (opcional)</Label>

      <div className="flex gap-3 items-center flex-wrap">
        <AudioFileSelector
          isDisabled={isDisabled}
          isPlaying={isPlaying}
          isRecording={isRecording}
          handleFileChange={handleFileChange}
        />

        <AudioRecorderButton
          isRecording={isRecording}
          isDisabled={isDisabled}
          isPlaying={isPlaying}
          startRecording={startRecording}
          stopRecording={stopRecording}
        />

        <AudioFileInfo
          audioFile={audioFile}
          isDisabled={isDisabled}
          isPlaying={isPlaying}
          isRecording={isRecording}
          audioLoop={audioLoop}
          handleRemove={handleRemove}
          setAudioLoop={setAudioLoop}
        />
      </div>

      <AudioPreview audioURL={audioURL} />

      <AudioPlaybackControls
        audioFile={audioFile}
        isPlaying={isPreviewPlaying}
        isDisabled={isDisabled || isPlaying}
        audioVolume={audioVolume}
        maxVolume={maxVolume}
        playAudio={playPreviewAudio}
        stopAudio={stopPreviewAudio}
        setAudioVolume={setAudioVolume}
      />

      <p className="text-xs text-muted-foreground">
        Puedes seleccionar o grabar un audio de hasta 1 minuto. Deja el volumen en 0 para que funcione como audio subliminal.
      </p>
    </div>
  );
};

export default AudioSubliminalControls;
