
import { useState, useEffect } from 'react';
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
  
  // Audio file upload state (new)
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioVolume, setAudioVolume] = useState(10);
  
  // Audio element reference
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  
  // Select a preset
  const selectPreset = (preset: TreatmentPreset) => {
    setSelectedPreset(preset.id);
    audio.setFrequency([preset.frequency]);
    audio.setDuration([preset.duration]);
  };
  
  // Start the treatment
  const startTreatment = () => {
    if (audio.isPlaying) return;
    
    // Start the frequency audio
    audio.startAudio();
    
    // Set hypnotic effect
    setHypnoticEffect(true);
    
    // Play uploaded audio file if exists
    if (audioFile && !audioElement) {
      const newAudio = new Audio(URL.createObjectURL(audioFile));
      newAudio.loop = true;
      // Convert custom volume to standard HTML audio volume (0-1)
      newAudio.volume = audioVolume / 20;
      newAudio.play().catch(err => {
        console.error("Error playing uploaded audio:", err);
      });
      setAudioElement(newAudio);
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
    // Stop the frequency audio
    audio.stopAudio();
    
    // Stop hypnotic effect
    setHypnoticEffect(false);
    
    // Stop uploaded audio file if playing
    if (audioElement) {
      audioElement.pause();
      setAudioElement(null);
    }
    
    // Show toast notification
    toast({
      title: "Tratamiento detenido",
      description: "El tratamiento de frecuencia ha sido detenido.",
    });
  };
  
  // Update audio element volume when volume changes
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
    // Audio treatment
    ...audio,
    
    // Images
    ...images,
    
    // Rates
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
    
    // Uploaded audio (new)
    audioFile,
    setAudioFile,
    audioVolume,
    setAudioVolume,
  };
};
