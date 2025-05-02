
import { useState, useEffect, useRef } from 'react';
import { useTreatmentAudio } from './useTreatmentAudio';
import { useTreatmentImages } from './useTreatmentImages';
import { useTreatmentRates } from './useTreatmentRates';
import { toast } from '@/components/ui/use-toast';

// Define and export the TreatmentPreset type
export interface TreatmentPreset {
  id: string;
  name: string;
  frequency: number;
  description: string;
  duration: number;
}

// Main treatment hook that combines all the other hooks
export const useTreatment = () => {
  // State for the treatment
  const [selectedPreset, setSelectedPreset] = useState('');
  const [visualFeedback, setVisualFeedback] = useState(true);
  const [hypnoticEffect, setHypnoticEffect] = useState(false);
  const [receptorName, setReceptorName] = useState('');
  const [hypnoticSpeed, setHypnoticSpeed] = useState([10]);
  
  // Custom hooks
  const audio = useTreatmentAudio();
  const images = useTreatmentImages();
  const rates = useTreatmentRates();
  
  // Audio file upload state (renamed for clarity)
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioVolume, setAudioVolume] = useState(10);
  const [audioLoop, setAudioLoop] = useState(true);
  // Subliminal audio element reference para mejor control
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const [audioSubliminalPlaying, setAudioSubliminalPlaying] = useState(false);

  // Select a preset
  const selectPreset = (preset: TreatmentPreset) => {
    setSelectedPreset(preset.id);
    audio.setFrequency([preset.frequency]);
    audio.setDuration([preset.duration]);
  };

  // Función para manejar play del audio subliminal
  const playSubliminalAudio = () => {
    if (audioFile && !audioSubliminalPlaying) {
      try {
        // Si ya existe un elemento de audio previo, detenlo primero
        if (audioElementRef.current) {
          audioElementRef.current.pause();
        }
        
        const newAudio = new Audio(URL.createObjectURL(audioFile));
        newAudio.loop = audioLoop;
        newAudio.volume = audioVolume / 20;
        
        // Asignar primero la referencia para tener acceso inmediato
        audioElementRef.current = newAudio;
        
        // Intentar reproducir el audio
        newAudio.play()
          .then(() => {
            setAudioSubliminalPlaying(true);
            console.log("Audio subliminal reproduciendo correctamente");
          })
          .catch((err) => {
            console.error("Error reproduciendo audio subliminal:", err);
            setAudioSubliminalPlaying(false);
            // No eliminamos la referencia en caso de error
          });
      } catch (error) {
        console.error("Error al crear el objeto de audio:", error);
        setAudioSubliminalPlaying(false);
      }
    } else {
      console.log("No hay archivo de audio para reproducir o ya está reproduciendo");
    }
  };

  // Función para parar el audio subliminal
  const stopSubliminalAudio = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      setAudioSubliminalPlaying(false);
      console.log("Audio subliminal detenido");
      // No eliminamos la referencia al elemento para poder reanudar la reproducción
    }
  };

  // Función para eliminar el audio
  const clearAudio = () => {
    stopSubliminalAudio();
    setAudioFile(null);
    audioElementRef.current = null;
    setAudioSubliminalPlaying(false);
    toast({
      title: "Audio eliminado",
      description: "El archivo de audio subliminal ha sido eliminado",
    });
  };

  // Start the treatment
  const startTreatment = () => {
    if (audio.isPlaying) return;

    audio.startAudio();
    setHypnoticEffect(true);

    // Ahora: solo al iniciar tratamiento, dale play
    if (audioFile) {
      playSubliminalAudio();
    }

    // Show toast notification
    const target = receptorName ? ` para ${receptorName}` : '';
    toast({
      title: "Tratamiento iniciado",
      description: `Aplicando frecuencia de ${audio.frequency[0]}Hz${target}`,
    });
  };

  // Stop the treatment
  const stopTreatment = () => {
    audio.stopAudio();
    setHypnoticEffect(false);
    stopSubliminalAudio();

    toast({
      title: "Tratamiento detenido",
      description: "El tratamiento de frecuencia ha sido detenido.",
    });
  };

  // Update loop property en caliente
  useEffect(() => {
    if (audioElementRef.current) {
      audioElementRef.current.loop = audioLoop;
    }
  }, [audioLoop]);

  // Actualizar el volumen del audio subliminal cuando cambie el volumen
  useEffect(() => {
    if (audioElementRef.current) {
      audioElementRef.current.volume = audioVolume / 20;
    }
  }, [audioVolume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current = null;
      }
    };
  }, []);

  return {
    // Audio treatment originals
    ...audio,
    // Images and rates
    ...images,
    ...rates,
    // Treatment control
    selectedPreset,
    visualFeedback,
    setVisualFeedback,
    hypnoticEffect,
    receptorName,
    setReceptorName,
    hypnoticSpeed,
    setHypnoticSpeed,
    // Actions
    selectPreset,
    startTreatment,
    stopTreatment,
    // Audio subliminal
    audioFile,
    setAudioFile,
    audioVolume,
    setAudioVolume,
    audioSubliminalPlaying,
    playSubliminalAudio,
    stopSubliminalAudio,
    audioLoop,
    setAudioLoop,
    clearAudio,
  };
};
