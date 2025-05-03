
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

  // Iniciar Manifestación: comienza audio subliminal si disponible
  const startManifestation = () => {
    // CRITICAL FIX: Directly check the state value at time of execution
    console.log("StartManifestation with current state:", {
      intention: state.intention,
      intentionLength: state.intention ? state.intention.length : 0,
      activeTab: state.activeTab,
      patternImage: state.patternImage,
      patternImagesLength: state.patternImages ? state.patternImages.length : 0,
      selectedPattern: state.selectedPattern
    });
    
    // Proper validation of intention - forced to string and trimmed
    const currentIntention = String(state.intention || "").trim();
    
    if (currentIntention === "") {
      console.log("Cannot start manifestation - missing intention");
      toast({
        title: "No se puede iniciar la manifestación",
        description: "Asegúrate de tener una intención definida.",
        variant: "destructive",
      });
      return;
    }
    
    // CRITICAL FIX: Check for pattern based on the current tab
    let hasPattern = false;
    if (state.activeTab === "custom") {
      // For custom tab, check for either patternImage or patternImages
      hasPattern = state.patternImage !== null || (state.patternImages && state.patternImages.length > 0);
    } else {
      // For presets tab, check for selectedPattern
      hasPattern = state.selectedPattern !== "";
    }
    
    if (!hasPattern) {
      console.log("Cannot start manifestation - missing pattern");
      toast({
        title: "No se puede iniciar la manifestación",
        description: "Asegúrate de tener un patrón seleccionado.",
        variant: "destructive",
      });
      return;
    }

    // Start sound if enabled
    if (state.manifestSound) {
      startAudio(state.manifestFrequency[0]);
    }

    // AUDIO SUBLIMINAL: inicia audio si fue subido
    if (audioFile) {
      playSubliminalAudio();
    }

    const switchInterval = 1000 / (state.visualSpeed[0] * 3);

    const hypnoticTimer = setInterval(() => {
      if (!document.hidden) {
        state.setCurrentImage((prev) => {
          switch(prev) {
            case 'pattern': return 'receptor';
            case 'receptor': return 'mix';
            case 'mix': return 'pattern';
            default: return 'pattern';
          }
        });
      }
    }, switchInterval);
    setHypnoticTimer(hypnoticTimer);

    // Only set exposure and countdown timers if not indefinite time
    if (!state.indefiniteTime) {
      const exposureTimeInMs = state.exposureTime[0] * 60 * 1000;
      state.setTimeRemaining(state.exposureTime[0]);

      const countdownTimer = setInterval(() => {
        if (!document.hidden) {
          state.setTimeRemaining((prev) => {
            if (prev !== null && prev > 0) {
              return prev - 1/60;
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
          description: `Tu intención "${state.intention}" ha sido completamente programada.`,
        });
      }, exposureTimeInMs);
      setExposureTimer(exposureTimer);
    } else {
      // If indefinite time, set timeRemaining to -1 to indicate indefinite
      state.setTimeRemaining(-1);
    }

    state.setIsManifestActive(true);
  };

  // Detener Manifestación: para audio subliminal si está en reproducción
  const stopManifestation = () => {
    stopAudio();
    clearAllTimers();
    state.setTimeRemaining(null);
    state.setIsManifestActive(false);
    stopSubliminalAudio();
  };

  // Limpieza al desmontar
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
