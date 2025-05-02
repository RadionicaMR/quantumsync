
import { useManifestState } from './useManifestState';
import { useManifestSubliminal } from './useManifestSubliminal';
import { useManifestSession } from './useManifestSession';
import { useManifestUtils } from './useManifestUtils';
import { ManifestPattern } from '@/data/manifestPatterns';
import { useManifestNavigation } from './useManifestNavigation';

export const useManifestCore = (patterns: ManifestPattern[]) => {
  const state = useManifestState();
  const subliminal = useManifestSubliminal();
  const { startManifestation, stopManifestation } = useManifestSession();
  const utils = useManifestUtils();
  const navigation = useManifestNavigation(stopManifestation);

  return {
    // State and utils
    ...state,
    ...utils,
    
    // Navigation
    handleTabChange: navigation.handleTabChange,
    selectPattern: navigation.selectPattern,
    
    // Session control
    startManifestation,
    stopManifestation,
    
    // Subliminal audio
    ...subliminal,
  };
};
