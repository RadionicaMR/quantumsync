import { useEffect, useState } from 'react';
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

  // NUEVO: Audio uploader state
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioVolume, setAudioVolume] = useState(20);
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    if (state.isManifestActive) {
      stopManifestation();
    }
    state.setActiveTab(value);
    state.setSelectedPattern('');
  };

  // Select pattern
  const selectPattern = (patternId: string) => {
    if (state.isManifestActive) {
      stopManifestation();
    }
    
    state.setSelectedPattern(patternId);
  };

  // Start manifestation
  const startManifestation = () => {
    // Can start with a pattern, image, or receptor name
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

    // Start hypnotic effect with increased speed
    const switchInterval = 1000 / (state.visualSpeed[0] * 3);
    
    // Start hypnotic effect that alternates between pattern, receptor and mix
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

    // Set exposure timer
    const exposureTimeInMs = state.exposureTime[0] * 60 * 1000; // convert to milliseconds
    state.setTimeRemaining(state.exposureTime[0]);
    
    // Start countdown
    const countdownTimer = setInterval(() => {
      state.setTimeRemaining((prev) => {
        if (prev !== null && prev > 0) {
          return prev - 1/60; // Decrement 1 second (1/60 of a minute)
        }
        return prev;
      });
    }, 1000);
    
    setCountdownTimer(countdownTimer);
    
    // Set timer to stop manifestation
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

  // Stop manifestation
  const stopManifestation = () => {
    stopAudio();
    clearAllTimers();
    state.setTimeRemaining(null);
    state.setIsManifestActive(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
      clearAllTimers();
    };
  }, []);

  // Play/pause uploaded audio based on manifest activation
  useEffect(() => {
    let currentAudio: HTMLAudioElement | null = null;
    if (audioFile && state.isManifestActive) {
      currentAudio = new Audio(URL.createObjectURL(audioFile));
      currentAudio.volume = audioVolume / 20;
      currentAudio.loop = true;
      currentAudio.play();
    }
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
      }
    };
    // eslint-disable-next-line
  }, [audioFile, state.isManifestActive]);

  // Volume change on the fly
  useEffect(() => {
    // No need to change here—handled by uploader component
  }, [audioVolume]);

  return {
    ...state,
    ...utils,
    handleTabChange,
    selectPattern,
    startManifestation,
    stopManifestation,
    // NUEVO:
    audioFile,
    setAudioFile,
    audioVolume,
    setAudioVolume,
  };
};
