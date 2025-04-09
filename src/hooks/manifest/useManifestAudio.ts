
import { useRef } from 'react';
import { ManifestAudio } from './types';

export const useManifestAudio = (): ManifestAudio => {
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const harmonicOscillatorRef = useRef<OscillatorNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const startAudio = (frequency: number) => {
    try {
      // Initialize audio context
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
      
      // Create oscillator for base frequency
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
      
      // For low frequencies, add a harmonic to make it more audible on small speakers
      if (frequency < 100) {
        const harmonicOscillator = audioContextRef.current.createOscillator();
        const harmonicGainNode = audioContextRef.current.createGain();
        
        // Create harmonic at 2x the frequency with lower volume
        harmonicOscillator.type = 'sine';
        harmonicOscillator.frequency.value = frequency * 2;
        harmonicGainNode.gain.value = 0.15; // slightly lower volume for harmonic
        
        harmonicOscillator.connect(harmonicGainNode);
        harmonicGainNode.connect(audioContextRef.current.destination);
        
        harmonicOscillator.start();
        harmonicOscillatorRef.current = harmonicOscillator;
      }
    } catch (error) {
      console.error("Error starting manifestation audio:", error);
    }
  };

  const stopAudio = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }
    
    if (harmonicOscillatorRef.current) {
      harmonicOscillatorRef.current.stop();
      harmonicOscillatorRef.current = null;
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
