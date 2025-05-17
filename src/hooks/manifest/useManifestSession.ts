
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

  // Start Manifestation with option to pass intention directly
  const startManifestation = (passedIntention?: string) => {
    // Use passed intention if available, otherwise use state intention
    const currentIntention = passedIntention || state.intention;
    
    console.log("StartManifestation - Starting:", {
      passedIntention,
      stateIntention: state.intention,
      finalIntention: currentIntention,
      intentionLength: currentIntention ? currentIntention.length : 0,
      intentionValid: Boolean(currentIntention && currentIntention.trim() !== ""),
      activeTab: state.activeTab
    });
    
    // Strict validation: Verify that intention exists and is not empty
    if (!currentIntention || currentIntention.trim() === "") {
      console.error("ERROR: Empty or undefined intention", {
        passedIntention,
        stateIntention: state.intention
      });
      toast({
        title: "No se puede iniciar la manifestación",
        description: "Asegúrate de tener una intención definida.",
        variant: "destructive",
      });
      return;
    }
    
    console.log("INTENTION VALIDATED:", currentIntention);

    // IMPORTANT: Set active state to true BEFORE continuing with any other operations
    state.setIsManifestActive(true);
    
    // Start sound if enabled
    if (state.manifestSound) {
      startAudio(state.manifestFrequency[0]);
    }

    // Start subliminal audio if uploaded
    if (audioFile) {
      playSubliminalAudio();
    }

    // Handle image alternation based on active tab
    if (state.activeTab === 'personal') {
      console.log("Starting personal manifestation with current image:", state.currentImage);
    } else {
      console.log("Starting image alternation for preset tab");
      startImageAlternation(state.currentImage, state.setCurrentImage);
    }

    // Only set exposure and countdown timers if not indefinite time
    if (!state.indefiniteTime) {
      const exposureTimeInMs = state.exposureTime[0] * 60 * 1000;
      state.setTimeRemaining(state.exposureTime[0] * 60); // Set in seconds

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
      // If indefinite time, set timeRemaining to -1 
      state.setTimeRemaining(-1);
    }
    
    // Show started toast notification
    toast({
      title: "Manifestación iniciada",
      description: "El proceso ha comenzado correctamente."
    });
  };

  // Stop Manifestation
  const stopManifestation = () => {
    console.log("Stopping manifestation");
    stopAudio();
    clearAllTimers();
    state.setTimeRemaining(null);
    
    // IMPORTANT: Set active state to false
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
