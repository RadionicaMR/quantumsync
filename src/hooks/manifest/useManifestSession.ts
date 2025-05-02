
import { useEffect } from 'react';
import { useManifestState } from './useManifestState';
import { useManifestAudio } from './useManifestAudio';
import { useManifestTimers } from './useManifestTimers';
import { useManifestSubliminal } from './useManifestSubliminal';
import { toast } from "@/components/ui/use-toast";

export const useManifestSession = () => {
  const state = useManifestState();
  const { startAudio, stopAudio } = useManifestAudio();
  const { 
    clearAllTimers, 
    setHypnoticTimer, 
    setExposureTimer, 
    setCountdownTimer 
  } = useManifestTimers();
  const { 
    playSubliminalAudio, 
    stopSubliminalAudio,
    audioFile 
  } = useManifestSubliminal();

  // Iniciar Manifestación: comienza audio subliminal si disponible
  const startManifestation = () => {
    const hasPattern = state.activeTab === "presets" 
      ? !!state.selectedPattern 
      : (state.patternImage !== null || state.patternImages.length > 0);

    const hasReceptor = state.receptorName.trim() !== "" || 
                    state.receptorImage !== null || 
                    state.receptorImages.length > 0;

    if (!hasPattern && !hasReceptor) return;

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
      state.setCurrentImage((prev) => {
        switch(prev) {
          case 'pattern': return 'receptor';
          case 'receptor': return 'mix';
          case 'mix': return 'pattern';
          default: return 'pattern';
        }
      });
    }, switchInterval);
    setHypnoticTimer(hypnoticTimer);

    const exposureTimeInMs = state.exposureTime[0] * 60 * 1000;
    state.setTimeRemaining(state.exposureTime[0]);

    const countdownTimer = setInterval(() => {
      state.setTimeRemaining((prev) => {
        if (prev !== null && prev > 0) {
          return prev - 1/60;
        }
        return prev;
      });
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
    stopManifestation
  };
};
