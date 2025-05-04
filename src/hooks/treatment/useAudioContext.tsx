
import { useRef, useEffect } from 'react';

export const useAudioContext = () => {
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const harmonicOscillatorRef = useRef<OscillatorNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  const createAudioContext = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) {
        console.error("AudioContext not supported");
        return null;
      }
      
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch (e) {
          console.error("Error closing existing audio context:", e);
        }
      }
      
      audioContextRef.current = new AudioContext();
      console.log("New AudioContext created, state:", audioContextRef.current.state);
      return audioContextRef.current;
    } catch (error) {
      console.error("Error creating audio context:", error);
      return null;
    }
  };

  const cleanupAudioResources = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        console.log("Main oscillator stopped");
      } catch (e) {
        console.error("Error stopping oscillator:", e);
      }
      oscillatorRef.current = null;
    }
    
    if (harmonicOscillatorRef.current) {
      try {
        harmonicOscillatorRef.current.stop();
        console.log("Harmonic oscillator stopped");
      } catch (e) {
        console.error("Error stopping harmonic oscillator:", e);
      }
      harmonicOscillatorRef.current = null;
    }
    
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
        console.log("Audio context closed");
      } catch (e) {
        console.error("Error closing audio context:", e);
      }
      audioContextRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      cleanupAudioResources();
    };
  }, []);

  return {
    oscillatorRef,
    harmonicOscillatorRef,
    audioContextRef,
    createAudioContext,
    cleanupAudioResources
  };
};
