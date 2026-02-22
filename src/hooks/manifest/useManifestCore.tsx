
import React, { useCallback, useEffect, useRef } from 'react';
import { ManifestPattern } from '@/data/manifestPatterns';
import { useManifestState } from './useManifestState';
import { useManifestAudio } from './useManifestAudio';
import { useManifestSubliminal } from './useManifestSubliminal';
import { useManifestSession } from './useManifestSession';
import { useManifestUtils } from './useManifestUtils';
import { useManifestImageControl } from './useManifestImageControl';
import { useSessionRecording } from '@/hooks/useSessionRecording';
import { useUsageTracking } from '@/hooks/useUsageTracking';

export const useManifestCore = (patterns: ManifestPattern[]) => {
  const state = useManifestState();
  const audio = useManifestAudio();
  const subliminal = useManifestSubliminal();
  const [sessionActive, setSessionActive] = React.useState(false);
  const imageControl = useManifestImageControl(sessionActive, state.visualSpeed);
  const utils = useManifestUtils();
  const session = useManifestSession(imageControl.startImageAlternation, imageControl.stopImageAlternation);
  const { recordSession: recordToDatabase } = useSessionRecording();
  const { trackSessionStart, trackSessionEnd } = useUsageTracking();
  const manifestStartTimeRef = useRef<Date | null>(null);
  const prevSessionActiveRef = useRef(false);

  // Sync sessionActive with session's isManifestActive
  useEffect(() => {
    setSessionActive(session.isManifestActive);
  }, [session.isManifestActive]);

  // CRITICAL FIX: Detect auto-completion (timer ended) and stop audio/record session
  useEffect(() => {
    if (prevSessionActiveRef.current && !session.isManifestActive) {
      // Session auto-completed via timer - clean up audio
      audio.stopAudio();
      subliminal.stopSubliminalAudio();
      setSessionActive(false);

      // Track usage end
      const actualDuration = manifestStartTimeRef.current
        ? Math.floor((new Date().getTime() - manifestStartTimeRef.current.getTime()) / 1000)
        : 0;
      trackSessionEnd({
        module: 'manifestation',
        actualDuration,
        protocolName: state.selectedPattern || 'custom',
      });
      manifestStartTimeRef.current = null;
    }
    prevSessionActiveRef.current = session.isManifestActive;
  }, [session.isManifestActive]);

  // Enhanced startManifestation that syncs state and starts audio
  const startManifestationSynced = useCallback((intention?: string) => {
    setSessionActive(true);
    manifestStartTimeRef.current = new Date();
    
    // CRITICAL: Start audio synchronously within user gesture for Safari compatibility
    if (state.manifestSound) {
      audio.startAudio(state.manifestFrequency[0]);
    }
    
    // Track usage (fire-and-forget)
    trackSessionStart({
      module: 'manifestation',
      protocolName: state.selectedPattern || 'custom',
      isPreset: state.activeTab === 'preset',
      configuredDuration: state.exposureTime[0],
      frequency: state.manifestFrequency[0],
      metadata: { intention: intention || state.intention, receptorName: state.receptorName },
    });
    
    // CRITICAL FIX: Pass exposureTime and indefiniteTime from state to session
    session.startManifestation(intention, state.exposureTime[0], state.indefiniteTime);
  }, [session, state.manifestSound, state.manifestFrequency, audio, state.selectedPattern, state.activeTab, state.exposureTime, state.intention, state.receptorName, state.indefiniteTime, trackSessionStart]);

  // Enhanced stopManifestation that saves all state data
  const stopManifestationWithFullData = useCallback(async () => {
    try {
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

      // Record to database (wrapped in try-catch to prevent crashes)
      const patientId = state.receptorName || state.intention;
      if (patientId) {
        try {
          await recordToDatabase(patientId, 'manifestation', fullSessionData);
        } catch (dbError) {
          console.error("Error recording manifestation session:", dbError);
        }
      }
    } catch (error) {
      console.error("Error in stopManifestationWithFullData:", error);
    } finally {
      // Track usage end
      const actualDuration = manifestStartTimeRef.current
        ? Math.floor((new Date().getTime() - manifestStartTimeRef.current.getTime()) / 1000)
        : 0;
      trackSessionEnd({
        module: 'manifestation',
        actualDuration,
        protocolName: state.selectedPattern || 'custom',
      });
      manifestStartTimeRef.current = null;

      // Always stop audio and session, even if recording fails
      audio.stopAudio();
      setSessionActive(false);
      session.stopManifestation();
    }
  }, [state, session, recordToDatabase, audio, trackSessionEnd]);

  return {
    ...state,
    ...utils,
    ...imageControl,
    ...audio,
    
    startManifestation: startManifestationSynced,
    stopManifestation: stopManifestationWithFullData,
    
    ...subliminal,
    
    // CRITICAL FIX: Override with session's active state (state.isManifestActive is never updated)
    isManifestActive: session.isManifestActive,
    // CRITICAL FIX: Override with session's timeRemaining (state.timeRemaining is never updated by timer)
    timeRemaining: session.timeRemaining,
    // CRITICAL FIX: Return formatTimeRemaining from session
    formatTimeRemaining: session.formatTimeRemaining,
    
    backgroundModeActive: audio.backgroundModeActive || subliminal.backgroundModeActive,
    
    handleTabChange: (tab: string) => {
      state.setActiveTab(tab);
      
      if (session.isManifestActive) {
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
