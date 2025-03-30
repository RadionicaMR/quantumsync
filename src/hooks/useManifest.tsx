
import { useState, useRef, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";

interface Pattern {
  id: string;
  name: string;
  description: string;
  image: string;
}

export const useManifest = (patterns: Pattern[]) => {
  // Estados para la manifestación
  const [intention, setIntention] = useState('');
  const [isManifestActive, setIsManifestActive] = useState(false);
  const [visualSpeed, setVisualSpeed] = useState([10]);
  const [patternImage, setPatternImage] = useState<string | null>(null);
  const [receptorImage, setReceptorImage] = useState<string | null>(null);
  const [selectedPattern, setSelectedPattern] = useState('');
  const [activeTab, setActiveTab] = useState("presets");
  const [manifestSound, setManifestSound] = useState(true);
  const [manifestFrequency, setManifestFrequency] = useState([528]);
  const [currentImage, setCurrentImage] = useState<'pattern' | 'receptor' | 'mix'>('pattern');
  const [exposureTime, setExposureTime] = useState([5]); 
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  // Estado para el nombre del receptor
  const [receptorName, setReceptorName] = useState('');
  // Estados para RATES
  const [rate1, setRate1] = useState('');
  const [rate2, setRate2] = useState('');
  const [rate3, setRate3] = useState('');
  
  // Referencias para elementos DOM y audio
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const hypnoticTimerRef = useRef<NodeJS.Timeout | null>(null);
  const exposureTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Manejar cambio de pestaña
  const handleTabChange = (value: string) => {
    if (isManifestActive) {
      stopManifestation();
    }
    setActiveTab(value);
    setSelectedPattern('');
  };

  // Seleccionar patrón predefinido
  const selectPattern = (patternId: string) => {
    if (isManifestActive) {
      stopManifestation();
    }
    
    setSelectedPattern(patternId);
  };

  // Formatear tiempo restante
  const formatTimeRemaining = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${remainingMinutes}m`;
  };

  // Iniciar manifestación
  const startManifestation = () => {
    // Se puede iniciar con un patrón, una imagen o un nombre de receptor
    if ((activeTab === "presets" && !selectedPattern && !receptorName) || 
        (activeTab === "custom" && !patternImage && !receptorName)) return;
    
    // Iniciar sonido si está habilitado
    if (manifestSound) {
      try {
        // Inicializar contexto de audio
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContext();
        
        // Crear oscilador
        const oscillator = audioContextRef.current.createOscillator();
        const gainNode = audioContextRef.current.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = manifestFrequency[0];
        
        // Configurar volumen
        gainNode.gain.value = 0.2; // volumen bajo para no molestar
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);
        
        oscillator.start();
        oscillatorRef.current = oscillator;
      } catch (error) {
        console.error("Error al iniciar el audio de manifestación:", error);
      }
    }
    
    // Iniciar efecto hipnótico con velocidad aumentada
    const switchInterval = 1000 / (visualSpeed[0] * 3);
    
    // Podemos iniciar con un patrón, una imagen o un nombre de receptor
    if (patternImage || selectedPattern || receptorImage || receptorName) {
      // Iniciar efecto hipnótico que alterna entre patrón, receptor y mezcla
      hypnoticTimerRef.current = setInterval(() => {
        setCurrentImage(prev => {
          switch(prev) {
            case 'pattern': return 'receptor';
            case 'receptor': return 'mix';
            case 'mix': return 'pattern';
            default: return 'pattern';
          }
        });
      }, switchInterval);

      // Configurar temporizador de exposición para cambiar la visibilidad
      const exposureTimeInMs = exposureTime[0] * 60 * 1000; // convertir a milisegundos (ahora en minutos)
      setTimeRemaining(exposureTime[0]);
      
      // Iniciar cuenta regresiva
      countdownTimerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev !== null && prev > 0) {
            return prev - 1/60; // Decrementar 1 segundo (1/60 de minuto)
          }
          return prev;
        });
      }, 1000);
      
      // Configurar temporizador para detener la manifestación
      if (exposureTimerRef.current) {
        clearTimeout(exposureTimerRef.current);
      }
      
      exposureTimerRef.current = setTimeout(() => {
        stopManifestation();
        toast({
          title: "Manifestación completada",
          description: `Tu intención "${intention}" ha sido completamente programada.`,
        });
      }, exposureTimeInMs);
    }
    
    setIsManifestActive(true);
  };

  // Detener manifestación
  const stopManifestation = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    if (hypnoticTimerRef.current) {
      clearInterval(hypnoticTimerRef.current);
      hypnoticTimerRef.current = null;
    }

    if (exposureTimerRef.current) {
      clearTimeout(exposureTimerRef.current);
      exposureTimerRef.current = null;
    }
    
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    
    setTimeRemaining(null);
    setIsManifestActive(false);
  };

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (hypnoticTimerRef.current) {
        clearInterval(hypnoticTimerRef.current);
      }
      if (exposureTimerRef.current) {
        clearTimeout(exposureTimerRef.current);
      }
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, []);

  return {
    // States
    intention,
    setIntention,
    isManifestActive,
    visualSpeed,
    setVisualSpeed,
    patternImage,
    setPatternImage,
    receptorImage,
    setReceptorImage,
    selectedPattern,
    activeTab,
    setActiveTab,
    manifestSound,
    setManifestSound,
    manifestFrequency,
    setManifestFrequency,
    currentImage,
    exposureTime,
    setExposureTime,
    timeRemaining,
    receptorName,
    setReceptorName,
    rate1,
    setRate1,
    rate2,
    setRate2,
    rate3,
    setRate3,
    // Methods
    handleTabChange,
    selectPattern,
    formatTimeRemaining,
    startManifestation,
    stopManifestation
  };
};
