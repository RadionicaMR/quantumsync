import { useEffect, useState, useRef } from 'react';
import { useManifestState } from './useManifestState';
import { useManifestAudio } from './useManifestAudio';
import { useManifestTimers } from './useManifestTimers';
import { useManifestUtils } from './useManifestUtils';
import { toast } from "@/components/ui/use-toast";
import { ManifestPattern } from '@/data/manifestPatterns';

export const useManifestCore = (patterns: ManifestPattern[]) => {
  const state = useManifestState();
  const { startAudio, stopAudio, ...audio } = useManifestAudio();
  const { 
    clearAllTimers, 
    setHypnoticTimer, 
    setExposureTimer, 
    setCountdownTimer,
    ...timers 
  } = useManifestTimers();
  const utils = useManifestUtils();

  // Audio uploader state y control manual
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioVolume, setAudioVolume] = useState(20);
  const [audioSubliminalPlaying, setAudioSubliminalPlaying] = useState(false);
  const [audioLoop, setAudioLoop] = useState(true); // Nuevo estado del loop
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Función para reproducir audio subliminal
  const playSubliminalAudio = () => {
    if (audioFile && !audioSubliminalPlaying) {
      const elem = new Audio(URL.createObjectURL(audioFile));
      elem.volume = audioVolume / 20;
      elem.loop = audioLoop; // Usar el valor actual de loop
      elem.play().then(() => {
        setAudioSubliminalPlaying(true);
        audioElementRef.current = elem;
      }).catch((err) => {
        setAudioSubliminalPlaying(false);
        audioElementRef.current = null;
        console.error("No se puede reproducir el audio subliminal:", err);
      });
      // fallback, en caso de rechazar el play...
    }
  };

  // Función para detener audio subliminal
  const stopSubliminalAudio = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current = null;
    }
    setAudioSubliminalPlaying(false);
  };

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

    // AUDIO SUBLIMINAL (nuevo): inicia audio si fue subido
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

  // Volumen en caliente sobre elemento activo
  useEffect(() => {
    if (audioElementRef.current) {
      audioElementRef.current.volume = audioVolume / 20;
    }
  }, [audioVolume]);

  // Update loop property en caliente
  // Si cambia audioLoop y hay elemento, actualizar el loop dinámicamente
  useEffect(() => {
    if (audioElementRef.current) {
      audioElementRef.current.loop = audioLoop;
    }
  }, [audioLoop]);

  return {
    ...state,
    ...utils,
    handleTabChange: (val: string) => {
      if (state.isManifestActive) {
        stopManifestation();
      }
      state.setActiveTab(val);
      state.setSelectedPattern('');
      stopSubliminalAudio();
    },
    selectPattern: (patternId: string) => {
      if (state.isManifestActive) {
        stopManifestation();
      }
      state.setSelectedPattern(patternId);
      stopSubliminalAudio();
    },
    startManifestation,
    stopManifestation,
    // Audio Subliminal
    audioFile,
    setAudioFile,
    audioVolume,
    setAudioVolume,
    audioSubliminalPlaying,
    playSubliminalAudio,
    stopSubliminalAudio,
    audioLoop,
    setAudioLoop,
  };
};
