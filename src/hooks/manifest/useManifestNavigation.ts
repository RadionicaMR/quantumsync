
import { useManifestState } from './useManifestState';
import { useManifestSubliminal } from './useManifestSubliminal';

export const useManifestNavigation = (stopManifestation: () => void) => {
  const state = useManifestState();
  const { stopSubliminalAudio } = useManifestSubliminal();

  const handleTabChange = (val: string) => {
    if (state.isManifestActive) {
      stopManifestation();
    }
    state.setActiveTab(val);
    state.setSelectedPattern('');
    stopSubliminalAudio();
  };

  const selectPattern = (patternId: string) => {
    console.log("useManifestNavigation: Seleccionando patrón", patternId);
    
    if (state.isManifestActive) {
      stopManifestation();
    }
    
    // Validación para evitar patrones vacíos
    if (patternId && patternId.trim() !== "") {
      state.setSelectedPattern(patternId);
      console.log("Patrón seleccionado:", patternId);
    } else {
      console.warn("Intento de seleccionar un patrón vacío");
    }
    
    stopSubliminalAudio();
  };

  return {
    handleTabChange,
    selectPattern,
  };
};
