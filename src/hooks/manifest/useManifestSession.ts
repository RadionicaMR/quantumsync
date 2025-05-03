
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
    // Fix the pattern check logic to be more permissive
    const hasPattern = state.activeTab === "presets" 
      ? !!state.selectedPattern 
      : (!!state.patternImage || state.patternImages.length > 0);

    const hasReceptor = !!state.receptorName.trim() || 
                    !!state.receptorImage || 
                    state.receptorImages.length > 0;
    
    // For custom tab, we only need a pattern and intention
    const canStart = hasPattern && state.intention.trim() !== "";
    
    console.log("Start manifestation checks:", { 
      hasPattern, 
      hasReceptor, 
      canStart, 
      intention: state.intention,
      activeTab: state.activeTab,
      selectedPattern: state.selectedPattern,
      patternImage: state.patternImage,
      patternImages: state.patternImages.length
    });
    
    if (!canStart) {
      console.log("Cannot start manifestation - missing required fields");
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
