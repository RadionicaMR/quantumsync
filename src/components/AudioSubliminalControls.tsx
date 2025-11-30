
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

  const {
    isRecording,
    audioURL,
    audioBlob,
    startRecording,
    stopRecording,
    clearRecording,
  } = useAudioRecorder(180); // 3 minutos máximo para grabación

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("Archivo de audio seleccionado:", {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Validar tipo de archivo
    const validTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/webm', 'audio/ogg', 'audio/m4a', 'audio/aac'];
    const hasValidType = validTypes.includes(file.type) || file.name.match(/\.(mp3|wav|webm|ogg|m4a|aac)$/i);
    
    if (!hasValidType) {
      console.error("Tipo de archivo no válido:", file.type);
      return;
    }

    // Validar tamaño (máximo 50MB para permitir audios largos)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      console.error("Archivo demasiado grande:", file.size);
      return;
    }

    // Validar duración del audio
    const audio = document.createElement('audio');
    audio.preload = 'metadata';
    
    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(audio.src);
      const duration = audio.duration;
      
      console.log("Duración del audio:", duration, "segundos");
      
      // Máximo 10 minutos (600 segundos)
      if (duration > 600) {
        console.error("Audio demasiado largo:", duration);
        return;
      }

      setAudioFile(file);
      console.log("Audio cargado correctamente");
    };

    audio.onerror = () => {
      URL.revokeObjectURL(audio.src);
      console.error("Error al leer archivo de audio");
      // Intentar cargar de todas formas
      setAudioFile(file);
    };

    audio.src = URL.createObjectURL(file);
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
        Puedes seleccionar un audio de hasta 10 minutos o grabar hasta 3 minutos. Deja el volumen en 0 para que funcione como audio subliminal.
      </p>
    </div>
  );
};

export default AudioSubliminalControls;
