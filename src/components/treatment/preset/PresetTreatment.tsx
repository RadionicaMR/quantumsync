import React from 'react';
import { Card } from '@/components/ui/card';
import ImageUploaderSection from './ImageUploaderSection';
import RateSection from './RateSection';
import ReceptorSection from './ReceptorSection';
import AudioSubliminalSection from './AudioSubliminalSection';
import TreatmentVisualizerSection from './TreatmentVisualizerSection';
import { ManifestPattern } from '@/data/manifestPatterns';

interface PresetTreatmentProps {
  presets: any[];
  selectedPreset: string;
  isPlaying: boolean;
  frequency: number[];
  setFrequency: (value: number[]) => void;
  duration: number[];
  setDuration: (value: number[]) => void;
  intensity: number[];
  setIntensity: (value: number[]) => void;
  useHeadphones: boolean;
  setUseHeadphones: (value: boolean) => void;
  visualFeedback: boolean;
  setVisualFeedback: (value: boolean) => void;
  timeRemaining: number;
  formatTime: (minutes: number) => string;
  onSelectPreset: (preset: any) => void;
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
  setRate1: (value: string) => void;
  rate2: string;
  setRate2: (value: string) => void;
  rate3: string;
  setRate3: (value: string) => void;
  hypnoticSpeed: number[];
  setHypnoticSpeed: (value: number[]) => void;
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

const PresetTreatment = (props: PresetTreatmentProps) => {
  return (
    <Card className="quantum-card p-6">
      <h3 className="text-xl font-semibold mb-4">Patrón Predefinido</h3>
      <ImageUploaderSection
        isPlaying={props.isPlaying}
        radionicImage={props.radionicImage}
        setRadionicImage={props.setRadionicImage}
        receptorImage={props.receptorImage}
        setReceptorImage={props.setReceptorImage}
        radionicImages={props.radionicImages}
        setRadionicImages={props.setRadionicImages}
        receptorImages={props.receptorImages}
        setReceptorImages={props.setReceptorImages}
      />
      <RateSection
        rate1={props.rate1}
        setRate1={props.setRate1}
        rate2={props.rate2}
        setRate2={props.setRate2}
        rate3={props.rate3}
        setRate3={props.setRate3}
        isPlaying={props.isPlaying}
      />
      <ReceptorSection
        receptorName={props.receptorName}
        setReceptorName={props.setReceptorName}
        isPlaying={props.isPlaying}
      />
      <TreatmentVisualizerSection
        radionicImage={props.radionicImage}
        setRadionicImage={props.setRadionicImage}
        radionicImages={props.radionicImages}
        setRadionicImages={props.setRadionicImages}
        receptorImage={props.receptorImage}
        setReceptorImage={props.setReceptorImage}
        receptorImages={props.receptorImages}
        setReceptorImages={props.setReceptorImages}
        currentImage={props.currentImage}
        hypnoticEffect={props.hypnoticEffect}
        visualFeedback={props.visualFeedback}
        setVisualFeedback={props.setVisualFeedback}
        useHeadphones={props.useHeadphones}
        setUseHeadphones={props.setUseHeadphones}
        frequency={props.frequency}
        intensity={props.intensity}
        rate1={props.rate1}
        rate2={props.rate2}
        rate3={props.rate3}
        hypnoticSpeed={props.hypnoticSpeed}
        isPlaying={props.isPlaying}
        timeRemaining={props.timeRemaining}
        formatTime={props.formatTime}
        startTreatment={props.startTreatment}
        stopTreatment={props.stopTreatment}
        receptorName={props.receptorName}
        backgroundModeActive={props.backgroundModeActive}
      />
      <AudioSubliminalSection
        audioFile={props.audioFile}
        setAudioFile={props.setAudioFile}
        audioVolume={props.audioVolume}
        setAudioVolume={props.setAudioVolume}
        audioSubliminalPlaying={props.audioSubliminalPlaying}
        playSubliminalAudio={props.playSubliminalAudio}
        stopSubliminalAudio={props.stopSubliminalAudio}
        isPlaying={props.isPlaying}
      />
    </Card>
  );
};

export default PresetTreatment;
