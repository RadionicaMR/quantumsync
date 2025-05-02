
import { useRef, useCallback } from 'react';
import { useChakraAudio } from '@/hooks/useChakraAudio';
import { useChakraTimers } from '@/hooks/balance/useChakraTimers';
import { useChakraNotifications } from '@/hooks/balance/useChakraNotifications';
import type { ChakraName } from '@/constants/chakraData';

export const useChakraTransition = () => {
  // Reference to track if we're already transitioning
  const isTransitioning = useRef(false);
  
  const { playChakraSound, stopSound } = useChakraAudio();
  const { cleanupTimers, startProgressTimer } = useChakraTimers();
  const { notifyChakraChange } = useChakraNotifications();
  
  const handleChakraTransition = useCallback((
    currentChakra: ChakraName | '',
    nextChakra: ChakraName,
    isPlaying: boolean,
    duration: number[],
    setProgress: (progress: number) => void,
    onComplete: () => void
  ) => {
    // Reset progress and set next chakra
    setProgress(0);
    
    // Notify and play sound for the next chakra
    if (currentChakra) {
      notifyChakraChange(currentChakra as ChakraName, nextChakra);
    }
    
    // CRITICAL FIX: Always ensure we stop previous sounds before playing new ones
    stopSound();
    
    // Play the sound for the next chakra
    playChakraSound(nextChakra);
    
    // Start new timer for this chakra if we're playing
    if (isPlaying) {
      console.log(`Starting timer for chakra ${nextChakra} with duration ${duration[0]} minutes`);
      startProgressTimer(
        nextChakra, 
        duration, 
        true, 
        setProgress, 
        onComplete
      );
    }
  }, [notifyChakraChange, playChakraSound, startProgressTimer, stopSound]);

  return {
    isTransitioning,
    handleChakraTransition,
    cleanupTimers,
    stopSound
  };
};
