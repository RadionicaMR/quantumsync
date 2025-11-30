
import { useState, useRef, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

export const useTreatmentSubliminal = () => {
  // Audio file upload state
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioVolume, setAudioVolume] = useState(10);
  const [audioLoop, setAudioLoop] = useState(true);
  const [audioSubliminalPlaying, setAudioSubliminalPlaying] = useState(false);
  const [backgroundModeActive, setBackgroundModeActive] = useState(false);
  
  // References
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const audioSourceRef = useRef<string | null>(null);

  // Handle document visibility changes for subliminal audio
  // Audio continues playing in background
  const handleVisibilityChange = () => {
    if (document.hidden && audioSubliminalPlaying) {
      console.log("App went to background - subliminal audio continues playing (treatment)");
      setBackgroundModeActive(true);
    } else if (!document.hidden && backgroundModeActive) {
      console.log("App returned to foreground");
      setBackgroundModeActive(false);
    }
  };

  // Function to play subliminal audio
  const playSubliminalAudio = () => {
    if (audioFile && !audioSubliminalPlaying) {
      console.log("Iniciando reproducción de audio subliminal (tratamiento):", {
        name: audioFile.name,
        type: audioFile.type,
        size: audioFile.size,
        volume: audioVolume / 20,
        loop: audioLoop
      });
      
      try {
        // If there's a previous audio element, stop it first
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
        
        const newAudio = new Audio(audioURL);
        newAudio.loop = audioLoop;
        newAudio.volume = audioVolume / 20;
        
        // Add error handler
        newAudio.onerror = (e) => {
          console.error("Error en elemento de audio:", e);
          setAudioSubliminalPlaying(false);
        };
        
        // Add ended handler (for non-loop scenarios)
        newAudio.onended = () => {
          if (!newAudio.loop) {
            console.log("Audio subliminal terminó");
            setAudioSubliminalPlaying(false);
          }
        };
        
        // Assign reference first for immediate access
        audioElementRef.current = newAudio;
        
        // Try to play the audio
        newAudio.play()
          .then(() => {
            setAudioSubliminalPlaying(true);
            console.log("✅ Audio subliminal reproduciendo correctamente (tratamiento)");
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
        console.error("❌ Error al crear objeto de audio:", error);
        setAudioSubliminalPlaying(false);
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

  // Function to stop subliminal audio
  const stopSubliminalAudio = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      setAudioSubliminalPlaying(false);
      setBackgroundModeActive(false);
      console.log("Subliminal audio stopped");
    }
  };

  // Function to remove audio
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

  // Update loop property on the fly
  useEffect(() => {
    if (audioElementRef.current) {
      audioElementRef.current.loop = audioLoop;
    }
  }, [audioLoop]);

  // Update subliminal audio volume when volume changes
  useEffect(() => {
    if (audioElementRef.current) {
      audioElementRef.current.volume = audioVolume / 20;
    }
  }, [audioVolume]);

  // Add listener for visibilitychange
  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup on unmount
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current = null;
      }
      audioSourceRef.current = null;
    };
  }, [audioSubliminalPlaying, backgroundModeActive]);

  return {
    audioFile,
    setAudioFile,
    audioVolume,
    setAudioVolume,
    audioSubliminalPlaying,
    playSubliminalAudio,
    stopSubliminalAudio,
    audioLoop,
    setAudioLoop,
    clearAudio,
    backgroundModeActive,
  };
};
