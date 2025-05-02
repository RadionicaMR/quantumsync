import React from 'react';
import PresetTreatmentLayout from './PresetTreatmentLayout';
import ImageUploaderSection from './ImageUploaderSection';
import RateSection from './RateSection';
import ReceptorSection from './ReceptorSection';
import TreatmentVisualizerSection from './TreatmentVisualizerSection';
import AudioSubliminalSection from '@/components/manifest/sections/AudioSubliminalSection';

interface PresetTreatmentProps {
  presets: any[];
  selectedPreset: string | null;
  frequency: number[];
  duration: number[];
  intensity: number[];
  onSelectPreset: (preset: any) => void;
  isPlaying: boolean;
  radionicImage: string | null;
  setRadionicImage: (image: string | null) => void;
  receptorImage: string | null;
  setReceptorImage: (image: string | null) => void;
  radionicImages: string[];
  setRadionicImages: (images: string[]) => void;
  receptorImages: string[];
  setReceptorImages: (images: string[]) => void;
  currentImage: 'radionic' | 'receptor' | 'mix';
  hypnoticEffect: boolean;
  visualFeedback: boolean;
  setVisualFeedback: (value: boolean) => void;
  useHeadphones: boolean;
  setUseHeadphones: (value: boolean) => void;
  rate1: string;
  setRate1: (value: string) => void;
  rate2: string;
  setRate2: (value: string) => void;
  rate3: string;
  setRate3: (value: string) => void;
  hypnoticSpeed: number[];
  setHypnoticSpeed: (value: number[]) => void;
  timeRemaining: number;
  formatTime: (minutes: number) => string;
  startTreatment: () => void;
  stopTreatment: () => void;
  receptorName: string;
  setReceptorName: (name: string) => void;
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  audioVolume: number;
  setAudioVolume: (vol: number) => void;
  audioSubliminalPlaying: boolean;
  playSubliminalAudio: () => void;
  stopSubliminalAudio: () => void;
  backgroundModeActive?: boolean;
}

const PresetTreatment = ({
  presets,
  selectedPreset,
  frequency,
  duration,
  intensity,
  onSelectPreset,
  isPlaying,
  radionicImage,
  setRadionicImage,
  receptorImage,
  setReceptorImage,
  radionicImages,
  setRadionicImages,
  receptorImages,
  setReceptorImages,
  currentImage,
  hypnoticEffect,
  visualFeedback,
  setVisualFeedback,
  useHeadphones,
  setUseHeadphones,
  rate1,
  setRate1,
  rate2,
  setRate2,
  rate3,
  setRate3,
  hypnoticSpeed,
  setHypnoticSpeed,
  timeRemaining,
  formatTime,
  startTreatment,
  stopTreatment,
  receptorName,
  setReceptorName,
  audioFile,
  setAudioFile,
  audioVolume,
  setAudioVolume,
  audioSubliminalPlaying,
  playSubliminalAudio,
  stopSubliminalAudio,
  backgroundModeActive = false,
}: PresetTreatmentProps) => {
  return (
    <PresetTreatmentLayout
      presets={presets}
      selectedPreset={selectedPreset}
      frequency={frequency}
      duration={duration}
      intensity={intensity}
      onSelectPreset={onSelectPreset}
      isPlaying={isPlaying}
      imageUploader={
        <ImageUploaderSection
          radionicImage={radionicImage}
          setRadionicImage={setRadionicImage}
          radionicImages={radionicImages}
          setRadionicImages={setRadionicImages}
          receptorImage={receptorImage}
          setReceptorImage={setReceptorImage}
          receptorImages={receptorImages}
          setReceptorImages={setReceptorImages}
          isPlaying={isPlaying}
          receptorName={receptorName}
          setReceptorName={setReceptorName}
        />
      }
      rateSection={
        <RateSection 
          rate1={rate1}
          setRate1={setRate1}
          rate2={rate2}
          setRate2={setRate2}
          rate3={rate3}
          setRate3={setRate3}
          isDisabled={isPlaying}
        />
      }
      receptorSection={
        <ReceptorSection
          receptorName={receptorName}
          setReceptorName={setReceptorName}
          receptorImage={receptorImage}
          receptorImages={receptorImages}
          isPlaying={isPlaying}
        />
      }
      visualizerSection={
        <TreatmentVisualizerSection
          radionicImage={radionicImage}
          radionicImages={radionicImages}
          receptorImage={receptorImage}
          receptorImages={receptorImages}
          currentImage={currentImage}
          hypnoticEffect={hypnoticEffect}
          visualFeedback={visualFeedback} 
          setVisualFeedback={setVisualFeedback}
          useHeadphones={useHeadphones}
          setUseHeadphones={setUseHeadphones}
          frequency={frequency}
          intensity={intensity}
          rate1={rate1}
          rate2={rate2}
          rate3={rate3}
          hypnoticSpeed={hypnoticSpeed}
          isPlaying={isPlaying}
          timeRemaining={timeRemaining}
          formatTime={formatTime}
          startTreatment={startTreatment}
          stopTreatment={stopTreatment}
          receptorName={receptorName}
          backgroundModeActive={backgroundModeActive}
        />
      }
      audioSection={
        <AudioSubliminalSection 
          audioFile={audioFile}
          setAudioFile={setAudioFile}
          audioVolume={audioVolume}
          setAudioVolume={setAudioVolume}
          audioSubliminalPlaying={audioSubliminalPlaying}
          playSubliminalAudio={playSubliminalAudio}
          stopSubliminalAudio={stopSubliminalAudio}
          isManifestActive={isPlaying}
        />
      }
    />
  );
};

export default PresetTreatment;
