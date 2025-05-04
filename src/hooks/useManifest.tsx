
import { useManifestCore } from './manifest/useManifestCore';
import { ManifestPattern } from '@/data/manifestPatterns';

// Re-export with the same interface to maintain backward compatibility
export const useManifest = (patterns: ManifestPattern[]) => {
  const manifestCore = useManifestCore(patterns);
  
  // Make sure currentImage correctly handles pattern/radionic values
  const normalizedManifestCore = {
    ...manifestCore,
    // Normalize the currentImage value for consistency
    currentImage: manifestCore.currentImage === 'pattern' 
      ? 'radionic' 
      : manifestCore.currentImage,
    // Ensure visualSpeed and exposureTime are properly handled as separate controls
    setVisualSpeed: manifestCore.setVisualSpeed || manifestCore.setExposureTime,
    visualSpeed: manifestCore.visualSpeed || manifestCore.exposureTime,
  };
  
  return normalizedManifestCore;
};
