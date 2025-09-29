
import { useState, useRef, useEffect } from 'react';
import { useAudioContext } from './useAudioContext';
import { useOscillators } from './useOscillators';
import { useTimer } from './useTimer';
import { useBackgroundMode } from './useBackgroundMode';

export const useTreatmentAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const isStoppingRef = useRef<boolean>(false);
  const isStartingRef = useRef<boolean>(false);
  const treatmentActiveRef = useRef<boolean>(false);
  const audioMonitorIntervalRef = useRef<number | null>(null);

  // Import other hooks
  const { 
    oscillatorRef, 
    harmonicOscillatorRef, 
    audioContextRef, 
    isAudioInitializedRef,
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
    clearTimer,
    isRunningRef
  } = useTimer();

  // Function to monitor and maintain audio playback
  const startAudioMonitor = () => {
    // Clear any existing monitor
    if (audioMonitorIntervalRef.current) {
      window.clearInterval(audioMonitorIntervalRef.current);
    }

    console.log("Starting audio monitor to prevent audio cuts");
    
    audioMonitorIntervalRef.current = window.setInterval(() => {
      if (!treatmentActiveRef.current || isStoppingRef.current) {
        return;
      }

      const context = audioContextRef.current;
      if (!context) {
        console.warn("Audio context lost during treatment");
        return;
      }

      // Check if audio context is suspended and resume it
      if (context.state === 'suspended') {
        console.warn("Audio context suspended - resuming...");
        context.resume()
          .then(() => {
            console.log("Audio context resumed successfully");
          })
          .catch(err => {
            console.error("Failed to resume audio context:", err);
          });
      }

      // Verify oscillators are still active
      const mainOsc = oscillatorRef.current;
      const harmOsc = harmonicOscillatorRef.current;
      
      if (!mainOsc || !harmOsc) {
        console.warn("Oscillators lost - attempting restart");
        restartAudio();
      }
    }, 2000); // Check every 2 seconds
  };

  const stopAudioMonitor = () => {
    if (audioMonitorIntervalRef.current) {
      window.clearInterval(audioMonitorIntervalRef.current);
      audioMonitorIntervalRef.current = null;
      console.log("Audio monitor stopped");
    }
  };

  // Function to stop audio when timer completes
  const stopAudioOnTimerComplete = () => {
    console.log("Timer completed - stopping audio treatment");
    stopAudio();
  };

  // Function to restart audio after background mode
  const restartAudio = () => {
    try {
      if (isStoppingRef.current || !treatmentActiveRef.current) {
        console.log("Cannot restart audio: treatment is stopping or not active");
        return;
      }

      console.log("Attempting to restart audio...");
      
      // Initialize audio context
      const audioContext = createAudioContext();
      if (!audioContext) {
        console.error("Failed to create audio context during restart");
        return;
      }
      
      // Setup oscillators
      const success = setupOscillators(audioContext, oscillatorRef, harmonicOscillatorRef, frequency[0]);
      
      if (success) {
        console.log("Audio successfully restarted at frequency:", frequency[0]);
      } else {
        console.error("Failed to setup oscillators during restart");
      }
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

  // Start the audio treatment
  const startAudio = () => {
    // Guard against multiple starts or when stopping is in progress
    if (isPlaying || isStoppingRef.current || isStartingRef.current) {
      console.log("Cannot start audio: already playing, stopping, or starting");
      return;
    }
    
    console.log("=== STARTING TREATMENT ===");
    
    // Set flags to prevent concurrent operations
    isStartingRef.current = true;
    treatmentActiveRef.current = true;
    
    try {
      // First ensure any previous audio resources are cleaned up
      cleanupAudioResources();
      
      // Force a small delay to ensure cleanup completes
      setTimeout(() => {
        try {
          // Create new audio context
          const audioContext = createAudioContext();
          
          if (!audioContext) {
            console.error("Failed to create AudioContext");
            handleStartFailure();
            return;
          }
          
          console.log("AudioContext created, state:", audioContext.state);
          
          // Make sure the audio context is running
          if (audioContext.state !== "running") {
            audioContext.resume()
              .then(() => {
                console.log("AudioContext resumed successfully");
                completeAudioStart();
              })
              .catch(error => {
                console.error("Failed to resume AudioContext:", error);
                handleStartFailure();
              });
          } else {
            completeAudioStart();
          }
        } catch (error) {
          console.error("Error during audio start:", error);
          handleStartFailure();
        }
      }, 300);
    } catch (error) {
      console.error("Critical error starting treatment:", error);
      handleStartFailure();
    }
  };
  
  // Helper function to handle start failure
  const handleStartFailure = () => {
    console.error("Failed to start audio treatment");
    cleanupAudioResources();
    clearTimer();
    isStartingRef.current = false;
    treatmentActiveRef.current = false;
  };
  
  // Complete the audio start process after context is ready
  const completeAudioStart = () => {
    try {
      if (!audioContextRef.current) {
        console.error("Audio context not available for oscillator setup");
        handleStartFailure();
        return;
      }
      
      // Setup the oscillators
      const success = setupOscillators(
        audioContextRef.current,
        oscillatorRef,
        harmonicOscillatorRef,
        frequency[0]
      );
      
      if (!success) {
        console.error("Failed to setup oscillators");
        handleStartFailure();
        return;
      }
      
      // IMPORTANT: First update state
      setIsPlaying(true);
      
      // Start audio monitoring to prevent cuts
      startAudioMonitor();
      
      // Then start the timer with completion callback
      const durationInMinutes = duration[0];
      startTimer(durationInMinutes, stopAudioOnTimerComplete);
      
      console.log("Treatment started successfully:",
        "Frequency:", frequency[0],
        "Duration:", durationInMinutes,
        "minutes");
        
    } catch (error) {
      console.error("Error during oscillator setup:", error);
      handleStartFailure();
    } finally {
      // Clear starting flag regardless of success/failure
      isStartingRef.current = false;
    }
  };

  // Stop the audio treatment
  const stopAudio = () => {
    console.log("=== STOPPING TREATMENT ===");
    
    // Set stopping flag to prevent concurrent operations
    isStoppingRef.current = true;
    treatmentActiveRef.current = false;
    
    // Stop audio monitoring
    stopAudioMonitor();
    
    // Clear timer first
    clearTimer();
    
    // Then clean up audio resources
    cleanupAudioResources();
    
    // Update state after a delay to ensure proper sequencing
    setTimeout(() => {
      setIsPlaying(false);
      setBackgroundModeActive(false);
      pausedTimeRemainingRef.current = null;
      isStoppingRef.current = false;
      console.log("Treatment stopped completely");
    }, 300);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudioMonitor();
      if (isPlaying) {
        stopAudio();
      }
      console.log("useTreatmentAudio hook unmounted and cleaned up");
    };
  }, []);

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
