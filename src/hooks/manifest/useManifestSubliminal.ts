
import { useState, useRef, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";

export const useManifestSubliminal = () => {
  // Audio uploader state y control manual
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioVolume, setAudioVolume] = useState(20);
  const [audioSubliminalPlaying, setAudioSubliminalPlaying] = useState(false);
  const [audioLoop, setAudioLoop] = useState(true); // Estado del loop
  const [backgroundModeActive, setBackgroundModeActive] = useState(false);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const audioSourceRef = useRef<string | null>(null);

  // Manejar cambios de visibilidad del documento
  // Audio continúa reproduciéndose en segundo plano
  const handleVisibilityChange = () => {
    if (document.hidden && audioSubliminalPlaying) {
      console.log("App pasó a segundo plano - audio subliminal continúa reproduciéndose");
      setBackgroundModeActive(true);
    } else if (!document.hidden && backgroundModeActive) {
      console.log("App volvió al primer plano");
      setBackgroundModeActive(false);
    }
  };

  // Función para reproducir audio subliminal
  const playSubliminalAudio = () => {
    if (audioFile && !audioSubliminalPlaying) {
      console.log("Iniciando reproducción de audio subliminal (manifestación):", {
        name: audioFile.name,
        type: audioFile.type,
        size: audioFile.size,
        volume: audioVolume / 20,
        loop: audioLoop
      });
      
      try {
        // Si ya existe un elemento de audio previo, detenlo primero
        if (audioElementRef.current) {
          audioElementRef.current.pause();
          audioElementRef.current = null;
        }
        
        // Clean up previous object URL
        if (audioSourceRef.current) {
          URL.revokeObjectURL(audioSourceRef.current);
        }
        
        const audioURL = URL.createObjectURL(audioFile);
        audioSourceRef.current = audioURL;
        
        const elem = new Audio(audioURL);
        elem.volume = audioVolume / 20;
        elem.loop = audioLoop;
        
        // Add error handler
        elem.onerror = (e) => {
          console.error("Error en elemento de audio:", e);
          setAudioSubliminalPlaying(false);
        };
        
        // Add ended handler (for non-loop scenarios)
        elem.onended = () => {
          if (!elem.loop) {
            console.log("Audio subliminal terminó");
            setAudioSubliminalPlaying(false);
          }
        };
        
        // Asignar primero la referencia para tener acceso inmediato
        audioElementRef.current = elem;
        
        // Intentar reproducir el audio - usar evento para validar que realmente está sonando
        elem.onplaying = () => {
          console.log("✅ Audio subliminal reproduciendo correctamente (manifestación)");
          setAudioSubliminalPlaying(true);
        };
        
        // Intentar reproducir el audio
        elem.play()
          .then(() => {
            console.log("Solicitud de reproducción enviada");
          })
          .catch((err) => {
            console.error("❌ Error al reproducir audio subliminal:", err);
            setAudioSubliminalPlaying(false);
            toast({
              title: "Error al reproducir audio",
              description: "No se pudo reproducir el audio. Verifica el formato del archivo.",
              variant: "destructive"
            });
          });
      } catch (error) {
        console.error("❌ Error al crear el objeto de audio:", error);
        setAudioSubliminalPlaying(false);
        audioElementRef.current = null;
        toast({
          title: "Error",
          description: "No se pudo cargar el archivo de audio",
          variant: "destructive"
        });
      }
    } else if (audioSubliminalPlaying) {
      console.log("Audio subliminal ya está reproduciendo");
    } else {
      console.log("No hay archivo de audio para reproducir");
    }
  };

  // Función para detener audio subliminal
  const stopSubliminalAudio = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      // No eliminamos la referencia para poder reanudar la reproducción
      setAudioSubliminalPlaying(false);
      setBackgroundModeActive(false);
      console.log("Audio subliminal detenido");
    }
  };

  // Función para eliminar el audio
  const clearAudio = () => {
    stopSubliminalAudio();
    setAudioFile(null);
    audioElementRef.current = null;
    audioSourceRef.current = null;
    setAudioSubliminalPlaying(false);
    setBackgroundModeActive(false);
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

  // Agregar listener para visibilitychange
  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Limpieza al desmontar
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stopSubliminalAudio();
      audioElementRef.current = null;
      audioSourceRef.current = null;
    };
  }, [audioSubliminalPlaying, backgroundModeActive]);

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
    backgroundModeActive
  };
};
