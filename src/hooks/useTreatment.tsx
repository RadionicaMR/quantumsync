
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
  
  // Make sure the currentImage value is consistently handled
  const normalizedCurrentImage = core.currentImage === 'pattern' ? 'radionic' : core.currentImage;
  
  // Augment startTreatment to handle subliminal audio
  const startTreatment = () => {
    // CRITICAL: Start subliminal audio FIRST, synchronously within user gesture for Safari
    // Safari requires Audio.play() to be called in the user gesture call stack
    if (subliminal.audioFile) {
      subliminal.playSubliminalAudio();
    }
    
    // Then start the core treatment (also needs user gesture for AudioContext)
    core.startTreatment();
  };
  
  // Augment stopTreatment to handle subliminal audio
  const stopTreatment = () => {
    core.stopTreatment();
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
    // Override currentImage with normalized version
    currentImage: normalizedCurrentImage,
    // Handle background mode from both sources
    backgroundModeActive: core.backgroundModeActive || subliminal.backgroundModeActive,
  };
};
