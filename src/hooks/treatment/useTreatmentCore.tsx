
import { useState, useRef } from 'react';
import { useTreatmentAudio } from './useTreatmentAudio';
import { useTreatmentImages } from '../useTreatmentImages';
import { useTreatmentRates } from '../useTreatmentRates';
import { toast } from '@/components/ui/use-toast';

// Define and export the TreatmentPreset type
export interface TreatmentPreset {
  id: string;
  name: string;
  frequency: number;
  description: string;
  duration: number;
}

export const useTreatmentCore = () => {
  // State for the treatment
  const [selectedPreset, setSelectedPreset] = useState('');
  const [visualFeedback, setVisualFeedback] = useState(true);
  const [hypnoticEffect, setHypnoticEffect] = useState(false);
  const [receptorName, setReceptorName] = useState('');
  const [hypnoticSpeed, setHypnoticSpeed] = useState([10]);
  const [intention, setIntention] = useState(''); // Add intention state
  
  // Custom hooks
  const audio = useTreatmentAudio();
  const images = useTreatmentImages();
  const rates = useTreatmentRates();
  
  // Flag to prevent multiple rapid start attempts
  const isStartingTreatment = useRef<boolean>(false);

  // Select a preset
  const selectPreset = (preset: TreatmentPreset) => {
    console.log("Selecting preset:", preset.id, "with frequency:", preset.frequency, "Hz and duration:", preset.duration, "minutes");
    
    // Reset treatment state when changing presets
    if (audio.isPlaying) {
      console.log("Stopping previous treatment before changing preset");
      audio.stopAudio();
      setHypnoticEffect(false);
    }
    
    setSelectedPreset(preset.id);
    audio.setFrequency([preset.frequency]);
    audio.setDuration([preset.duration]);
  };

  // Start the treatment
  const startTreatment = () => {
    if (audio.isPlaying || isStartingTreatment.current) {
      console.log("Treatment already playing or starting, not starting again");
      return;
    }
    
    // Set the flag to prevent multiple start attempts
    isStartingTreatment.current = true;
    
    // Debug logging
    console.log("Starting treatment with frequency:", audio.frequency[0], "Hz");
    console.log("Configured duration:", audio.duration[0], "minutes");
    console.log("Intention for manifestation:", intention);
    
    // First set the hypnotic effect (visual change)
    setHypnoticEffect(true);
    
    // Start the hypnotic effect if visual feedback is enabled
    if (visualFeedback) {
      console.log("Starting hypnotic effect in useTreatmentCore");
      images.startHypnoticEffect();
    }
    
    // Make sure the audio starts correctly
    audio.startAudio();

    // Show toast notification
    const target = receptorName ? ` para ${receptorName}` : '';
    const intentionMsg = intention ? ` con intención: "${intention.substring(0, 30)}${intention.length > 30 ? '...' : ''}"` : '';
    
    toast({
      title: "Tratamiento iniciado",
      description: `Aplicando frecuencia de ${audio.frequency[0]}Hz${target}${intentionMsg}`,
    });
    
    console.log("Treatment fully started");
    
    // Reset the starting flag after a delay to prevent rapid start/stop cycles
    setTimeout(() => {
      isStartingTreatment.current = false;
    }, 1000);
  };

  // Stop the treatment
  const stopTreatment = () => {
    console.log("Stopping treatment");
    
    // Stop main audio
    audio.stopAudio();
    
    // Stop visual effects
    setHypnoticEffect(false);
    images.stopHypnoticEffect();

    toast({
      title: "Tratamiento detenido",
      description: "El tratamiento de frecuencia ha sido detenido.",
    });
    
    console.log("Treatment completely stopped");
  };

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
    // Intention for manifestation
    intention,
    setIntention,
    // Actions
    selectPreset,
    startTreatment,
    stopTreatment,
    // Flag for start prevention
    isStartingTreatment,
  };
};
