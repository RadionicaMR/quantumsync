
import { useEffect } from 'react';
import { useManifestState } from './useManifestState';
import { useManifestAudio } from './useManifestAudio';
import { useManifestTimers } from './useManifestTimers';
import { useManifestUtils } from './useManifestUtils';
import { toast } from "@/components/ui/use-toast";
import { Pattern } from '@/data/manifestPatterns';

export const useManifestCore = (patterns: Pattern[]) => {
  const state = useManifestState();
  const { startAudio, stopAudio, ...audio } = useManifestAudio();
  const { clearAllTimers, ...timers } = useManifestTimers();
  const utils = useManifestUtils();
  
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
    if ((state.activeTab === "presets" && !state.selectedPattern && !state.receptorName) || 
        (state.activeTab === "custom" && !state.patternImage && !state.receptorName)) return;
    
    // Start sound if enabled
    if (state.manifestSound) {
      startAudio(state.manifestFrequency[0]);
    }
    
    // Start hypnotic effect with increased speed
    const switchInterval = 1000 / (state.visualSpeed[0] * 3);
    
    // Can start with a pattern, image, or receptor name
    if (state.patternImage || state.selectedPattern || state.receptorImage || state.receptorName) {
      // Start hypnotic effect that alternates between pattern, receptor and mix
      timers.hypnoticTimerRef.current = setInterval(() => {
        state.setCurrentImage(prev => {
          switch(prev) {
            case 'pattern': return 'receptor';
            case 'receptor': return 'mix';
            case 'mix': return 'pattern';
            default: return 'pattern';
          }
        });
      }, switchInterval);

      // Set exposure timer
      const exposureTimeInMs = state.exposureTime[0] * 60 * 1000; // convert to milliseconds
      state.setTimeRemaining(state.exposureTime[0]);
      
      // Start countdown
      timers.countdownTimerRef.current = setInterval(() => {
        state.setTimeRemaining(prev => {
          if (prev !== null && prev > 0) {
            return prev - 1/60; // Decrement 1 second (1/60 of a minute)
          }
          return prev;
        });
      }, 1000);
      
      // Set timer to stop manifestation
      if (timers.exposureTimerRef.current) {
        clearTimeout(timers.exposureTimerRef.current);
      }
      
      timers.exposureTimerRef.current = setTimeout(() => {
        stopManifestation();
        toast({
          title: "Manifestación completada",
          description: `Tu intención "${state.intention}" ha sido completamente programada.`,
        });
      }, exposureTimeInMs);
    }
    
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

  return {
    ...state,
    ...utils,
    handleTabChange,
    selectPattern,
    startManifestation,
    stopManifestation
  };
};
