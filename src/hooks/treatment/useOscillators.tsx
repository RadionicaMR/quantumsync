
import { useState } from 'react';

export const useOscillators = () => {
  const [frequency, setFrequency] = useState<number[]>([528]);
  const [intensity, setIntensity] = useState<number[]>([50]);
  const [useHeadphones, setUseHeadphones] = useState<boolean>(true);

  const setupOscillators = (
    audioContext: AudioContext,
    oscillatorRef: React.MutableRefObject<OscillatorNode | null>,
    harmonicOscillatorRef: React.MutableRefObject<OscillatorNode | null>,
    currentFrequency: number
  ) => {
    try {
      // Create oscillator
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = currentFrequency;
      
      // Set volume based on intensity
      const volume = intensity[0] / 100 * 0.3;
      gainNode.gain.value = volume;
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      oscillatorRef.current = oscillator;
      console.log("Main oscillator started at frequency:", currentFrequency);
      
      // Add harmonic for low frequencies
      if (currentFrequency < 100) {
        const harmonicOscillator = audioContext.createOscillator();
        const harmonicGainNode = audioContext.createGain();
        
        harmonicOscillator.type = 'sine';
        harmonicOscillator.frequency.value = currentFrequency * 2;
        
        harmonicGainNode.gain.value = volume * 0.75;
        
        harmonicOscillator.connect(harmonicGainNode);
        harmonicGainNode.connect(audioContext.destination);
        
        harmonicOscillator.start();
        harmonicOscillatorRef.current = harmonicOscillator;
        console.log("Harmonic oscillator started at frequency:", currentFrequency * 2);
      }
      
      return true;
    } catch (error) {
      console.error("Error setting up oscillators:", error);
      return false;
    }
  };

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
