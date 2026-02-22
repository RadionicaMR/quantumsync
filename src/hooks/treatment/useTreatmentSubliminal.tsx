import { useState, useRef, useEffect, useCallback } from 'react';
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
  const isPlayingRef = useRef(false);
  const bgActiveRef = useRef(false);

  // Keep refs in sync
  useEffect(() => { isPlayingRef.current = audioSubliminalPlaying; }, [audioSubliminalPlaying]);
  useEffect(() => { bgActiveRef.current = backgroundModeActive; }, [backgroundModeActive]);

  // Stable visibility handler
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden && isPlayingRef.current) {
      setBackgroundModeActive(true);
    } else if (!document.hidden && bgActiveRef.current) {
      setBackgroundModeActive(false);
    }
  }, []);

  // Function to play subliminal audio - CRITICAL: must be called in user gesture for Safari
  const playSubliminalAudio = useCallback(() => {
    if (audioFile && !audioSubliminalPlaying) {
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
        
        // CRITICAL: Create Audio element synchronously in user gesture for Safari
        const newAudio = new Audio();
        // Safari unlock: initiate play immediately to unlock the element
        newAudio.play().catch(() => {}); // This unlocks the audio element on iOS Safari
        
        newAudio.src = audioURL;
        newAudio.loop = audioLoop;
        newAudio.volume = audioVolume / 20;
        newAudio.preload = 'auto';
        
        // Add error handler
        newAudio.onerror = (e) => {
          console.error("Error en elemento de audio:", e);
          setAudioSubliminalPlaying(false);
        };
        
        // Add ended handler (for non-loop scenarios)
        newAudio.onended = () => {
          if (!newAudio.loop) {
            setAudioSubliminalPlaying(false);
          }
        };
        
        // Assign reference
        audioElementRef.current = newAudio;
        
        // Play after setting src - works because element was unlocked above
        newAudio.play()
          .then(() => {
            setAudioSubliminalPlaying(true);
          })
          .catch((err) => {
            console.error("Error al reproducir audio subliminal:", err);
            setAudioSubliminalPlaying(false);
            toast({
              title: "Error al reproducir audio",
              description: "No se pudo reproducir el audio. Verifica el formato del archivo.",
              variant: "destructive"
            });
          });
      } catch (error) {
        console.error("Error al crear objeto de audio:", error);
        setAudioSubliminalPlaying(false);
        toast({
          title: "Error",
          description: "No se pudo cargar el archivo de audio",
          variant: "destructive"
        });
      }
    }
  }, [audioFile, audioSubliminalPlaying, audioLoop, audioVolume]);

  // Function to stop subliminal audio
  const stopSubliminalAudio = useCallback(() => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      setAudioSubliminalPlaying(false);
      setBackgroundModeActive(false);
    }
  }, []);

  // Function to remove audio
  const clearAudio = useCallback(() => {
    stopSubliminalAudio();
    setAudioFile(null);
    if (audioSourceRef.current) {
      URL.revokeObjectURL(audioSourceRef.current);
      audioSourceRef.current = null;
    }
    audioElementRef.current = null;
    setAudioSubliminalPlaying(false);
    setBackgroundModeActive(false);
    toast({
      title: "Audio eliminado",
      description: "El archivo de audio subliminal ha sido eliminado",
    });
  }, [stopSubliminalAudio]);

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

  // Single stable visibility listener
  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current = null;
      }
      if (audioSourceRef.current) {
        URL.revokeObjectURL(audioSourceRef.current);
        audioSourceRef.current = null;
      }
    };
  }, [handleVisibilityChange]);

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
