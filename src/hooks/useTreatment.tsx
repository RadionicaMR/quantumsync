
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
    console.log("=== INICIANDO TRATAMIENTO ===");
    console.log("Audio subliminal configurado:", subliminal.audioFile ? "Sí" : "No");
    
    // Use the core start treatment functionality
    core.startTreatment();
    
    // Only after starting the audio, we start the subliminal if it exists
    if (subliminal.audioFile) {
      console.log("Iniciando audio subliminal asociado con el tratamiento");
      console.log("Archivo:", {
        name: subliminal.audioFile.name,
        type: subliminal.audioFile.type,
        size: subliminal.audioFile.size
      });
      
      setTimeout(() => {
        subliminal.playSubliminalAudio();
      }, 500); // Small delay to ensure main audio starts first
    } else {
      console.log("No hay audio subliminal configurado para este tratamiento");
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
    // Override currentImage with normalized version
    currentImage: normalizedCurrentImage,
    // Handle background mode from both sources
    backgroundModeActive: core.backgroundModeActive || subliminal.backgroundModeActive,
  };
};
