
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
  const handleVisibilityChange = () => {
    if (document.hidden && audioSubliminalPlaying) {
      console.log("App pasó a segundo plano con audio subliminal en reproducción");
      setBackgroundModeActive(true);
      
      // Guardar la posición actual del audio
      if (audioElementRef.current) {
        const currentTime = audioElementRef.current.currentTime;
        audioElementRef.current.pause();
        audioElementRef.current.currentTime = currentTime;
      }
    } else if (!document.hidden && backgroundModeActive && audioSourceRef.current) {
      console.log("App volvió al primer plano, restaurando audio subliminal");
      
      // Si estaba reproduciendo, restaurar la reproducción
      if (audioSubliminalPlaying) {
        if (audioElementRef.current) {
          const currentTime = audioElementRef.current.currentTime;
          
          // Intentar reanudar la reproducción desde donde se quedó
          audioElementRef.current.play()
            .then(() => {
              console.log("Audio subliminal reanudado con éxito");
              setBackgroundModeActive(false);
            })
            .catch((err) => {
              console.error("Error al reanudar audio subliminal:", err);
              // Intentar crear un nuevo elemento de audio
              if (audioFile) {
                recreateAudioElement();
              }
            });
        } else if (audioFile) {
          // Si el elemento de audio se perdió, recrearlo
          recreateAudioElement();
        }
      }
    }
  };

  const recreateAudioElement = () => {
    try {
      if (!audioFile) return;
      
      const newAudio = new Audio(URL.createObjectURL(audioFile));
      newAudio.loop = audioLoop;
      newAudio.volume = audioVolume / 20;
      
      // Asignar la nueva referencia
      audioElementRef.current = newAudio;
      
      // Intentar reproducir
      newAudio.play()
        .then(() => {
          console.log("Audio subliminal recreado y reproduciendo");
          setAudioSubliminalPlaying(true);
          setBackgroundModeActive(false);
        })
        .catch((err) => {
          console.error("Error al reproducir audio subliminal recreado:", err);
          setAudioSubliminalPlaying(false);
        });
    } catch (error) {
      console.error("Error al recrear el elemento de audio:", error);
    }
  };

  // Función para reproducir audio subliminal
  const playSubliminalAudio = () => {
    if (audioFile && !audioSubliminalPlaying) {
      try {
        // Si ya existe un elemento de audio previo, detenlo primero
        if (audioElementRef.current) {
          audioElementRef.current.pause();
        }
        
        const audioURL = URL.createObjectURL(audioFile);
        audioSourceRef.current = audioURL;
        
        const elem = new Audio(audioURL);
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
