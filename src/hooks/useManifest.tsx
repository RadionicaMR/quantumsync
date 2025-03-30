
import { Pattern } from '@/data/manifestPatterns';
import { useManifestCore } from './manifest/useManifestCore';

// Re-export with the same interface to maintain backward compatibility
export const useManifest = (patterns: Pattern[]) => {
  return useManifestCore(patterns);
};
