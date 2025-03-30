
import { useState } from 'react';
import { useTreatmentAudio } from './useTreatmentAudio';
import { useTreatmentImages } from './useTreatmentImages';
import { useTreatmentRates } from './useTreatmentRates';

export interface TreatmentPreset {
  id: string;
  name: string;
  frequency: number;
  description: string;
  duration: number;
}

export const useTreatment = () => {
  const [selectedPreset, setSelectedPreset] = useState('');
  
  // Composite hooks
  const audioHook = useTreatmentAudio();
  const imageHook = useTreatmentImages();
  const rateHook = useTreatmentRates();

  const selectPreset = (preset: TreatmentPreset) => {
    if (audioHook.isPlaying) {
      stopTreatment();
    }
    
    setSelectedPreset(preset.id);
    audioHook.setFrequency([preset.frequency]);
    audioHook.setDuration([preset.duration]);
    audioHook.setIntensity([50]);
  };

  const startTreatment = () => {
    // Start audio treatment
    audioHook.startAudio();
    
    // Iniciar efecto hipnótico si hay imágenes cargadas
    const hasRadionicImages = imageHook.radionicImages.length > 0 || imageHook.radionicImage;
    const hasReceptorImages = imageHook.receptorImages.length > 0 || imageHook.receptorImage;
    
    if (hasRadionicImages && hasReceptorImages) {
      imageHook.startHypnoticEffect();
    }
  };

  const stopTreatment = () => {
    // Stop audio treatment
    audioHook.stopAudio();
    
    // Stop hypnotic effect
    imageHook.stopHypnoticEffect();
  };

  return {
    // Audio properties
    isPlaying: audioHook.isPlaying,
    frequency: audioHook.frequency,
    setFrequency: audioHook.setFrequency,
    duration: audioHook.duration,
    setDuration: audioHook.setDuration,
    intensity: audioHook.intensity,
    setIntensity: audioHook.setIntensity,
    timeRemaining: audioHook.timeRemaining,
    useHeadphones: audioHook.useHeadphones,
    setUseHeadphones: audioHook.setUseHeadphones,
    formatTime: audioHook.formatTime,
    
    // Image properties
    visualFeedback: imageHook.visualFeedback,
    setVisualFeedback: imageHook.setVisualFeedback,
    radionicImage: imageHook.radionicImage,
    setRadionicImage: imageHook.setRadionicImage,
    receptorImage: imageHook.receptorImage,
    setReceptorImage: imageHook.setReceptorImage,
    radionicImages: imageHook.radionicImages,
    setRadionicImages: imageHook.setRadionicImages,
    receptorImages: imageHook.receptorImages,
    setReceptorImages: imageHook.setReceptorImages,
    hypnoticEffect: imageHook.hypnoticEffect,
    hypnoticSpeed: imageHook.hypnoticSpeed,
    setHypnoticSpeed: imageHook.setHypnoticSpeed,
    currentImage: imageHook.currentImage,
    
    // Rate properties
    rate1: rateHook.rate1,
    setRate1: rateHook.setRate1,
    rate2: rateHook.rate2,
    setRate2: rateHook.setRate2,
    rate3: rateHook.rate3,
    setRate3: rateHook.setRate3,
    
    // Preset selection
    selectedPreset,
    setSelectedPreset,
    selectPreset,
    
    // Treatment controls
    startTreatment,
    stopTreatment,
  };
};
