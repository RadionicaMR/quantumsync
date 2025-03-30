
import { useRef } from 'react';
import { ManifestAudio } from './types';

export const useManifestAudio = (): ManifestAudio => {
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const startAudio = (frequency: number) => {
    try {
      // Initialize audio context
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
      
      // Create oscillator
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      
      // Set volume
      gainNode.gain.value = 0.2; // low volume
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.start();
      oscillatorRef.current = oscillator;
    } catch (error) {
      console.error("Error starting manifestation audio:", error);
    }
  };

  const stopAudio = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  return {
    oscillatorRef,
    audioContextRef,
    startAudio,
    stopAudio,
  };
};
