
import { TreatmentPreset } from '@/hooks/useTreatment';
import PresetTreatmentLayout from './PresetTreatmentLayout';

interface PresetTreatmentProps {
  presets: TreatmentPreset[];
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
  setRate1: (value: string) => void;
  rate2: string;
  setRate2: (value: string) => void;
  rate3: string;
  setRate3: (value: string) => void;
  hypnoticSpeed: number[];
  setHypnoticSpeed: (value: number[]) => void;
  receptorName?: string;
  setReceptorName?: (name: string) => void;
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  audioVolume: number;
  setAudioVolume: (vol: number) => void;
  audioSubliminalPlaying: boolean;
  playSubliminalAudio: () => void;
  stopSubliminalAudio: () => void;
}

const PresetTreatment = ({
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
  receptorName = '',
  setReceptorName = () => {},
  audioFile,
  setAudioFile,
  audioVolume,
  setAudioVolume,
  audioSubliminalPlaying,
  playSubliminalAudio,
  stopSubliminalAudio,
}: PresetTreatmentProps) => {
  // Organize props into logical groups for better readability
  const controlProps = {
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
    startTreatment,
    stopTreatment,
    hypnoticSpeed,
    setHypnoticSpeed,
    receptorName,
    audioFile,
    setAudioFile,
    audioVolume,
    setAudioVolume,
    audioSubliminalPlaying,
    playSubliminalAudio,
    stopSubliminalAudio
  };

  const imageProps = {
    radionicImage,
    setRadionicImage,
    receptorImage,
    setReceptorImage,
    radionicImages,
    setRadionicImages,
    receptorImages,
    setReceptorImages,
    currentImage,
    hypnoticEffect
  };

  const rateProps = {
    rate1,
    setRate1,
    rate2,
    setRate2,
    rate3,
    setRate3
  };

  const receptorProps = {
    receptorName,
    setReceptorName
  };

  return (
    <PresetTreatmentLayout
      presets={presets}
      selectedPreset={selectedPreset}
      isPlaying={isPlaying}
      onSelectPreset={onSelectPreset}
      controlProps={controlProps}
      imageProps={imageProps}
      rateProps={rateProps}
      receptorProps={receptorProps}
    />
  );
};

export default PresetTreatment;
