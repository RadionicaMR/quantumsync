
import { useEffect } from 'react';
import { useManifestState } from './useManifestState';
import { useManifestAudio } from './useManifestAudio';
import { useManifestTimers } from './useManifestTimers';
import { useManifestSubliminal } from './useManifestSubliminal';
import { toast } from "@/components/ui/use-toast";

export const useManifestSession = () => {
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

    // Important: Set the currentImage to 'pattern' for Preset Patterns 
    // or 'mix' for Personal Manifestation based on the active tab
    if (state.activeTab === 'personal') {
      // For personal manifestation, always use 'mix' to avoid flickering
      state.setCurrentImage('mix');
    } else {
      // For preset patterns, start with 'pattern' to begin alternation
      state.setCurrentImage('pattern');
      
      // Only set hypnotic timer for preset patterns tab to alternate images
      // Calculate interval based on manifestSpeed (for presets) or visualSpeed (for personal)
      const speed = state.activeTab === 'presets' 
        ? (state.manifestSpeed?.[0] || 10) 
        : (state.visualSpeed?.[0] || 10);
      
      // Faster speed = shorter interval (inverse relationship)
      const switchInterval = 5000 / Math.max(1, speed);
      
      console.log("Setting up alternation timer with speed:", speed, "interval:", switchInterval);
      
      const hypnoticTimer = setInterval(() => {
        if (!document.hidden) {
          state.setCurrentImage((prev) => {
            // Only toggle between pattern and receptor for presets
            return prev === 'pattern' ? 'receptor' : 'pattern';
          });
        }
      }, switchInterval);
      
      setHypnoticTimer(hypnoticTimer);
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
    state.setCurrentImage('mix');
    
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
