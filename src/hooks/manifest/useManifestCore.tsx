
import React, { useCallback, useEffect } from 'react';
import { ManifestPattern } from '@/data/manifestPatterns';
import { useManifestState } from './useManifestState';
import { useManifestAudio } from './useManifestAudio';
import { useManifestSubliminal } from './useManifestSubliminal';
import { useManifestSession } from './useManifestSession';
import { useManifestUtils } from './useManifestUtils';
import { useManifestImageControl } from './useManifestImageControl';
import { useSessionRecording } from '@/hooks/useSessionRecording';

export const useManifestCore = (patterns: ManifestPattern[]) => {
  const state = useManifestState();
  const audio = useManifestAudio();
  const subliminal = useManifestSubliminal();
  // Track session's isManifestActive to sync with imageControl
  const [sessionActive, setSessionActive] = React.useState(false);
  const imageControl = useManifestImageControl(sessionActive, state.visualSpeed);
  const utils = useManifestUtils();
  const session = useManifestSession(imageControl.startImageAlternation, imageControl.stopImageAlternation);
  const { recordSession: recordToDatabase } = useSessionRecording();

  // Sync sessionActive with session's isManifestActive
  useEffect(() => {
    setSessionActive(session.isManifestActive);
  }, [session.isManifestActive]);

  // Enhanced startManifestation that syncs state and starts audio
  const startManifestationSynced = useCallback((intention?: string) => {
    setSessionActive(true);
    
    // CRITICAL: Start audio synchronously within user gesture for Safari compatibility
    if (state.manifestSound) {
      console.log("Starting manifestation audio at frequency:", state.manifestFrequency[0]);
      audio.startAudio(state.manifestFrequency[0]);
    }
    
    session.startManifestation(intention);
  }, [session, state.manifestSound, state.manifestFrequency, audio]);

  // Enhanced stopManifestation that saves all state data
  const stopManifestationWithFullData = useCallback(async () => {
    // Capture state before stopping
    const fullSessionData = {
      intention: state.intention,
      indefiniteMode: state.indefiniteTime,
      frequency: state.manifestFrequency[0],
      exposureTime: state.exposureTime[0],
      visualSpeed: state.visualSpeed[0],
      selectedPattern: state.selectedPattern,
      receptorName: state.receptorName,
      rate1: state.rate1,
      rate2: state.rate2,
      rate3: state.rate3,
      patternImage: state.patternImage,
      receptorImage: state.receptorImage,
      patternImages: state.patternImages,
      receptorImages: state.receptorImages,
      manifestSound: state.manifestSound,
      activeTab: state.activeTab,
      completedAt: new Date().toISOString()
    };

    // Record to database
    const patientId = state.receptorName || state.intention;
    if (patientId) {
      await recordToDatabase(patientId, 'manifestation', fullSessionData);
    }

    // Stop audio
    audio.stopAudio();

    setSessionActive(false);
    session.stopManifestation();
  }, [state, session, recordToDatabase, audio]);

  return {
    ...state,
    ...utils,
    ...imageControl,
    ...audio,
    
    startManifestation: startManifestationSynced,
    stopManifestation: stopManifestationWithFullData,
    
    ...subliminal,
    
    backgroundModeActive: audio.backgroundModeActive || subliminal.backgroundModeActive,
    
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
    }
  };
};
