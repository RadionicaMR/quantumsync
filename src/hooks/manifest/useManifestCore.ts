
import { useManifestState } from './useManifestState';
import { useManifestSubliminal } from './useManifestSubliminal';
import { useManifestSession } from './useManifestSession';
import { useManifestUtils } from './useManifestUtils';
import { useManifestAudio } from './useManifestAudio';
import { ManifestPattern } from '@/data/manifestPatterns';
import { useManifestImageControl } from './useManifestImageControl';

export const useManifestCore = (patterns: ManifestPattern[]) => {
  const state = useManifestState();
  const subliminal = useManifestSubliminal();
  const imageControl = useManifestImageControl(state.isManifestActive, state.visualSpeed);
  const session = useManifestSession(imageControl.startImageAlternation, imageControl.stopImageAlternation);
  const utils = useManifestUtils();
  const audio = useManifestAudio();

  return {
    // State and utils
    ...state,
    ...utils,
    
    // Image control
    ...imageControl,
    
    // Audio control
    ...audio,
    
    // Navigation
    handleTabChange: (tab: string) => {
      console.log("Handling tab change to", tab);
      state.setActiveTab(tab);
      
      if (state.isManifestActive) {
        session.stopManifestation();
      }
    },
    selectPattern: (patternId: string) => {
      const pattern = patterns.find(p => p.id === patternId);
      if (pattern) {
        state.setSelectedPattern(pattern.id);
      }
    },
    
    // Session control
    startManifestation: session.startManifestation,
    stopManifestation: session.stopManifestation,
    
    // Subliminal audio
    ...subliminal,
    
    // Background mode indicator
    backgroundModeActive: audio.backgroundModeActive || subliminal.backgroundModeActive,
    
    // We don't need to provide patterns here, they're already passed from Manifest.tsx
    patterns
  };
};
