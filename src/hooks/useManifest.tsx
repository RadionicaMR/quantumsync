
import { useManifestCore } from './manifest/useManifestCore';
import { ManifestPattern } from '@/data/manifestPatterns';

// Re-export with the same interface to maintain backward compatibility
export const useManifest = (patterns: ManifestPattern[]) => {
  const manifestCore = useManifestCore(patterns);
  
  // Ensure visualSpeed and exposureTime are properly handled as separate controls
  const enhancedManifestCore = {
    ...manifestCore,
    setVisualSpeed: manifestCore.setVisualSpeed || manifestCore.setExposureTime,
    visualSpeed: manifestCore.visualSpeed || manifestCore.exposureTime,
  };
  
  return enhancedManifestCore;
};
