
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

  // Logs para depuración
  useEffect(() => {
    console.log("useManifestAudio - Montado");
    return () => {
      console.log("useManifestAudio - Desmontado, limpiando recursos");
      stopAudio();
    }
  }, []);

  const handleVisibilityChange = () => {
    if (document.hidden && oscillatorRef.current !== null) {
      console.log("App pasó a segundo plano durante manifestación, guardando estado");
      setBackgroundModeActive(true);
      
      // El oscilador debe detenerse porque el AudioContext se suspende
      if (oscillatorRef.current) {
        console.log("Deteniendo oscilador actual para segundo plano");
        oscillatorRef.current.stop();
        oscillatorRef.current = null;
      }
      
      if (harmonicOscillatorRef.current) {
        console.log("Deteniendo oscilador armónico para segundo plano");
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

  // Add event listener for visibilitychange
  useEffect(() => {
    console.log("Registrando event listener para visibilitychange");
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      console.log("Removiendo event listener para visibilitychange");
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [backgroundModeActive]);

  const startAudio = (frequency: number) => {
    try {
      console.log("Iniciando audio de manifestación con frecuencia:", frequency);
      
      // Detener audio anterior si existe
      if (oscillatorRef.current || audioContextRef.current) {
        console.log("Limpiando audio previo antes de crear uno nuevo");
        stopAudio();
      }
      
      // Save current frequency for restoration if needed
      currentFrequencyRef.current = frequency;
      
      // Initialize audio context
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
      
      console.log("Contexto de audio creado:", audioContextRef.current);
      
      // Create oscillator for base frequency
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      
      // Set volume
      gainNode.gain.value = 0.2; // low volume
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      console.log("Oscilador configurado y conectado");
      
      oscillator.start();
      oscillatorRef.current = oscillator;
      
      console.log("Oscilador principal iniciado");
      
      // For low frequencies, add a harmonic to make it more audible on small speakers
      if (frequency < 100) {
        console.log("Añadiendo armónico para frecuencia baja");
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
        console.log("Oscilador armónico iniciado");
      }
      console.log("Audio de manifestación iniciado correctamente con frecuencia:", frequency);
    } catch (error) {
      console.error("Error starting manifestation audio:", error);
    }
  };

  const stopAudio = () => {
    console.log("Deteniendo audio de manifestación");
    
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        console.log("Oscilador principal detenido");
      } catch (e) {
        console.error("Error al detener oscilador principal:", e);
      }
      oscillatorRef.current = null;
    }
    
    if (harmonicOscillatorRef.current) {
      try {
        harmonicOscillatorRef.current.stop();
        console.log("Oscilador armónico detenido");
      } catch (e) {
        console.error("Error al detener oscilador armónico:", e);
      }
      harmonicOscillatorRef.current = null;
    }
    
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
        console.log("Contexto de audio cerrado");
      } catch (e) {
        console.error("Error al cerrar contexto de audio:", e);
      }
      audioContextRef.current = null;
    }
    
    currentFrequencyRef.current = null;
    setBackgroundModeActive(false);
    console.log("Audio de manifestación detenido completamente");
  };

  return {
    oscillatorRef,
    audioContextRef,
    startAudio,
    stopAudio,
    backgroundModeActive
  };
};
