
import { useState, useRef, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";

export const useManifestSubliminal = () => {
  // Audio uploader state y control manual
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioVolume, setAudioVolume] = useState(20);
  const [audioSubliminalPlaying, setAudioSubliminalPlaying] = useState(false);
  const [audioLoop, setAudioLoop] = useState(true); // Estado del loop
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Función para reproducir audio subliminal
  const playSubliminalAudio = () => {
    if (audioFile && !audioSubliminalPlaying) {
      try {
        // Si ya existe un elemento de audio previo, detenlo primero
        if (audioElementRef.current) {
          audioElementRef.current.pause();
        }
        
        const elem = new Audio(URL.createObjectURL(audioFile));
        elem.volume = audioVolume / 20;
        elem.loop = audioLoop;
        
        // Asignar primero la referencia para tener acceso inmediato
        audioElementRef.current = elem;
        
        // Intentar reproducir el audio - usar evento para validar que realmente está sonando
        elem.onplaying = () => {
          console.log("Audio realmente está reproduciendo");
          setAudioSubliminalPlaying(true);
        };
        
        // Intentar reproducir el audio
        elem.play()
          .then(() => {
            console.log("Audio subliminal reproduciendo correctamente");
            // El estado se actualizará desde el evento onplaying
          })
          .catch((err) => {
            console.error("Error al reproducir audio subliminal:", err);
            setAudioSubliminalPlaying(false);
          });
      } catch (error) {
        console.error("Error al crear el objeto de audio:", error);
        setAudioSubliminalPlaying(false);
        audioElementRef.current = null;
      }
    } else {
      console.log("No hay archivo de audio para reproducir o ya está reproduciendo");
    }
  };

  // Función para detener audio subliminal
  const stopSubliminalAudio = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      // No eliminamos la referencia para poder reanudar la reproducción
      setAudioSubliminalPlaying(false);
      console.log("Audio subliminal detenido");
    }
  };

  // Función para eliminar el audio
  const clearAudio = () => {
    stopSubliminalAudio();
    setAudioFile(null);
    audioElementRef.current = null;
    setAudioSubliminalPlaying(false);
    toast({
      title: "Audio eliminado",
      description: "El archivo de audio subliminal ha sido eliminado",
    });
  };

  // Volumen en caliente sobre elemento activo
  useEffect(() => {
    if (audioElementRef.current) {
      audioElementRef.current.volume = audioVolume / 20;
    }
  }, [audioVolume]);

  // Update loop property en caliente
  useEffect(() => {
    if (audioElementRef.current) {
      audioElementRef.current.loop = audioLoop;
    }
  }, [audioLoop]);

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      stopSubliminalAudio();
      audioElementRef.current = null;
    };
  }, []);

  return {
    audioFile,
    setAudioFile,
    audioVolume,
    setAudioVolume,
    audioSubliminalPlaying,
    audioLoop,
    setAudioLoop,
    playSubliminalAudio,
    stopSubliminalAudio,
    clearAudio,
    audioElementRef,
  };
};
