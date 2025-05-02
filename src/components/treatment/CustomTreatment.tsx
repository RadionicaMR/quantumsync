import React from 'react';
import TreatmentLeftPanel from './customTreatment/TreatmentLeftPanel';
import TreatmentRightPanel from './customTreatment/TreatmentRightPanel';

interface CustomTreatmentProps {
  frequency: number[];
  setFrequency: (value: number[]) => void;
  duration: number[];
  setDuration: (value: number[]) => void;
  intensity: number[];
  setIntensity: (value: number[]) => void;
  rate1: string;
  setRate1: (value: string) => void;
  rate2: string;
  setRate2: (value: string) => void;
  rate3: string;
  setRate3: (value: string) => void;
  radionicImage: string | null;
  setRadionicImage: (image: string | null) => void;
  radionicImages: string[];
  setRadionicImages: (images: string[]) => void;
  receptorImage: string | null;
  setReceptorImage: (image: string | null) => void;
  receptorImages: string[];
  setReceptorImages: (images: string[]) => void;
  hypnoticSpeed: number[];
  setHypnoticSpeed: (value: number[]) => void;
  useHeadphones: boolean;
  setUseHeadphones: (value: boolean) => void;
  visualFeedback: boolean;
  setVisualFeedback: (value: boolean) => void;
  isPlaying: boolean;
  timeRemaining: number;
  formatTime: (minutes: number) => string;
  currentImage: 'radionic' | 'receptor' | 'mix';
  hypnoticEffect: boolean;
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
  audioLoop?: boolean;
  setAudioLoop?: (loop: boolean) => void;
  clearAudio?: () => void;
  backgroundModeActive?: boolean;
}

const CustomTreatment = (props: CustomTreatmentProps) => {
  const {
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
  } = props;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Panel izquierdo - Controles */}
      <div className="lg:col-span-1 w-full">
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
      </div>
      
      {/* Panel derecho - Upload y visualización */}
      <div className="lg:col-span-2 w-full">
        <TreatmentRightPanel
          radionicImage={radionicImage}
          setRadionicImage={setRadionicImage}
          radionicImages={radionicImages}
          setRadionicImages={setRadionicImages}
          receptorImage={receptorImage}
          setReceptorImage={setReceptorImage}
          receptorImages={receptorImages}
          setReceptorImages={setReceptorImages}
          useHeadphones={useHeadphones}
          setUseHeadphones={setUseHeadphones}
          visualFeedback={visualFeedback}
          setVisualFeedback={setVisualFeedback}
          isPlaying={isPlaying}
          timeRemaining={timeRemaining}
          formatTime={formatTime}
          currentImage={currentImage}
          hypnoticEffect={hypnoticEffect}
          startTreatment={startTreatment}
          stopTreatment={stopTreatment}
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
        />
      </div>
    </div>
  );
};

export default CustomTreatment;
