
import { useCallback } from 'react';
import { useChakraSession } from '@/hooks/balance/useChakraSession';
import { useChakraProgress } from '@/hooks/balance/useChakraProgress';
import { useChakraSelection } from '@/hooks/balance/useChakraSelection';
import { useChakraControls } from '@/hooks/balance/useChakraControls';
import { useChakraTransition } from '@/hooks/balance/useChakraTransition';
import type { ChakraName } from '@/constants/chakraData';

export const useChakraSessionManager = (
  initialPersonName = '',
  initialChakraStates = []
) => {
  const {
    personName,
    setPersonName,
    duration,
    setDuration,
    isPlaying,
    setIsPlaying,
    completed,
    setCompleted,
    recordSession,
    navigateToDiagnose
  } = useChakraSession(initialPersonName);
  
  const {
    currentChakra,
    setCurrentChakra,
    progress,
    setProgress,
    resetProgress
  } = useChakraProgress();
  
  const {
    balanceOption,
    setBalanceOption,
    getChakrasToBalance
  } = useChakraSelection(initialChakraStates);
  
  const {
    notifyStart,
    notifyStop,
    notifyCompletion,
    notifyMissingName,
    notifyNoChakras,
    getCurrentFrequency
  } = useChakraControls();
  
  const {
    isTransitioning,
    handleChakraTransition,
    cleanupTimers,
    stopSound,
    lastTransitionTime,
    isPlayingRef, // Add isPlayingRef from useChakraTransition
    currentChakraRef // Add currentChakraRef for debugging
  } = useChakraTransition();

  return {
    // Session state
    personName,
    setPersonName,
    duration,
    setDuration,
    isPlaying,
    setIsPlaying,
    completed,
    setCompleted,
    recordSession,
    navigateToDiagnose,
    
    // Chakra state
    currentChakra,
    setCurrentChakra,
    progress,
    setProgress,
    resetProgress,
    
    // Selection
    balanceOption,
    setBalanceOption,
    getChakrasToBalance,
    
    // Controls and notifications
    notifyStart,
    notifyStop,
    notifyCompletion,
    notifyMissingName,
    notifyNoChakras,
    getCurrentFrequency,
    
    // Transition management
    isTransitioning,
    handleChakraTransition,
    cleanupTimers,
    stopSound,
    lastTransitionTime,
    isPlayingRef, // Export isPlayingRef
    currentChakraRef // Export currentChakraRef for debugging
  };
};
