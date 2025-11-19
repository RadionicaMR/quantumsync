
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
  const audioMonitorIntervalRef = useRef<number | null>(null);
  const isPlayingRef = useRef<boolean>(false);

  // Function to monitor and maintain audio playback
  const startAudioMonitor = () => {
    // Clear any existing monitor
    if (audioMonitorIntervalRef.current) {
      window.clearInterval(audioMonitorIntervalRef.current);
    }

    console.log("Starting manifestation audio monitor to prevent audio cuts");
    
    audioMonitorIntervalRef.current = window.setInterval(() => {
      if (!isPlayingRef.current) {
        return;
      }

      const context = audioContextRef.current;
      if (!context) {
        console.warn("Manifestation audio context lost");
        return;
      }

      // Check if audio context is suspended and resume it
      if (context.state === 'suspended') {
        console.warn("Manifestation audio context suspended - resuming...");
        context.resume()
          .then(() => {
            console.log("Manifestation audio context resumed successfully");
          })
          .catch(err => {
            console.error("Failed to resume manifestation audio context:", err);
          });
      }

      // Verify oscillators are still active
      const mainOsc = oscillatorRef.current;
      
      if (!mainOsc && currentFrequencyRef.current !== null) {
        console.warn("Manifestation oscillators lost - attempting restart");
        startAudio(currentFrequencyRef.current);
      }
    }, 2000); // Check every 2 seconds
  };

  const stopAudioMonitor = () => {
    if (audioMonitorIntervalRef.current) {
      window.clearInterval(audioMonitorIntervalRef.current);
      audioMonitorIntervalRef.current = null;
      console.log("Manifestation audio monitor stopped");
    }
  };

  // Logs para depuración
  useEffect(() => {
    console.log("useManifestAudio - Montado");
    return () => {
      console.log("useManifestAudio - Desmontado, limpiando recursos");
      stopAudioMonitor();
      stopAudio();
    }
  }, []);

  const handleVisibilityChange = () => {
    if (document.hidden && oscillatorRef.current !== null) {
      console.log("App pasó a segundo plano - manifestación continúa reproduciéndose");
      setBackgroundModeActive(true);
    } else if (!document.hidden && backgroundModeActive) {
      console.log("App volvió al primer plano");
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
      isPlayingRef.current = true;
      
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
      gainNode.gain.value = 0.3; // Incrementamos levemente el volumen
      
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
        harmonicGainNode.gain.value = 0.2; // Incrementamos levemente el volumen armónico
        
        harmonicOscillator.connect(harmonicGainNode);
        harmonicGainNode.connect(audioContextRef.current.destination);
        
        harmonicOscillator.start();
        harmonicOscillatorRef.current = harmonicOscillator;
        console.log("Oscilador armónico iniciado");
      }
      
      // Start audio monitoring to prevent cuts
      startAudioMonitor();
      
      console.log("Audio de manifestación iniciado correctamente con frecuencia:", frequency);
    } catch (error) {
      console.error("Error starting manifestation audio:", error);
    }
  };

  const stopAudio = () => {
    console.log("Deteniendo audio de manifestación");
    
    isPlayingRef.current = false;
    
    // Stop audio monitoring
    stopAudioMonitor();
    
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
