
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
    if (state.isManifestActive) {
      stopManifestation();
    }
    state.setSelectedPattern(patternId);
    stopSubliminalAudio();
  };

  return {
    handleTabChange,
    selectPattern,
  };
};
