
import { useRef, useCallback, useState, useEffect } from 'react';

export function usePendulumAudio() {
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.1);

  // Clean up audio context when component unmounts
  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current = null;
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(console.error);
        audioContextRef.current = null;
      }
    };
  }, []);

  const startPendulumSound = useCallback((customVolume?: number) => {
    try {
      // If already playing, stop first
      if (isPlaying) {
        stopPendulumSound();
      }

      // Inicializar contexto de audio
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
      
      // Crear oscilador
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 174; // Frecuencia relacionada con el péndulo
      
      // Configurar volumen
      const actualVolume = customVolume !== undefined ? customVolume : volume;
      gainNode.gain.value = actualVolume; // volumen muy bajo
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.start();
      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;
      setIsPlaying(true);
      
      return true;
    } catch (error) {
      console.error("Error al iniciar el audio del péndulo:", error);
      return false;
    }
  }, [volume, isPlaying]);

  const stopPendulumSound = useCallback(() => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(console.error);
      audioContextRef.current = null;
    }
    
    setIsPlaying(false);
  }, []);

  const changeVolume = useCallback((newVolume: number) => {
    setVolume(newVolume);
    if (gainNodeRef.current && isPlaying) {
      gainNodeRef.current.gain.value = newVolume;
    }
  }, [isPlaying]);

  return {
    startPendulumSound,
    stopPendulumSound,
    changeVolume,
    isPlaying,
    volume
  };
}
