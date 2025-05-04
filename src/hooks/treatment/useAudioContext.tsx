
import { useRef, useEffect, useCallback } from 'react';

export const useAudioContext = () => {
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const harmonicOscillatorRef = useRef<OscillatorNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const isAudioInitializedRef = useRef<boolean>(false);
  
  const createAudioContext = useCallback(() => {
    try {
      // If we already have an audio context, return it
      if (audioContextRef.current && audioContextRef.current.state === 'running') {
        console.log("Using existing audio context");
        return audioContextRef.current;
      }
      
      // Clean up any existing context first
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
          console.log("Closed existing audio context");
        } catch (e) {
          console.error("Error closing existing audio context:", e);
        }
        audioContextRef.current = null;
      }
      
      // Create new audio context
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) {
        console.error("AudioContext not supported");
        return null;
      }
      
      const context = new AudioContext();
      audioContextRef.current = context;
      
      // Ensure the context is running
      if (context.state !== 'running') {
        context.resume()
          .then(() => {
            console.log("AudioContext resumed, state:", context.state);
            isAudioInitializedRef.current = true;
          })
          .catch(err => {
            console.error("Failed to resume AudioContext:", err);
            isAudioInitializedRef.current = false;
          });
      } else {
        isAudioInitializedRef.current = true;
      }
      
      console.log("New AudioContext created, state:", context.state);
      return context;
    } catch (error) {
      console.error("Error creating audio context:", error);
      isAudioInitializedRef.current = false;
      return null;
    }
  }, []);

  const cleanupAudioResources = useCallback(() => {
    isAudioInitializedRef.current = false;
    
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        console.log("Main oscillator stopped and disconnected");
      } catch (e) {
        console.error("Error stopping oscillator:", e);
      }
      oscillatorRef.current = null;
    }
    
    if (harmonicOscillatorRef.current) {
      try {
        harmonicOscillatorRef.current.stop();
        harmonicOscillatorRef.current.disconnect();
        console.log("Harmonic oscillator stopped and disconnected");
      } catch (e) {
        console.error("Error stopping harmonic oscillator:", e);
      }
      harmonicOscillatorRef.current = null;
    }
    
    // We'll close the audio context after a delay to prevent issues with rapid stop/start cycles
    if (audioContextRef.current) {
      setTimeout(() => {
        if (audioContextRef.current) {
          try {
            audioContextRef.current.close();
            console.log("Audio context closed");
          } catch (e) {
            console.error("Error closing audio context:", e);
          }
          audioContextRef.current = null;
        }
      }, 500);
    }
  }, []);

  useEffect(() => {
    return () => {
      cleanupAudioResources();
    };
  }, [cleanupAudioResources]);

  return {
    oscillatorRef,
    harmonicOscillatorRef,
    audioContextRef,
    isAudioInitializedRef,
    createAudioContext,
    cleanupAudioResources
  };
};
