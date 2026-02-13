
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
      // CRITICAL: Clean up previous audio synchronously (no setTimeout for Safari)
      if (oscillatorRef.current) {
        try { oscillatorRef.current.stop(); } catch (e) { /* ignore */ }
        oscillatorRef.current = null;
      }
      if (harmonicOscillatorRef.current) {
        try { harmonicOscillatorRef.current.stop(); } catch (e) { /* ignore */ }
        harmonicOscillatorRef.current = null;
      }
      if (audioContextRef.current) {
        try { audioContextRef.current.close(); } catch (e) { /* ignore */ }
        audioContextRef.current = null;
      }

      // CRITICAL: Create AudioContext synchronously within user gesture for Safari
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;
      
      // CRITICAL: Resume synchronously for Safari - must be in user gesture stack
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      
      // Crear oscilador
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.type = 'sine';
      const frequency = 174;
      oscillator.frequency.value = frequency;
      
      const actualVolume = customVolume !== undefined ? customVolume : volume;
      gainNode.gain.value = actualVolume;
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.start();
      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;
      
      setIsPlaying(true);
      
      return true;
    } catch (error) {
      console.error("Error al iniciar el audio del péndulo:", error);
      return false;
    }
  }, [volume]);

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
