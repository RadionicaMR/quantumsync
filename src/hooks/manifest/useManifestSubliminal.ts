import { useState, useRef, useEffect, useCallback } from 'react';
import { toast } from "@/components/ui/use-toast";

export const useManifestSubliminal = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioVolume, setAudioVolume] = useState(20);
  const [audioSubliminalPlaying, setAudioSubliminalPlaying] = useState(false);
  const [audioLoop, setAudioLoop] = useState(true);
  const [backgroundModeActive, setBackgroundModeActive] = useState(false);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const audioSourceRef = useRef<string | null>(null);
  const isPlayingRef = useRef(false);
  const bgActiveRef = useRef(false);

  // Keep refs in sync
  useEffect(() => { isPlayingRef.current = audioSubliminalPlaying; }, [audioSubliminalPlaying]);
  useEffect(() => { bgActiveRef.current = backgroundModeActive; }, [backgroundModeActive]);

  // Stable visibility handler using refs - no stale closures
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden && isPlayingRef.current) {
      setBackgroundModeActive(true);
    } else if (!document.hidden && bgActiveRef.current) {
      setBackgroundModeActive(false);
    }
  }, []);

  // CRITICAL: Safari requires Audio element to be created and play() called in user gesture
  const playSubliminalAudio = useCallback(() => {
    if (audioFile && !audioSubliminalPlaying) {
      try {
        if (audioElementRef.current) {
          audioElementRef.current.pause();
          audioElementRef.current = null;
        }
        
        if (audioSourceRef.current) {
          URL.revokeObjectURL(audioSourceRef.current);
        }
        
        const audioURL = URL.createObjectURL(audioFile);
        audioSourceRef.current = audioURL;
        
        // CRITICAL: Create and unlock Audio in user gesture for Safari
        const elem = new Audio();
        elem.play().catch(() => {}); // Unlock for iOS Safari
        
        elem.src = audioURL;
        elem.volume = audioVolume / 20;
        elem.loop = audioLoop;
        elem.preload = 'auto';
        
        elem.onerror = () => {
          setAudioSubliminalPlaying(false);
        };
        
        elem.onended = () => {
          if (!elem.loop) {
            setAudioSubliminalPlaying(false);
          }
        };
        
        audioElementRef.current = elem;
        
        // Play after setting src - works because element was unlocked above
        elem.play()
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
        console.error("Error al crear el objeto de audio:", error);
        setAudioSubliminalPlaying(false);
        audioElementRef.current = null;
        toast({
          title: "Error",
          description: "No se pudo cargar el archivo de audio",
          variant: "destructive"
        });
      }
    }
  }, [audioFile, audioSubliminalPlaying, audioVolume, audioLoop]);

  const stopSubliminalAudio = useCallback(() => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      setAudioSubliminalPlaying(false);
      setBackgroundModeActive(false);
    }
  }, []);

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

  // Volume update
  useEffect(() => {
    if (audioElementRef.current) {
      audioElementRef.current.volume = audioVolume / 20;
    }
  }, [audioVolume]);

  // Loop update
  useEffect(() => {
    if (audioElementRef.current) {
      audioElementRef.current.loop = audioLoop;
    }
  }, [audioLoop]);

  // Single stable visibility listener - never recreated
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
    audioLoop,
    setAudioLoop,
    playSubliminalAudio,
    stopSubliminalAudio,
    clearAudio,
    audioElementRef,
    backgroundModeActive
  };
};
