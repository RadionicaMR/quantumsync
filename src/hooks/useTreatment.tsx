import { useState, useEffect } from 'react';
import { useTreatmentAudio } from './useTreatmentAudio';
import { useTreatmentImages } from './useTreatmentImages';
import { useTreatmentRates } from './useTreatmentRates';
import { toast } from '@/components/ui/use-toast';
import AudioSubliminalControls from '@/components/AudioSubliminalControls';

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
  const [audioLoop, setAudioLoop] = useState(true); // Nuevo estado para loop
  // Subliminal audio element and play state
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
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
      const newAudio = new Audio(URL.createObjectURL(audioFile));
      newAudio.loop = audioLoop;
      newAudio.volume = audioVolume / 20;
      newAudio.play().catch(err => {
        console.error("Error playing uploaded audio:", err);
      });
      setAudioElement(newAudio);
      setAudioSubliminalPlaying(true);
    }
  };

  // Función para parar el audio subliminal
  const stopSubliminalAudio = () => {
    if (audioElement) {
      audioElement.pause();
      setAudioElement(null);
      setAudioSubliminalPlaying(false);
    }
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
    if (audioElement) {
      audioElement.loop = audioLoop;
    }
  }, [audioLoop, audioElement]);

  // Actualizar el volumen del audio subliminal cuando cambie el volumen
  useEffect(() => {
    if (audioElement) {
      audioElement.volume = audioVolume / 20;
    }
  }, [audioVolume, audioElement]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause();
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
  };
};
