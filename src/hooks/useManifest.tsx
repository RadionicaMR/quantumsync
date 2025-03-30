
import { useManifestCore } from './manifest/useManifestCore';
import { ManifestPattern } from '@/data/manifestPatterns';

// Re-export with the same interface to maintain backward compatibility
export const useManifest = (patterns: ManifestPattern[]) => {
  return useManifestCore(patterns);
};
