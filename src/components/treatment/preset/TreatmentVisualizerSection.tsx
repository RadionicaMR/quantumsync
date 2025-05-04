
import React from 'react';
import { Card } from '@/components/ui/card';
import TreatmentVisualizer from '@/components/treatment/TreatmentVisualizer';
import SettingsToggles from '@/components/treatment/SettingsToggles';
import TreatmentActions from '@/components/treatment/TreatmentActions';
import ImageUploaderSection from './ImageUploaderSection';
import RateSection from './RateSection';
import ReceptorSection from './ReceptorSection';
import AudioSubliminalSection from './AudioSubliminalSection';

interface TreatmentVisualizerSectionProps {
  radionicImage: string | null;
  setRadionicImage: (image: string | null) => void;
  radionicImages: string[];
  setRadionicImages: (images: string[]) => void;
  receptorImage: string | null;
  setReceptorImage: (image: string | null) => void;
  receptorImages: string[];
  setReceptorImages: (images: string[]) => void;
  currentImage: 'radionic' | 'receptor' | 'mix' | 'pattern';
  hypnoticEffect: boolean;
  visualFeedback: boolean;
  setVisualFeedback: (value: boolean) => void;
  useHeadphones: boolean;
  setUseHeadphones: (value: boolean) => void;
  frequency: number[];
  intensity: number[];
  rate1: string;
  rate2: string;
  rate3: string;
  hypnoticSpeed: number[];
  isPlaying: boolean;
  timeRemaining: number;
  formatTime: (minutes: number) => string;
  startTreatment: () => void;
  stopTreatment: () => void;
  receptorName: string;
  backgroundModeActive?: boolean;
}

const TreatmentVisualizerSection = ({
  radionicImage,
  setRadionicImage,
  radionicImages,
  setRadionicImages,
  receptorImage,
  setReceptorImage,
  receptorImages,
  setReceptorImages,
  currentImage,
  hypnoticEffect,
  visualFeedback,
  setVisualFeedback,
  useHeadphones,
  setUseHeadphones,
  frequency,
  intensity,
  rate1,
  rate2,
  rate3,
  hypnoticSpeed,
  isPlaying,
  timeRemaining,
  formatTime,
  startTreatment,
  stopTreatment,
  receptorName,
  backgroundModeActive = false,
}: TreatmentVisualizerSectionProps) => {
  return (
    <div className="mb-8">
      <Card className="p-6 quantum-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Visualizador de Tratamiento</h3>
          <div>
            <SettingsToggles 
              useHeadphones={useHeadphones}
              setUseHeadphones={setUseHeadphones}
              visualFeedback={visualFeedback}
              setVisualFeedback={setVisualFeedback}
              isPlaying={isPlaying}
            />
          </div>
        </div>
        
        <TreatmentVisualizer 
          radionicImage={radionicImage}
          radionicImages={radionicImages}
          receptorImage={receptorImage}
          receptorImages={receptorImages}
          currentImage={currentImage}
          hypnoticEffect={hypnoticEffect}
          visualFeedback={visualFeedback}
          frequency={frequency}
          intensity={intensity}
          rate1={rate1}
          rate2={rate2}
          rate3={rate3}
          hypnoticSpeed={hypnoticSpeed}
          isPlaying={isPlaying}
        />
        
        <div className="mt-6">
          <TreatmentActions 
            isPlaying={isPlaying}
            timeRemaining={timeRemaining}
            formatTime={formatTime}
            startTreatment={startTreatment}
            stopTreatment={stopTreatment}
            receptorName={receptorName}
            backgroundModeActive={backgroundModeActive}
          />
        </div>
      </Card>
    </div>
  );
};

export default TreatmentVisualizerSection;
