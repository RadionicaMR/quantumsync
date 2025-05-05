
import { ManifestPattern } from '@/data/manifestPatterns';
import { useManifestState } from './useManifestState';
import { useManifestAudio } from './useManifestAudio';
import { useManifestSubliminal } from './useManifestSubliminal';
import { useManifestSession } from './useManifestSession';
import { useManifestUtils } from './useManifestUtils';
import { useManifestImageControl } from './useManifestImageControl';

export const useManifestCore = (patterns: ManifestPattern[]) => {
  // Obtenemos los módulos específicos
  const state = useManifestState();
  const audio = useManifestAudio();
  const subliminal = useManifestSubliminal();
  const imageControl = useManifestImageControl(state.isManifestActive, state.visualSpeed);
  const utils = useManifestUtils();
  const session = useManifestSession(imageControl.startImageAlternation, imageControl.stopImageAlternation);

  return {
    // Estado y utilidades generales
    ...state,
    ...utils,
    
    // Control de imágenes
    ...imageControl,
    
    // Control de audio
    ...audio,
    
    // Control de sesión
    startManifestation: session.startManifestation,
    stopManifestation: session.stopManifestation,
    
    // Audio subliminal
    ...subliminal,
    
    // Indicador de modo de fondo
    backgroundModeActive: audio.backgroundModeActive || subliminal.backgroundModeActive,
    
    // Navegación
    handleTabChange: (tab: string) => {
      console.log("Handling tab change to", tab);
      state.setActiveTab(tab);
      
      if (state.isManifestActive) {
        session.stopManifestation();
      }
    },
    
    // Selección de patrón
    selectPattern: (patternId: string) => {
      const pattern = patterns.find(p => p.id === patternId);
      if (pattern) {
        state.setSelectedPattern(pattern.id);
      }
    }
  };
};
