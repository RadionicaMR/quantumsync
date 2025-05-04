
import { useState, useCallback } from 'react';

export const useOscillators = () => {
  const [frequency, setFrequency] = useState<number[]>([528]);
  const [intensity, setIntensity] = useState<number[]>([50]);
  const [useHeadphones, setUseHeadphones] = useState<boolean>(true);

  const setupOscillators = useCallback((
    audioContext: AudioContext,
    oscillatorRef: React.MutableRefObject<OscillatorNode | null>,
    harmonicOscillatorRef: React.MutableRefObject<OscillatorNode | null>,
    currentFrequency: number
  ) => {
    if (!audioContext) {
      console.error("No audio context provided to setupOscillators");
      return false;
    }
    
    try {
      // Clean up any existing oscillators first
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
          oscillatorRef.current.disconnect();
        } catch (e) {
          console.error("Error cleaning up existing oscillator:", e);
        }
        oscillatorRef.current = null;
      }
      
      if (harmonicOscillatorRef.current) {
        try {
          harmonicOscillatorRef.current.stop();
          harmonicOscillatorRef.current.disconnect();
        } catch (e) {
          console.error("Error cleaning up existing harmonic oscillator:", e);
        }
        harmonicOscillatorRef.current = null;
      }
      
      // Create main oscillator
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(currentFrequency, audioContext.currentTime);
      
      // Set volume based on intensity
      const volume = intensity[0] / 100 * 0.3; 
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Start the oscillator
      oscillator.start();
      oscillatorRef.current = oscillator;
      console.log("Main oscillator started at frequency:", currentFrequency, "Hz");
      
      // Add harmonic for low frequencies
      if (currentFrequency < 100) {
        const harmonicOscillator = audioContext.createOscillator();
        const harmonicGainNode = audioContext.createGain();
        
        harmonicOscillator.type = 'sine';
        harmonicOscillator.frequency.setValueAtTime(currentFrequency * 2, audioContext.currentTime);
        
        harmonicGainNode.gain.setValueAtTime(volume * 0.75, audioContext.currentTime);
        
        harmonicOscillator.connect(harmonicGainNode);
        harmonicGainNode.connect(audioContext.destination);
        
        harmonicOscillator.start();
        harmonicOscillatorRef.current = harmonicOscillator;
        console.log("Harmonic oscillator started at frequency:", currentFrequency * 2, "Hz");
      }
      
      return true;
    } catch (error) {
      console.error("Error setting up oscillators:", error);
      return false;
    }
  }, [intensity]);

  return {
    frequency,
    setFrequency,
    intensity,
    setIntensity,
    useHeadphones,
    setUseHeadphones,
    setupOscillators
  };
};
