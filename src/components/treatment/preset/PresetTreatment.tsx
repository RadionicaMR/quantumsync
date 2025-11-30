
import React from 'react';
import { TreatmentPreset } from '@/hooks/treatment/useTreatmentCore';
import { Card } from '@/components/ui/card';
import PresetTreatmentLayout from './PresetTreatmentLayout';

interface PresetTreatmentProps {
  presets: TreatmentPreset[];
  selectedPreset: string;
  isPlaying: boolean;
  frequency: number[];
  setFrequency: (frequency: number[]) => void;
  duration: number[];
  setDuration: (duration: number[]) => void;
  intensity: number[];
  setIntensity: (intensity: number[]) => void;
  useHeadphones: boolean;
  setUseHeadphones: (useHeadphones: boolean) => void;
  visualFeedback: boolean;
  setVisualFeedback: (visualFeedback: boolean) => void;
  timeRemaining: number | null;
  formatTime: (time: number | null) => string;
  onSelectPreset: (preset: TreatmentPreset) => void;
  startTreatment: () => void;
  stopTreatment: () => void;
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
  rate1: string;
  setRate1: (rate: string) => void;
  rate2: string;
  setRate2: (rate: string) => void;
  rate3: string;
  setRate3: (rate: string) => void;
  hypnoticSpeed: number[];
  setHypnoticSpeed: (speed: number[]) => void;
  receptorName: string;
  setReceptorName: (name: string) => void;
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  audioVolume: number;
  setAudioVolume: (volume: number) => void;
  audioSubliminalPlaying: boolean;
  playSubliminalAudio: () => void;
  stopSubliminalAudio: () => void;
  backgroundModeActive?: boolean;
  intention?: string; // Add intention prop
  audioLoop?: boolean;
  setAudioLoop?: (loop: boolean) => void;
  clearAudio?: () => void;
}

const PresetTreatment: React.FC<PresetTreatmentProps> = ({
  presets,
  selectedPreset,
  isPlaying,
  frequency,
  setFrequency,
  duration,
  setDuration,
  intensity,
  setIntensity,
  useHeadphones,
  setUseHeadphones,
  visualFeedback,
  setVisualFeedback,
  timeRemaining,
  formatTime,
  onSelectPreset,
  startTreatment,
  stopTreatment,
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
  rate1,
  setRate1,
  rate2,
  setRate2,
  rate3,
  setRate3,
  hypnoticSpeed,
  setHypnoticSpeed,
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
  intention = "", // Default to empty string
  audioLoop = true,
  setAudioLoop = () => {},
  clearAudio = () => {},
}) => {
  return (
    <Card className="bg-card/90 dark:bg-black/40 p-6 rounded-lg">
      <PresetTreatmentLayout
        presets={presets}
        selectedPreset={selectedPreset}
        isPlaying={isPlaying}
        frequency={frequency}
        setFrequency={setFrequency}
        duration={duration}
        setDuration={setDuration}
        intensity={intensity}
        setIntensity={setIntensity}
        useHeadphones={useHeadphones}
        setUseHeadphones={setUseHeadphones}
        visualFeedback={visualFeedback}
        setVisualFeedback={setVisualFeedback}
        timeRemaining={timeRemaining}
        formatTime={formatTime}
        onSelectPreset={onSelectPreset}
        startTreatment={startTreatment}
        stopTreatment={stopTreatment}
        radionicImage={radionicImage}
        setRadionicImage={setRadionicImage}
        receptorImage={receptorImage}
        setReceptorImage={setReceptorImage}
        radionicImages={radionicImages}
        setRadionicImages={setRadionicImages}
        receptorImages={receptorImages}
        setReceptorImages={setReceptorImages}
        currentImage={currentImage}
        hypnoticEffect={hypnoticEffect}
        rate1={rate1}
        setRate1={setRate1}
        rate2={rate2}
        setRate2={setRate2}
        rate3={rate3}
        setRate3={setRate3}
        hypnoticSpeed={hypnoticSpeed}
        setHypnoticSpeed={setHypnoticSpeed}
        receptorName={receptorName}
        setReceptorName={setReceptorName}
        audioFile={audioFile}
        setAudioFile={setAudioFile}
        audioVolume={audioVolume}
        setAudioVolume={setAudioVolume}
        audioSubliminalPlaying={audioSubliminalPlaying}
        playSubliminalAudio={playSubliminalAudio}
        stopSubliminalAudio={stopSubliminalAudio}
        backgroundModeActive={backgroundModeActive}
        intention={intention}
        audioLoop={audioLoop}
        setAudioLoop={setAudioLoop}
        clearAudio={clearAudio}
      />
    </Card>
  );
};

export default PresetTreatment;
