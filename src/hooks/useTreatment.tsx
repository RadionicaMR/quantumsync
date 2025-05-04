
import { useState, useEffect, useRef } from 'react';
import { useTreatmentAudio } from './useTreatmentAudio';
import { useTreatmentImages } from './useTreatmentImages';
import { useTreatmentRates } from './useTreatmentRates';
import { toast } from '@/components/ui/use-toast';

// Define and export the TreatmentPreset type
export interface TreatmentPreset {
  id: string;
  name: string;
  frequency: number;
  description: string;
  duration: number;
}

// Main treatment hook that combines all the other hooks
export const useTreatment = () => {
  // State for the treatment
  const [selectedPreset, setSelectedPreset] = useState('');
  const [visualFeedback, setVisualFeedback] = useState(true);
  const [hypnoticEffect, setHypnoticEffect] = useState(false);
  const [receptorName, setReceptorName] = useState('');
  const [hypnoticSpeed, setHypnoticSpeed] = useState([10]);
  
  // Custom hooks
  const audio = useTreatmentAudio();
  const images = useTreatmentImages();
  const rates = useTreatmentRates();
  
  // Audio file upload state (renamed for clarity)
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioVolume, setAudioVolume] = useState(10);
  const [audioLoop, setAudioLoop] = useState(true);
  // Subliminal audio element reference
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const [audioSubliminalPlaying, setAudioSubliminalPlaying] = useState(false);
  const [backgroundModeActive, setBackgroundModeActive] = useState(false);
  const audioSourceRef = useRef<string | null>(null);

  // Select a preset
  const selectPreset = (preset: TreatmentPreset) => {
    console.log("Selecting preset:", preset.id, "with frequency:", preset.frequency, "Hz and duration:", preset.duration, "minutes");
    
    // Reset treatment state when changing presets
    if (audio.isPlaying) {
      console.log("Stopping previous treatment before changing preset");
      audio.stopAudio();
      setHypnoticEffect(false);
    }
    
    setSelectedPreset(preset.id);
    audio.setFrequency([preset.frequency]);
    audio.setDuration([preset.duration]);
  };

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

  // Start the treatment - With explicit audio initialization
  const startTreatment = () => {
    if (audio.isPlaying) {
      console.log("Treatment already playing, not starting again");
      return;
    }

    // Debug logging
    console.log("Starting treatment with frequency:", audio.frequency[0], "Hz");
    console.log("Configured duration:", audio.duration[0], "minutes");
    
    // First set the hypnotic effect (visual change)
    setHypnoticEffect(true);
    
    // Make sure the audio starts correctly
    audio.startAudio();
    
    // Only after starting the audio, we start the subliminal if it exists
    if (audioFile) {
      console.log("Starting subliminal audio associated with treatment");
      playSubliminalAudio();
    }

    // Show toast notification
    const target = receptorName ? ` para ${receptorName}` : '';
    toast({
      title: "Tratamiento iniciado",
      description: `Aplicando frecuencia de ${audio.frequency[0]}Hz${target}`,
    });
    
    console.log("Treatment fully started");
  };

  // Stop the treatment
  const stopTreatment = () => {
    console.log("Stopping treatment");
    
    // Stop main audio
    audio.stopAudio();
    
    // Stop visual effects
    setHypnoticEffect(false);
    
    // Stop subliminal audio if playing
    stopSubliminalAudio();

    toast({
      title: "Tratamiento detenido",
      description: "El tratamiento de frecuencia ha sido detenido.",
    });
    
    console.log("Treatment completely stopped");
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
    // Audio treatment originals
    ...audio,
    // Images and rates
    ...images,
    ...rates,
    // Treatment control
    selectedPreset,
    visualFeedback,
    setVisualFeedback,
    hypnoticEffect,
    receptorName,
    setReceptorName,
    hypnoticSpeed,
    setHypnoticSpeed,
    // Actions
    selectPreset,
    startTreatment,
    stopTreatment,
    // Audio subliminal
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
    // Background mode indicator
    backgroundModeActive: audio.backgroundModeActive || backgroundModeActive,
  };
};
