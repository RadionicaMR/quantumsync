
import { useState, useRef, useEffect } from 'react';

export const useTreatmentAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [frequency, setFrequency] = useState([528]);
  const [duration, setDuration] = useState([5]);
  const [intensity, setIntensity] = useState([50]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [useHeadphones, setUseHeadphones] = useState(true);
  const [backgroundModeActive, setBackgroundModeActive] = useState(false);

  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const harmonicOscillatorRef = useRef<OscillatorNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRemainingRef = useRef<number | null>(null);

  const formatTime = (minutes: number) => {
    const mins = Math.floor(minutes);
    const secs = Math.round((minutes - mins) * 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Función para manejar cuando la app pasa a segundo plano
  const handleVisibilityChange = () => {
    if (document.hidden && isPlaying) {
      console.log("App pasó a segundo plano mientras se ejecutaba un tratamiento");
      setBackgroundModeActive(true);
      
      // Guardar el tiempo restante cuando se pausa
      pausedTimeRemainingRef.current = timeRemaining;
      
      // El oscilador actual debe detenerse porque el AudioContext se suspende
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current = null;
      }
      
      if (harmonicOscillatorRef.current) {
        harmonicOscillatorRef.current.stop();
        harmonicOscillatorRef.current = null;
      }
      
      // Detener el timer actual
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } else if (!document.hidden && backgroundModeActive) {
      console.log("App volvió al primer plano, restaurando tratamiento");
      setBackgroundModeActive(false);
      
      // Reiniciar la reproducción si se estaba reproduciendo
      if (isPlaying && pausedTimeRemainingRef.current !== null) {
        // Crear un nuevo contexto y osciladore
        restartAudio();
        
        // Restaurar el temporizador
        setTimeRemaining(pausedTimeRemainingRef.current);
        startTimer(pausedTimeRemainingRef.current);
        pausedTimeRemainingRef.current = null;
      }
    }
  };

  const restartAudio = () => {
    try {
      // Initialize audio context
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
      
      // Create oscillator
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency[0];
      
      // Set volume based on intensity
      const volume = intensity[0] / 100 * 0.3; // max volume 0.3 to protect hearing
      gainNode.gain.value = volume;
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.start();
      oscillatorRef.current = oscillator;
      
      // Si la frecuencia es baja, añadir armónico para mejorar la audibilidad en dispositivos pequeños
      if (frequency[0] < 100) {
        const harmonicOscillator = audioContextRef.current.createOscillator();
        const harmonicGainNode = audioContextRef.current.createGain();
        
        // Crear armónico a 2x la frecuencia con menor volumen
        harmonicOscillator.type = 'sine';
        harmonicOscillator.frequency.value = frequency[0] * 2;
        
        // Volumen del armónico proporcional al volumen principal
        harmonicGainNode.gain.value = volume * 0.75;
        
        harmonicOscillator.connect(harmonicGainNode);
        harmonicGainNode.connect(audioContextRef.current.destination);
        
        harmonicOscillator.start();
        harmonicOscillatorRef.current = harmonicOscillator;
      }
    } catch (error) {
      console.error("Error al reiniciar el audio:", error);
    }
  };

  const startTimer = (initialTime: number) => {
    startTimeRef.current = Date.now();
    
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1/60;
        if (newTime <= 0) {
          stopAudio();
          return 0;
        }
        return newTime;
      });
    }, 1000);
  };

  const startAudio = () => {
    if (isPlaying) return;
    
    try {
      // Initialize audio context
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
      
      // Create oscillator
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency[0];
      
      // Set volume based on intensity
      const volume = intensity[0] / 100 * 0.3; // max volume 0.3 to protect hearing
      gainNode.gain.value = volume;
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.start();
      oscillatorRef.current = oscillator;
      
      // Si la frecuencia es baja, añadir armónico para mejorar la audibilidad en dispositivos pequeños
      if (frequency[0] < 100) {
        const harmonicOscillator = audioContextRef.current.createOscillator();
        const harmonicGainNode = audioContextRef.current.createGain();
        
        // Crear armónico a 2x la frecuencia con menor volumen
        harmonicOscillator.type = 'sine';
        harmonicOscillator.frequency.value = frequency[0] * 2;
        
        // Volumen del armónico proporcional al volumen principal
        harmonicGainNode.gain.value = volume * 0.75;
        
        harmonicOscillator.connect(harmonicGainNode);
        harmonicGainNode.connect(audioContextRef.current.destination);
        
        harmonicOscillator.start();
        harmonicOscillatorRef.current = harmonicOscillator;
      }
      
      // Start timer
      setTimeRemaining(duration[0]);
      startTimer(duration[0]);
      
      setIsPlaying(true);
    } catch (error) {
      console.error("Error al iniciar el tratamiento de audio:", error);
      alert("No se pudo iniciar el tratamiento de audio. Por favor, asegúrate de que tu dispositivo admite la API Web Audio.");
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
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsPlaying(false);
    setBackgroundModeActive(false);
    pausedTimeRemainingRef.current = null;
  };

  // Agregar el event listener para visibilitychange
  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Limpieza al desmontar
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
      }
      if (harmonicOscillatorRef.current) {
        harmonicOscillatorRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, backgroundModeActive]);

  return {
    isPlaying,
    frequency,
    setFrequency,
    duration,
    setDuration,
    intensity,
    setIntensity,
    timeRemaining,
    useHeadphones,
    setUseHeadphones,
    formatTime,
    startAudio,
    stopAudio,
    backgroundModeActive
  };
};
