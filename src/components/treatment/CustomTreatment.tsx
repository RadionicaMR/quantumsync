
import React from 'react';
import TreatmentLeftPanel from './customTreatment/TreatmentLeftPanel';
import TreatmentRightPanel from './customTreatment/TreatmentRightPanel';

interface CustomTreatmentProps {
  frequency: number[];
  setFrequency: (frequency: number[]) => void;
  duration: number[];
  setDuration: (duration: number[]) => void;
  intensity: number[];
  setIntensity: (intensity: number[]) => void;
  rate1: string;
  setRate1: (rate: string) => void;
  rate2: string;
  setRate2: (rate: string) => void;
  rate3: string;
  setRate3: (rate: string) => void;
  radionicImage: string | null;
  setRadionicImage: (image: string | null) => void;
  radionicImages: string[];
  setRadionicImages: (images: string[]) => void;
  receptorImage: string | null;
  setReceptorImage: (image: string | null) => void;
  receptorImages: string[];
  setReceptorImages: (images: string[]) => void;
  hypnoticSpeed: number[];
  setHypnoticSpeed: (speed: number[]) => void;
  useHeadphones: boolean;
  setUseHeadphones: (useHeadphones: boolean) => void;
  visualFeedback: boolean;
  setVisualFeedback: (visualFeedback: boolean) => void;
  isPlaying: boolean;
  timeRemaining: number | null;
  formatTime: (time: number | null) => string;
  currentImage: 'radionic' | 'receptor' | 'mix';
  hypnoticEffect: boolean;
  startTreatment: () => void;
  stopTreatment: () => void;
  receptorName: string;
  setReceptorName: (name: string) => void;
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  audioVolume: number;
  setAudioVolume: (volume: number) => void;
  audioSubliminalPlaying: boolean;
  playSubliminalAudio: () => void;
  stopSubliminalAudio: () => void;
  audioLoop?: boolean;
  setAudioLoop?: (loop: boolean) => void;
  clearAudio?: () => void;
  backgroundModeActive?: boolean;
  intention?: string; // Add intention prop
}

const CustomTreatment: React.FC<CustomTreatmentProps> = ({
  frequency,
  setFrequency,
  duration,
  setDuration,
  intensity,
  setIntensity,
  rate1,
  setRate1,
  rate2,
  setRate2,
  rate3,
  setRate3,
  radionicImage,
  setRadionicImage,
  radionicImages,
  setRadionicImages,
  receptorImage,
  setReceptorImage,
  receptorImages,
  setReceptorImages,
  hypnoticSpeed,
  setHypnoticSpeed,
  useHeadphones,
  setUseHeadphones,
  visualFeedback,
  setVisualFeedback,
  isPlaying,
  timeRemaining,
  formatTime,
  currentImage,
  hypnoticEffect,
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
  audioLoop = true,
  setAudioLoop = () => {},
  clearAudio = () => {},
  backgroundModeActive = false,
  intention = "" // Default to empty string
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <TreatmentLeftPanel
        frequency={frequency}
        setFrequency={setFrequency}
        duration={duration}
        setDuration={setDuration}
        intensity={intensity}
        setIntensity={setIntensity}
        rate1={rate1}
        setRate1={setRate1}
        rate2={rate2}
        setRate2={setRate2}
        rate3={rate3}
        setRate3={setRate3}
        hypnoticSpeed={hypnoticSpeed}
        setHypnoticSpeed={setHypnoticSpeed}
        isPlaying={isPlaying}
        receptorName={receptorName}
        setReceptorName={setReceptorName}
      />
      
      <TreatmentRightPanel
        isPlaying={isPlaying}
        timeRemaining={timeRemaining}
        formatTime={formatTime}
        startTreatment={startTreatment}
        stopTreatment={stopTreatment}
        visualFeedback={visualFeedback}
        setVisualFeedback={setVisualFeedback}
        useHeadphones={useHeadphones}
        setUseHeadphones={setUseHeadphones}
        radionicImage={radionicImage}
        setRadionicImage={setRadionicImage}
        radionicImages={radionicImages}
        setRadionicImages={setRadionicImages}
        receptorImage={receptorImage}
        setReceptorImage={setReceptorImage}
        receptorImages={receptorImages}
        setReceptorImages={setReceptorImages}
        currentImage={currentImage}
        hypnoticEffect={hypnoticEffect}
        frequency={frequency}
        intensity={intensity}
        rate1={rate1}
        rate2={rate2}
        rate3={rate3}
        hypnoticSpeed={hypnoticSpeed}
        receptorName={receptorName}
        audioFile={audioFile}
        setAudioFile={setAudioFile}
        audioVolume={audioVolume}
        setAudioVolume={setAudioVolume}
        audioSubliminalPlaying={audioSubliminalPlaying}
        playSubliminalAudio={playSubliminalAudio}
        stopSubliminalAudio={stopSubliminalAudio}
        audioLoop={audioLoop}
        setAudioLoop={setAudioLoop}
        clearAudio={clearAudio}
        backgroundModeActive={backgroundModeActive}
        intention={intention} // Pass intention to the right panel
      />
    </div>
  );
};

export default CustomTreatment;
