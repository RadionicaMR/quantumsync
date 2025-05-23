
import React from 'react';
import { TreatmentPreset } from '@/hooks/treatment/useTreatmentCore';
import TreatmentVisualizerSection from './TreatmentVisualizerSection';
import ImageUploaderSection from './ImageUploaderSection';
import ReceptorSection from './ReceptorSection';
import AudioSubliminalSection from './AudioSubliminalSection';
import RateSection from './RateSection';

interface PresetTreatmentLayoutProps {
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
}

const PresetTreatmentLayout: React.FC<PresetTreatmentLayoutProps> = ({
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
  intention = "" // Default to empty string
}) => {
  // Find the selected preset
  const preset = presets.find(p => p.id === selectedPreset);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        {/* Preset Selection */}
        <div className="bg-card/90 dark:bg-black/40 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Seleccionar Preajuste</h3>
          <div className="space-y-2">
            {presets.map((p) => (
              <button
                key={p.id}
                className={`w-full text-left px-4 py-2 rounded-md hover:bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-secondary ${selectedPreset === p.id ? 'bg-secondary text-secondary-foreground' : 'bg-transparent'}`}
                onClick={() => onSelectPreset(p)}
              >
                {p.name} ({p.frequency} Hz)
              </button>
            ))}
          </div>
        </div>

        {/* Frequency Controls */}
        <div className="bg-card/90 dark:bg-black/40 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Ajustes de Frecuencia</h3>
          <p className="text-muted-foreground">
            Frecuencia: {frequency[0]} Hz
            <br />
            Duración: {duration[0]} minutos
            <br />
            Intensidad: {intensity[0]}%
          </p>
        </div>
      </div>
      
      <div className="lg:col-span-2 space-y-6">
        <TreatmentVisualizerSection 
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
          receptorImage={receptorImage}
          radionicImages={radionicImages}
          receptorImages={receptorImages}
          currentImage={currentImage}
          hypnoticEffect={hypnoticEffect}
          frequency={frequency}
          intensity={intensity}
          rate1={rate1}
          rate2={rate2}
          rate3={rate3}
          hypnoticSpeed={hypnoticSpeed}
          receptorName={receptorName}
          backgroundModeActive={backgroundModeActive}
          intention={intention} // Pass intention to visualizer section
        />
        
        <ImageUploaderSection 
          isPlaying={isPlaying}
          radionicImage={radionicImage}
          setRadionicImage={setRadionicImage}
          radionicImages={radionicImages}
          setRadionicImages={setRadionicImages}
          receptorImage={receptorImage}
          setReceptorImage={setReceptorImage}
          receptorImages={receptorImages}
          setReceptorImages={setReceptorImages}
        />
        
        <ReceptorSection 
          receptorName={receptorName}
          setReceptorName={setReceptorName}
          isPlaying={isPlaying}
        />
        
        <RateSection
          rate1={rate1}
          setRate1={setRate1}
          rate2={rate2}
          setRate2={setRate2}
          rate3={rate3}
          setRate3={setRate3}
          isPlaying={isPlaying}
        />
        
        <AudioSubliminalSection 
          audioFile={audioFile}
          setAudioFile={setAudioFile}
          audioVolume={audioVolume}
          setAudioVolume={setAudioVolume}
          audioSubliminalPlaying={audioSubliminalPlaying}
          playSubliminalAudio={playSubliminalAudio}
          stopSubliminalAudio={stopSubliminalAudio}
          isPlaying={isPlaying}
        />
      </div>
    </div>
  );
};

export default PresetTreatmentLayout;
