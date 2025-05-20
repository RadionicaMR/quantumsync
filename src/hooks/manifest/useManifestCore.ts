
import { useManifestState } from './useManifestState';
import { useManifestSubliminal } from './useManifestSubliminal';
import { useManifestSession } from './useManifestSession';
import { useManifestUtils } from './useManifestUtils';
import { useManifestAudio } from './useManifestAudio';
import { ManifestPattern } from '@/data/manifestPatterns';
import { useManifestImageControl } from './useManifestImageControl';
import { useCallback } from 'react';

export const useManifestCore = (patterns: ManifestPattern[]) => {
  const state = useManifestState();
  const subliminal = useManifestSubliminal();
  const imageControl = useManifestImageControl(state.isManifestActive, state.visualSpeed);
  const session = useManifestSession(
    imageControl.startImageAlternation,
    imageControl.stopImageAlternation
  );
  const utils = useManifestUtils();
  const audio = useManifestAudio();

  // Create wrapper functions to connect the session and image control
  const startManifestationWithVisualization = useCallback((intention?: string) => {
    // First start the session
    session.startManifestation(intention);
    
    // Get the function to start image alternation and call it with the current state
    const startImageAlternationWithState = session.getStartImageAlternation();
    
    // This function will be called by components that have access to currentImage and setCurrentImage
    return startImageAlternationWithState;
  }, [session]);
  
  const stopManifestationWithVisualization = useCallback(() => {
    // First stop the session
    session.stopManifestation();
    
    // Get the function to stop image alternation and call it
    const stopImageAlternationWithState = session.getStopImageAlternation();
    
    // This function will be called by components that have access to setCurrentImage
    return stopImageAlternationWithState;
  }, [session]);

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
    
    // Session control with visualization
    startManifestation: startManifestationWithVisualization,
    stopManifestation: stopManifestationWithVisualization,
    
    // Original session properties
    isManifestActive: session.isManifestActive,
    timeRemaining: session.timeRemaining,
    formatTimeRemaining: session.formatTimeRemaining,
    currentIntention: session.currentIntention,
    indefiniteTime: session.indefiniteTime,
    setIndefiniteTime: session.setIndefiniteTime,
    
    // Subliminal audio
    ...subliminal,
    
    // Background mode indicator
    backgroundModeActive: audio.backgroundModeActive || subliminal.backgroundModeActive,
    
    // We don't need to provide patterns here, they're already passed from Manifest.tsx
    patterns
  };
};
