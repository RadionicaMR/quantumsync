
import React from 'react';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import FrequencyControls from './FrequencyControls';
import TreatmentActions from './TreatmentActions';
import SettingsToggles from './SettingsToggles';
import ImageUploaderSection from './preset/ImageUploaderSection';
import AudioSubliminalSection from './preset/AudioSubliminalSection';
import RateSection from './preset/RateSection';
import TreatmentVisualizerSection from './preset/TreatmentVisualizerSection';

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
  rate4?: string;
  setRate4?: (rate: string) => void;
  rate5?: string;
  setRate5?: (rate: string) => void;
  rate6?: string;
  setRate6?: (rate: string) => void;
  rate7?: string;
  setRate7?: (rate: string) => void;
  rate8?: string;
  setRate8?: (rate: string) => void;
  rate9?: string;
  setRate9?: (rate: string) => void;
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
  intention?: string;
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
  rate4 = '',
  setRate4 = () => {},
  rate5 = '',
  setRate5 = () => {},
  rate6 = '',
  setRate6 = () => {},
  rate7 = '',
  setRate7 = () => {},
  rate8 = '',
  setRate8 = () => {},
  rate9 = '',
  setRate9 = () => {},
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
  intention = ""
}) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-card/90 dark:bg-black/40 p-6 rounded-lg">
          <h3 className="text-base font-semibold mb-1.5">{t('preset.frequencySettings')}</h3>
          <FrequencyControls
            frequency={frequency}
            setFrequency={setFrequency}
            duration={duration}
            setDuration={setDuration}
            intensity={intensity}
            setIntensity={setIntensity}
            hypnoticSpeed={hypnoticSpeed}
            setHypnoticSpeed={setHypnoticSpeed}
            isPlaying={isPlaying}
          />
        </div>

        <AudioSubliminalSection
          audioFile={audioFile}
          setAudioFile={setAudioFile}
          audioVolume={audioVolume}
          setAudioVolume={setAudioVolume}
          audioSubliminalPlaying={audioSubliminalPlaying}
          playSubliminalAudio={playSubliminalAudio}
          stopSubliminalAudio={stopSubliminalAudio}
          isPlaying={isPlaying}
          audioLoop={audioLoop}
          setAudioLoop={setAudioLoop}
          clearAudio={clearAudio}
        />

        <Card className={`bg-card/90 dark:bg-black/40 p-4 sm:p-6 rounded-lg ${isPlaying ? 'border-2 border-quantum-primary/60 bg-quantum-primary/5' : ''}`}>
          <SettingsToggles
            intensity={intensity}
            setIntensity={setIntensity}
            isPlaying={isPlaying}
          />

          <div className="mt-5 pt-5 border-t border-border">
            <TreatmentActions
              isPlaying={isPlaying}
              timeRemaining={timeRemaining}
              formatTime={formatTime}
              startTreatment={startTreatment}
              stopTreatment={stopTreatment}
              backgroundModeActive={backgroundModeActive}
              receptorName={receptorName}
              intention={intention}
            />
          </div>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-6">
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
          receptorName={receptorName}
          setReceptorName={setReceptorName}
        />

        <RateSection
          rate1={rate1}
          setRate1={setRate1}
          rate2={rate2}
          setRate2={setRate2}
          rate3={rate3}
          setRate3={setRate3}
          rate4={rate4}
          setRate4={setRate4}
          rate5={rate5}
          setRate5={setRate5}
          rate6={rate6}
          setRate6={setRate6}
          rate7={rate7}
          setRate7={setRate7}
          rate8={rate8}
          setRate8={setRate8}
          rate9={rate9}
          setRate9={setRate9}
          isPlaying={isPlaying}
        />

        <TreatmentVisualizerSection
          isPlaying={isPlaying}
          timeRemaining={timeRemaining}
          formatTime={formatTime}
          startTreatment={startTreatment}
          stopTreatment={stopTreatment}
          radionicImage={radionicImage}
          receptorImage={receptorImage}
          radionicImages={radionicImages}
          receptorImages={receptorImages}
          currentImage={currentImage}
          hypnoticEffect={hypnoticEffect}
          frequency={frequency}
          intensity={intensity}
          setIntensity={setIntensity}
          rate1={rate1}
          rate2={rate2}
          rate3={rate3}
          rate4={rate4}
          rate5={rate5}
          rate6={rate6}
          hypnoticSpeed={hypnoticSpeed}
          receptorName={receptorName}
          backgroundModeActive={backgroundModeActive}
          intention={intention}
          hideActions
        />
      </div>
    </div>
  );
};

export default CustomTreatment;
