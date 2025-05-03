
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
      console.error("ERROR CRÍTICO: Intención vacía o indefinida", {
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
    
    // Actualizar la intención en el state si usamos la intención forzada
    if (forcedIntention && forcedIntention !== state.intention) {
      state.setIntention(forcedIntention);
    }

    // Es crucial establecer el estado activo ANTES de continuar
    state.setIsManifestActive(true);
    
    // Start sound if enabled
    if (state.manifestSound) {
      startAudio(state.manifestFrequency[0]);
    }

    // AUDIO SUBLIMINAL: inicia audio si fue subido
    if (audioFile) {
      playSubliminalAudio();
    }

    // Establecer una velocidad para la rotación de imágenes basada en manifestSpeed
    const switchInterval = 1000 / (state.manifestSpeed?.[0] || 10);

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
    
    console.log("Manifestación activada, ahora configurando temporizadores");

    // Only set exposure and countdown timers if not indefinite time
    if (!state.indefiniteTime) {
      const exposureTimeInMs = state.exposureTime[0] * 60 * 1000;
      state.setTimeRemaining(state.exposureTime[0] * 60); // Set in minutes originally

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
    
    console.log("Manifestación iniciada correctamente con:", {
      intention: currentIntention,
      activeTab: state.activeTab,
      patternImages: state.patternImages ? state.patternImages.length : 0,
      selectedPattern: state.selectedPattern,
      isActive: state.isManifestActive,
      timeRemaining: state.timeRemaining
    });
  };

  // Detener Manifestación: para audio subliminal si está en reproducción
  const stopManifestation = () => {
    console.log("Deteniendo manifestación");
    stopAudio();
    clearAllTimers();
    state.setTimeRemaining(null);
    state.setIsManifestActive(false);
    stopSubliminalAudio();
    toast({
      title: "Manifestación detenida",
      description: "El proceso de manifestación ha sido detenido manualmente."
    });
    console.log("Manifestación detenida");
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
