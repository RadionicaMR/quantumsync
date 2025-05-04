
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
  const handleVisibilityChange = () => {
    if (document.hidden && audioSubliminalPlaying) {
      console.log("App went to background with subliminal audio playing (treatment)");
      setBackgroundModeActive(true);
      
      // Save current audio position
      if (audioElementRef.current) {
        const currentTime = audioElementRef.current.currentTime;
        audioElementRef.current.pause();
        audioElementRef.current.currentTime = currentTime;
      }
    } else if (!document.hidden && backgroundModeActive && audioSourceRef.current) {
      console.log("App returned to foreground, restoring subliminal audio (treatment)");
      
      // If it was playing, restore playback
      if (audioSubliminalPlaying && audioElementRef.current) {
        audioElementRef.current.play()
          .then(() => {
            console.log("Subliminal audio successfully resumed (treatment)");
            setBackgroundModeActive(false);
          })
          .catch((err) => {
            console.error("Error resuming subliminal audio (treatment):", err);
            // Try to recreate audio element
            if (audioFile) {
              recreateAudioElement();
            }
          });
      }
    }
  };

  const recreateAudioElement = () => {
    try {
      if (!audioFile) return;
      
      const audioURL = URL.createObjectURL(audioFile);
      audioSourceRef.current = audioURL;
      
      const newAudio = new Audio(audioURL);
      newAudio.loop = audioLoop;
      newAudio.volume = audioVolume / 20;
      
      // Assign new reference
      audioElementRef.current = newAudio;
      
      // Try to play
      newAudio.play()
        .then(() => {
          console.log("Subliminal audio recreated and playing (treatment)");
          setAudioSubliminalPlaying(true);
          setBackgroundModeActive(false);
        })
        .catch((err) => {
          console.error("Error playing recreated subliminal audio (treatment):", err);
          setAudioSubliminalPlaying(false);
        });
    } catch (error) {
      console.error("Error recreating audio element (treatment):", error);
    }
  };

  // Function to play subliminal audio
  const playSubliminalAudio = () => {
    if (audioFile && !audioSubliminalPlaying) {
      try {
        // If there's a previous audio element, stop it first
        if (audioElementRef.current) {
          audioElementRef.current.pause();
        }
        
        const audioURL = URL.createObjectURL(audioFile);
        audioSourceRef.current = audioURL;
        
        const newAudio = new Audio(audioURL);
        newAudio.loop = audioLoop;
        newAudio.volume = audioVolume / 20;
        
        // Assign reference first for immediate access
        audioElementRef.current = newAudio;
        
        // Try to play the audio
        newAudio.play()
          .then(() => {
            setAudioSubliminalPlaying(true);
            console.log("Subliminal audio playing correctly");
          })
          .catch((err) => {
            console.error("Error playing subliminal audio:", err);
            setAudioSubliminalPlaying(false);
          });
      } catch (error) {
        console.error("Error creating audio object:", error);
        setAudioSubliminalPlaying(false);
      }
    } else {
      console.log("No audio file to play or already playing");
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
