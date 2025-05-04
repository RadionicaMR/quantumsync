
import { useState, useRef } from 'react';
import { useAudioContext } from './useAudioContext';
import { useOscillators } from './useOscillators';
import { useTimer } from './useTimer';
import { useBackgroundMode } from './useBackgroundMode';

export const useTreatmentAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const isStoppingRef = useRef<boolean>(false);
  const isStartingRef = useRef<boolean>(false);

  // Import other hooks
  const { 
    oscillatorRef, 
    harmonicOscillatorRef, 
    audioContextRef, 
    createAudioContext, 
    cleanupAudioResources 
  } = useAudioContext();
  
  const { 
    frequency, 
    setFrequency, 
    intensity, 
    setIntensity, 
    useHeadphones, 
    setUseHeadphones, 
    setupOscillators 
  } = useOscillators();
  
  const { 
    timeRemaining, 
    setTimeRemaining, 
    duration, 
    setDuration, 
    formatTime, 
    startTimer, 
    clearTimer 
  } = useTimer();

  // Function to restart audio after background mode
  const restartAudio = () => {
    try {
      if (isStoppingRef.current) {
        console.log("Audio is currently stopping, can't restart yet");
        return;
      }

      // Initialize audio context
      const audioContext = createAudioContext();
      if (!audioContext) return;
      
      // Setup oscillators
      setupOscillators(audioContext, oscillatorRef, harmonicOscillatorRef, frequency[0]);
      
      console.log("Audio successfully restarted at frequency:", frequency[0]);
    } catch (error) {
      console.error("Error restarting audio:", error);
    }
  };

  // Background mode handling
  const { 
    backgroundModeActive, 
    setBackgroundModeActive, 
    pausedTimeRemainingRef 
  } = useBackgroundMode(
    isPlaying, 
    cleanupAudioResources,
    restartAudio,
    setTimeRemaining
  );

  const startAudio = () => {
    // Prevent multiple concurrent starts
    if (isPlaying || isStoppingRef.current || isStartingRef.current) {
      console.log("Audio already playing or stopping or starting, not starting again");
      return;
    }
    
    // Set starting flag
    isStartingRef.current = true;
    
    console.log(`Starting audio with frequency: ${frequency[0]} Hz, duration: ${duration[0]} minutes`);
    
    try {
      // Stop any existing audio
      cleanupAudioResources();
      
      // Create a new AudioContext
      const audioContext = createAudioContext();
      if (!audioContext) {
        isStartingRef.current = false;
        return;
      }
      
      console.log("AudioContext created, state:", audioContext.state);
      
      // Make sure the audio context is running
      if (audioContext.state !== "running") {
        audioContext.resume().then(() => {
          console.log("AudioContext resumed successfully, state:", audioContext?.state);
          setupAudioOscillators();
        }).catch(error => {
          console.error("Failed to resume AudioContext:", error);
          isStartingRef.current = false;
          cleanupAudioResources();
        });
      } else {
        setupAudioOscillators();
      }
    } catch (error) {
      console.error("Error starting audio treatment:", error);
      cleanupAudioResources();
      isStartingRef.current = false;
    }
  };
  
  const setupAudioOscillators = () => {
    if (!audioContextRef.current) {
      console.error("AudioContext not initialized");
      isStartingRef.current = false;
      return;
    }
    
    try {
      // Setup oscillators using the imported function
      const success = setupOscillators(
        audioContextRef.current, 
        oscillatorRef, 
        harmonicOscillatorRef, 
        frequency[0]
      );
      
      if (!success) {
        throw new Error("Failed to setup oscillators");
      }
      
      // IMPORTANT: First set isPlaying to true BEFORE starting timer
      setIsPlaying(true);
      
      // Then start the timer
      const durationInMinutes = duration[0];
      startTimer(durationInMinutes);
      
      console.log("Audio treatment fully initialized with:", 
                "Frequency:", frequency[0], 
                "Duration:", durationInMinutes, "minutes");
    } catch (error) {
      console.error("Error setting up audio oscillators:", error);
      cleanupAudioResources();
    } finally {
      // Clear starting flag
      isStartingRef.current = false;
    }
  };

  const stopAudio = () => {
    console.log("Stopping treatment audio...");
    
    // Set the stopping flag to prevent race conditions
    isStoppingRef.current = true;
    
    // Clean up audio resources
    cleanupAudioResources();
    
    // Clear timer
    clearTimer();
    
    // Reset state after a small delay to ensure UI updates properly
    setTimeout(() => {
      setIsPlaying(false);
      setBackgroundModeActive(false);
      pausedTimeRemainingRef.current = null;
      isStoppingRef.current = false;
      console.log("Audio treatment fully stopped");
    }, 100);
  };

  return {
    isPlaying,
    frequency,
    setFrequency,
    duration,
    setDuration,
    intensity,
    setIntensity,
    timeRemaining,
    useHeadphones,
    setUseHeadphones,
    formatTime,
    startAudio,
    stopAudio,
    backgroundModeActive
  };
};
