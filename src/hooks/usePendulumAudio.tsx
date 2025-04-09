
import { useRef, useCallback, useState, useEffect } from 'react';

export function usePendulumAudio() {
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const harmonicOscillatorRef = useRef<OscillatorNode | null>(null);
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
      
      if (harmonicOscillatorRef.current) {
        harmonicOscillatorRef.current.stop();
        harmonicOscillatorRef.current = null;
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
      const frequency = 174; // Frecuencia relacionada con el péndulo
      oscillator.frequency.value = frequency;
      
      // Configurar volumen
      const actualVolume = customVolume !== undefined ? customVolume : volume;
      gainNode.gain.value = actualVolume; // volumen bajo
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.start();
      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;
      
      // Si la frecuencia es baja, añadir armónico para mejorar la audibilidad
      if (frequency < 100) {
        const harmonicOscillator = audioContextRef.current.createOscillator();
        const harmonicGainNode = audioContextRef.current.createGain();
        
        // Crear armónico a 2x la frecuencia con menor volumen
        harmonicOscillator.type = 'sine';
        harmonicOscillator.frequency.value = frequency * 2;
        harmonicGainNode.gain.value = actualVolume * 0.75; // volumen ligeramente menor para el armónico
        
        harmonicOscillator.connect(harmonicGainNode);
        harmonicGainNode.connect(audioContextRef.current.destination);
        
        harmonicOscillator.start();
        harmonicOscillatorRef.current = harmonicOscillator;
      }
      
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
    
    if (harmonicOscillatorRef.current) {
      harmonicOscillatorRef.current.stop();
      harmonicOscillatorRef.current = null;
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
