
import { useEffect } from 'react';
import { useTreatmentCore } from './treatment/useTreatmentCore';
import { useTreatmentSubliminal } from './treatment/useTreatmentSubliminal';

export type { TreatmentPreset } from './treatment/useTreatmentCore';

// Main treatment hook that combines all the other hooks
export const useTreatment = () => {
  // Get core treatment functionality
  const core = useTreatmentCore();
  
  // Get subliminal audio functionality
  const subliminal = useTreatmentSubliminal();
  
  // Augment startTreatment to handle subliminal audio
  const startTreatment = () => {
    // Use the core start treatment functionality
    core.startTreatment();
    
    // Only after starting the audio, we start the subliminal if it exists
    if (subliminal.audioFile) {
      console.log("Starting subliminal audio associated with treatment");
      setTimeout(() => {
        subliminal.playSubliminalAudio();
      }, 300); // Small delay to ensure main audio starts first
    }
  };
  
  // Augment stopTreatment to handle subliminal audio
  const stopTreatment = () => {
    // Use the core stop treatment functionality
    core.stopTreatment();
    
    // Stop subliminal audio if playing
    subliminal.stopSubliminalAudio();
  };

  // Return combined functionality
  return {
    // Treatment core functionality
    ...core,
    // Subliminal audio functionality
    ...subliminal,
    // Override with enhanced treatment control functions
    startTreatment,
    stopTreatment,
    // Handle background mode from both sources
    backgroundModeActive: core.backgroundModeActive || subliminal.backgroundModeActive,
  };
};
