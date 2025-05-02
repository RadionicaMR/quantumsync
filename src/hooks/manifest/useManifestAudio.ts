
import { useRef, useState, useEffect } from 'react';
import { ManifestAudio } from './types';

export const useManifestAudio = (): ManifestAudio & {
  backgroundModeActive: boolean;
} => {
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const harmonicOscillatorRef = useRef<OscillatorNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [backgroundModeActive, setBackgroundModeActive] = useState(false);
  const currentFrequencyRef = useRef<number | null>(null);

  const handleVisibilityChange = () => {
    if (document.hidden && oscillatorRef.current !== null) {
      console.log("App pasó a segundo plano durante manifestación, guardando estado");
      setBackgroundModeActive(true);
      
      // El oscilador debe detenerse porque el AudioContext se suspende
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current = null;
      }
      
      if (harmonicOscillatorRef.current) {
        harmonicOscillatorRef.current.stop();
        harmonicOscillatorRef.current = null;
      }
      
    } else if (!document.hidden && backgroundModeActive && currentFrequencyRef.current !== null) {
      console.log("App volvió al primer plano, restaurando manifestación con frecuencia:", currentFrequencyRef.current);
      
      // Reiniciar osciladores con la frecuencia guardada
      startAudio(currentFrequencyRef.current);
      setBackgroundModeActive(false);
    }
  };

  // Agregar event listener para visibilitychange
  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [backgroundModeActive]);

  const startAudio = (frequency: number) => {
    try {
      // Guarda la frecuencia actual para restaurar si es necesario
      currentFrequencyRef.current = frequency;
      
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
    
    currentFrequencyRef.current = null;
    setBackgroundModeActive(false);
  };

  return {
    oscillatorRef,
    audioContextRef,
    startAudio,
    stopAudio,
    backgroundModeActive
  };
};
