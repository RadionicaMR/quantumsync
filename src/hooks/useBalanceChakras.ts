
import { useEffect, useCallback } from 'react';
import { useChakraSessionManager } from '@/hooks/balance/useChakraSessionManager';
import { useChakraSequence } from '@/hooks/balance/useChakraSequence';
import { useBalanceActions } from '@/hooks/balance/useBalanceActions';

export const useBalanceChakras = (initialPersonName = '', initialChakraStates = []) => {
  // Get all the core functionality from our smaller hooks
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
    navigateToDiagnose,
    currentChakra,
    setCurrentChakra,
    progress,
    setProgress,
    balanceOption,
    setBalanceOption,
    getChakrasToBalance,
    notifyStart,
    notifyStop,
    notifyCompletion,
    notifyMissingName,
    notifyNoChakras,
    getCurrentFrequency,
    isTransitioning,
    handleChakraTransition,
    cleanupTimers,
    stopSound
  } = useChakraSessionManager(initialPersonName, initialChakraStates);

  // Get chakra sequence management functionality
  const {
    lastTransitionTime,
    setLastTransitionTime,
    lastChakraProcessed,
    completeSession,
    moveToNextChakra: moveToNextChakraBase
  } = useChakraSequence();

  // Get balance action handlers
  const {
    startBalancing: startBalancingBase,
    stopBalancing: stopBalancingBase
  } = useBalanceActions();

  // Create a completeSession callback for this specific instance
  const handleCompleteSession = useCallback(() => {
    completeSession(
      setIsPlaying,
      setCompleted,
      setCurrentChakra,
      setProgress,
      stopSound,
      notifyCompletion,
      recordSession,
      isTransitioning
    );
  }, [
    completeSession,
    setIsPlaying,
    setCompleted,
    setCurrentChakra,
    setProgress,
    stopSound,
    notifyCompletion,
    recordSession,
    isTransitioning
  ]);

  // Create a moveToNextChakra callback for this specific instance
  const moveToNextChakraInstance = useCallback(() => {
    moveToNextChakraBase(
      isPlaying,
      currentChakra,
      getChakrasToBalance,
      isTransitioning,
      cleanupTimers,
      stopSound,
      setCurrentChakra,
      setProgress,
      handleChakraTransition,
      handleCompleteSession,
      duration
    );
  }, [
    moveToNextChakraBase,
    isPlaying,
    currentChakra,
    getChakrasToBalance,
    isTransitioning,
    cleanupTimers,
    stopSound,
    setCurrentChakra,
    setProgress,
    handleChakraTransition,
    handleCompleteSession,
    duration
  ]);

  // Create a startBalancing callback for this specific instance
  const startBalancing = useCallback(() => {
    startBalancingBase(
      personName,
      getChakrasToBalance,
      cleanupTimers,
      isTransitioning,
      setLastTransitionTime,
      lastChakraProcessed,
      setIsPlaying,
      setCurrentChakra,
      setProgress,
      setCompleted,
      handleChakraTransition,
      moveToNextChakraInstance,
      duration,
      notifyMissingName,
      notifyNoChakras,
      notifyStart
    );
  }, [
    startBalancingBase,
    personName,
    getChakrasToBalance,
    cleanupTimers,
    isTransitioning,
    setLastTransitionTime,
    lastChakraProcessed,
    setIsPlaying,
    setCurrentChakra,
    setProgress,
    setCompleted,
    handleChakraTransition,
    moveToNextChakraInstance,
    duration,
    notifyMissingName,
    notifyNoChakras,
    notifyStart
  ]);

  // Create a stopBalancing callback for this specific instance
  const stopBalancing = useCallback(() => {
    stopBalancingBase(
      cleanupTimers,
      setIsPlaying,
      setCurrentChakra,
      setProgress,
      lastChakraProcessed,
      stopSound,
      notifyStop
    );
  }, [
    stopBalancingBase,
    cleanupTimers,
    setIsPlaying,
    setCurrentChakra,
    setProgress,
    lastChakraProcessed,
    stopSound,
    notifyStop
  ]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanupTimers();
      stopSound();
    };
  }, [cleanupTimers, stopSound]);

  return {
    personName,
    setPersonName,
    duration,
    setDuration,
    isPlaying,
    currentChakra,
    progress,
    completed,
    balanceOption,
    setBalanceOption,
    startBalancing,
    stopBalancing,
    navigateToDiagnose,
    currentFrequency: getCurrentFrequency(currentChakra)
  };
};
