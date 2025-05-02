
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
    stopSound,
    isPlayingRef  // Add the isPlayingRef from useChakraTransition
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
      isPlayingRef,  // Pass the isPlayingRef
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
    isPlayingRef,  // Include in dependencies
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
    // Update the isPlayingRef directly when starting
    isPlayingRef.current = true;
    
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
    notifyStart,
    isPlayingRef  // Include in dependencies
  ]);

  // Create a stopBalancing callback for this specific instance
  const stopBalancing = useCallback(() => {
    // Update the isPlayingRef directly when stopping
    isPlayingRef.current = false;
    
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
    notifyStop,
    isPlayingRef  // Include in dependencies
  ]);

  // Update isPlayingRef whenever isPlaying changes
  useEffect(() => {
    console.log(`Updating isPlayingRef to ${isPlaying}`);
    isPlayingRef.current = isPlaying;
  }, [isPlaying, isPlayingRef]);

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
