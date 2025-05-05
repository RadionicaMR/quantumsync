
import { useEffect } from 'react';
import { useManifestState } from './useManifestState';
import { useManifestAudio } from './useManifestAudio';
import { useManifestTimers } from './useManifestTimers';
import { useManifestSubliminal } from './useManifestSubliminal';
import { toast } from "@/components/ui/use-toast";

export const useManifestSession = (
  startImageAlternation: (
    currentImage: 'pattern' | 'receptor' | 'mix' | 'radionic',
    setCurrentImage: (value: ((prev: 'pattern' | 'receptor' | 'mix' | 'radionic') => 'pattern' | 'receptor' | 'mix' | 'radionic') | 'pattern' | 'receptor' | 'mix' | 'radionic') => void
  ) => void,
  stopImageAlternation: (
    setCurrentImage?: (value: 'pattern' | 'receptor' | 'mix' | 'radionic') => void
  ) => void
) => {
  const state = useManifestState();
  const { startAudio, stopAudio, backgroundModeActive: audioBackgroundActive } = useManifestAudio();
  const { 
    clearAllTimers, 
    setHypnoticTimer, 
    setExposureTimer, 
    setCountdownTimer 
  } = useManifestTimers();
  const { 
    playSubliminalAudio, 
    stopSubliminalAudio,
    audioFile,
    backgroundModeActive: subliminalBackgroundActive 
  } = useManifestSubliminal();

  // Start Manifestation: begin subliminal audio if available
  const startManifestation = (forcedIntention?: string) => {
    // Use forced intention if available or use state intention as fallback
    const currentIntention = forcedIntention || state.intention;
    
    console.log("StartManifestation - INTENTION RECEIVED:", {
      forcedIntention,
      stateIntention: state.intention,
      finalIntention: currentIntention,
      intentionLength: currentIntention ? currentIntention.length : 0,
      intentionValid: currentIntention && currentIntention.trim() !== "",
      activeTab: state.activeTab
    });
    
    // Strict validation: Verify that intention exists and is not empty
    if (!currentIntention || currentIntention.trim() === "") {
      console.error("CRITICAL ERROR: Empty or undefined intention", {
        forcedIntention,
        stateIntention: state.intention
      });
      toast({
        title: "No se puede iniciar la manifestación",
        description: "Asegúrate de tener una intención definida.",
        variant: "destructive",
      });
      return;
    }
    
    console.log("INTENTION CORRECTLY VALIDATED:", currentIntention);
    
    // Update intention in state if using forced intention
    if (forcedIntention && forcedIntention !== state.intention) {
      state.setIntention(forcedIntention);
    }

    // It's crucial to set active state BEFORE continuing
    state.setIsManifestActive(true);
    
    // Start sound if enabled
    if (state.manifestSound) {
      startAudio(state.manifestFrequency[0]);
    }

    // SUBLIMINAL AUDIO: start audio if uploaded
    if (audioFile) {
      playSubliminalAudio();
    }

    // Handle image alternation differently based on active tab
    if (state.activeTab === 'personal') {
      // For personal manifestation, always use 'mix' to show both images simultaneously
      state.setCurrentImage('mix');
    } else {
      // Para patrones preestablecidos, iniciar la alternancia de imágenes
      console.log("Starting image alternation for preset tab");
      startImageAlternation(state.currentImage, state.setCurrentImage);
    }

    // Only set exposure and countdown timers if not indefinite time
    if (!state.indefiniteTime) {
      const exposureTimeInMs = state.exposureTime[0] * 60 * 1000;
      state.setTimeRemaining(state.exposureTime[0] * 60); // Set in seconds originally

      const countdownTimer = setInterval(() => {
        if (!document.hidden) {
          state.setTimeRemaining((prev) => {
            if (prev !== null && prev > 0) {
              return prev - 1;
            }
            return prev;
          });
        }
      }, 1000);
      setCountdownTimer(countdownTimer);

      const exposureTimer = setTimeout(() => {
        stopManifestation();
        toast({
          title: "Manifestación completada",
          description: `Tu intención "${currentIntention}" ha sido completamente programada.`,
        });
      }, exposureTimeInMs);
      setExposureTimer(exposureTimer);
    } else {
      // If indefinite time, set timeRemaining to -1 to indicate indefinite
      state.setTimeRemaining(-1);
    }
    
    // Show completed toast notification
    toast({
      title: "Manifestación iniciada",
      description: "El proceso ha comenzado correctamente."
    });
  };

  // Stop Manifestation: stop subliminal audio if playing
  const stopManifestation = () => {
    console.log("Stopping manifestation");
    stopAudio();
    clearAllTimers();
    state.setTimeRemaining(null);
    state.setIsManifestActive(false);
    
    // Reset to mix view instead of alternating
    stopImageAlternation(state.setCurrentImage);
    
    stopSubliminalAudio();
    toast({
      title: "Manifestación detenida",
      description: "El proceso de manifestación ha sido detenido."
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
      clearAllTimers();
      stopSubliminalAudio();
    };
  }, []);

  return {
    startManifestation,
    stopManifestation,
    backgroundModeActive: audioBackgroundActive || subliminalBackgroundActive
  };
};
