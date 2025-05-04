
import { useManifestCore } from './manifest/useManifestCore';
import { ManifestPattern } from '@/data/manifestPatterns';

// Re-export with the same interface to maintain backward compatibility
export const useManifest = (patterns: ManifestPattern[]) => {
  const manifestCore = useManifestCore(patterns);
  
  // Fix image alternation when starting manifestation
  // Ensure that we're always setting a valid initial state
  const enhancedManifestCore = {
    ...manifestCore,
    // Normalize the currentImage value for consistency
    // Always use 'pattern' when in active state to avoid UI bugs
    currentImage: manifestCore.isManifestActive ? 
      (manifestCore.currentImage === 'radionic' ? 'pattern' : manifestCore.currentImage) : 
      (manifestCore.currentImage === 'radionic' ? 'pattern' : manifestCore.currentImage),
    
    // Ensure visualSpeed and exposureTime are properly handled
    setVisualSpeed: manifestCore.setVisualSpeed || manifestCore.setExposureTime,
    visualSpeed: manifestCore.visualSpeed || manifestCore.exposureTime,
  };
  
  return enhancedManifestCore;
};
