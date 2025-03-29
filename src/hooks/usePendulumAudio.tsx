
import { useRef, useCallback } from 'react';

export function usePendulumAudio() {
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const startPendulumSound = useCallback(() => {
    try {
      // Inicializar contexto de audio
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
      
      // Crear oscilador
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 174; // Frecuencia relacionada con el péndulo
      
      // Configurar volumen
      gainNode.gain.value = 0.1; // volumen muy bajo
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.start();
      oscillatorRef.current = oscillator;
    } catch (error) {
      console.error("Error al iniciar el audio del péndulo:", error);
    }
  }, []);

  const stopPendulumSound = useCallback(() => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, []);

  return {
    startPendulumSound,
    stopPendulumSound
  };
}
