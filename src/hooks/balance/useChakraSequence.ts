
import { useState, useCallback, useRef } from 'react';
import type { ChakraName } from '@/constants/chakraData';

export const useChakraSequence = () => {
  // State for transition control
  const [lastTransitionTime, setLastTransitionTime] = useState<number>(0);
  const lastChakraProcessed = useRef<string | null>(null);
  
  const completeSession = useCallback((
    setIsPlaying: (value: boolean) => void,
    setCompleted: (value: boolean) => void,
    setCurrentChakra: (value: ChakraName | '') => void,
    setProgress: (value: number) => void,
    stopSound: () => void,
    notifyCompletion: () => void,
    recordSession: () => void,
    isTransitioning: React.MutableRefObject<boolean>
  ) => {
    console.log("All chakras have been balanced");
    
    // Update states
    setIsPlaying(false);
    setCompleted(true);
    setCurrentChakra('');
    setProgress(0);
    
    // Stop sound and notify
    stopSound();
    notifyCompletion();
    
    // Record session
    recordSession();
    
    // Reset transition flag
    isTransitioning.current = false;
    lastChakraProcessed.current = null;
  }, []);

  const moveToNextChakra = useCallback((
    isPlaying: boolean,
    currentChakra: ChakraName | '',
    getChakrasToBalance: () => ChakraName[],
    isTransitioning: React.MutableRefObject<boolean>,
    cleanupTimers: () => void,
    stopSound: () => void,
    setCurrentChakra: (chakra: ChakraName | '') => void,
    setProgress: (progress: number) => void,
    handleChakraTransition: (
      currentChakra: ChakraName | '',
      nextChakra: ChakraName,
      isPlaying: boolean,
      duration: number[],
      setProgress: (progress: number) => void,
      onComplete: () => void
    ) => void,
    completeSessionFn: () => void,
    duration: number[]
  ) => {
    console.log("moveToNextChakra called, isPlaying:", isPlaying);
    
    // Control state: If already transitioning, exit
    if (isTransitioning.current) {
      console.log("Already transitioning, skipping moveToNextChakra");
      return;
    }
    
    // Frequency control: Avoid multiple calls in a short time
    const now = Date.now();
    if ((now - lastTransitionTime) < 800) {
      console.log("Throttling rapid transitions - waiting before processing next transition");
      setTimeout(() => {
        moveToNextChakra(
          isPlaying,
          currentChakra,
          getChakrasToBalance,
          isTransitioning,
          cleanupTimers,
          stopSound,
          setCurrentChakra,
          setProgress,
          handleChakraTransition,
          completeSessionFn,
          duration
        );
      }, 1000);
      return;
    }
    
    // Update last transition time
    setLastTransitionTime(now);
    
    // Mark start of transition
    isTransitioning.current = true;
    
    try {
      // Get updated list of chakras to balance
      const chakrasToBalance = getChakrasToBalance();
      console.log("Chakras to balance:", chakrasToBalance);
      
      // If no chakras to process, finish
      if (!chakrasToBalance || chakrasToBalance.length === 0) {
        console.log("No chakras to balance, completing session");
        completeSessionFn();
        return;
      }
      
      // Find current index
      const currentIndex = currentChakra ? chakrasToBalance.indexOf(currentChakra as ChakraName) : -1;
      console.log(`Current chakra: ${currentChakra}, Index: ${currentIndex}, Total: ${chakrasToBalance.length}`);
      
      // Always clean up existing timers
      cleanupTimers();
      stopSound();
      
      // Check if we have more chakras to process
      if (currentIndex < chakrasToBalance.length - 1) {
        // Get next chakra
        const nextChakra = chakrasToBalance[currentIndex + 1];
        console.log(`Moving to next chakra: ${nextChakra}`);
        
        // Check if we're in a loop processing the same chakra
        if (lastChakraProcessed.current === nextChakra) {
          console.warn(`Possible loop detected with chakra: ${nextChakra}`);
          
          // Avoid the loop by forcing an additional advancement if possible
          if (currentIndex + 2 < chakrasToBalance.length) {
            const skipToChakra = chakrasToBalance[currentIndex + 2];
            console.log(`Skipping to chakra: ${skipToChakra} to break potential loop`);
            
            // Update current chakra
            setCurrentChakra(skipToChakra);
            lastChakraProcessed.current = skipToChakra;
            
            // Handle transition to skipped chakra
            handleChakraTransition(
              currentChakra || '',
              skipToChakra,
              isPlaying,
              duration,
              setProgress,
              () => moveToNextChakra(
                isPlaying,
                skipToChakra,
                getChakrasToBalance,
                isTransitioning,
                cleanupTimers,
                stopSound,
                setCurrentChakra,
                setProgress,
                handleChakraTransition,
                completeSessionFn,
                duration
              )
            );
          } else {
            // If we can't advance more, complete the session
            completeSessionFn();
          }
        } else {
          // Update current chakra
          setCurrentChakra(nextChakra);
          lastChakraProcessed.current = nextChakra;
          
          // Handle transition to next chakra
          handleChakraTransition(
            currentChakra || '',
            nextChakra,
            isPlaying,
            duration,
            setProgress,
            () => moveToNextChakra(
              isPlaying,
              nextChakra,
              getChakrasToBalance,
              isTransitioning,
              cleanupTimers,
              stopSound,
              setCurrentChakra,
              setProgress,
              handleChakraTransition,
              completeSessionFn,
              duration
            )
          );
        }
      } else {
        // Session completed
        completeSessionFn();
      }
      
    } catch (error) {
      console.error("Error in moveToNextChakra:", error);
      isTransitioning.current = false;
    }
  }, [lastTransitionTime]);

  return {
    lastTransitionTime,
    setLastTransitionTime,
    lastChakraProcessed,
    completeSession,
    moveToNextChakra
  };
};
