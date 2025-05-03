
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
  const startManifestation = (forcedIntention?: string) => {
    // CORRECCIÓN CRÍTICA: Usar la intención forzada si está disponible
    // o usar la del state como fallback
    const currentIntention = forcedIntention || state.intention;
    
    console.log("StartManifestation - INTENCIÓN RECIBIDA:", {
      forcedIntention,
      stateIntention: state.intention,
      finalIntention: currentIntention,
      intentionLength: currentIntention ? currentIntention.length : 0,
      intentionValid: currentIntention && currentIntention.trim() !== "",
      activeTab: state.activeTab
    });
    
    // VALIDACIÓN ESTRICTA: Verificamos que la intención exista y no esté vacía
    if (!currentIntention || currentIntention.trim() === "") {
      console.log("ERROR CRÍTICO: Intención vacía o indefinida", {
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
    
    console.log("INTENCIÓN VALIDADA CORRECTAMENTE:", currentIntention);
    
    // CORRECCIÓN CRÍTICA: Verificación de patrón según el tab activo ACTUAL del estado
    let hasPattern = false;
    
    // Log del estado actual de patrones para debugging
    console.log("Verificación de patrón:", {
      activeTab: state.activeTab,
      patternImage: state.patternImage,
      patternImagesLength: state.patternImages ? state.patternImages.length : 0,
      selectedPattern: state.selectedPattern,
      receptorImage: state.receptorImage,
      receptorImagesLength: state.receptorImages ? state.receptorImages.length : 0
    });
    
    // CORRECCIÓN CRUCIAL: Usar el activeTab actual para determinar la lógica correcta
    if (state.activeTab === "custom") {
      // Para la pestaña personalizada, verificar patternImage o patternImages
      hasPattern = Boolean(state.patternImage !== null || 
                         (state.patternImages && state.patternImages.length > 0));
      console.log("Tab CUSTOM - Verificación de patrón:", { 
        hasPattern, 
        patternImage: state.patternImage, 
        patternImagesLength: state.patternImages ? state.patternImages.length : 0 
      });
    } else if (state.activeTab === "presets") {
      // Para la pestaña de presets, verificar selectedPattern
      hasPattern = Boolean(state.selectedPattern && state.selectedPattern !== "");
      console.log("Tab PRESETS - Verificación de patrón:", { 
        hasPattern, 
        selectedPattern: state.selectedPattern 
      });
    }
    
    console.log("Resultado de verificación de patrón:", { hasPattern, activeTab: state.activeTab });
    
    if (!hasPattern) {
      console.log("Cannot start manifestation - missing pattern");
      toast({
        title: "No se puede iniciar la manifestación",
        description: "Asegúrate de tener un patrón seleccionado.",
        variant: "destructive",
      });
      return;
    }

    // Actualizar la intención en el state si usamos la intención forzada
    if (forcedIntention && forcedIntention !== state.intention) {
      state.setIntention(forcedIntention);
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
          description: `Tu intención "${currentIntention}" ha sido completamente programada.`,
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
