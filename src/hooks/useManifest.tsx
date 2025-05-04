
import { useManifestCore } from './manifest/useManifestCore';
import { ManifestPattern } from '@/data/manifestPatterns';

// Re-export with the same interface to maintain backward compatibility
export const useManifest = (patterns: ManifestPattern[]) => {
  const manifestCore = useManifestCore(patterns);
  
  // Return the core directly to avoid any transformation issues
  return manifestCore;
};
