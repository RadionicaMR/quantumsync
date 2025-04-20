import { Card } from '@/components/ui/card';
import { TreatmentPreset } from '@/hooks/useTreatment';
import PresetSelector from '../PresetSelector';
import TreatmentControls from '../TreatmentControls';
import TreatmentVisualizer from '../TreatmentVisualizer';
import ImageUploaderSection from './ImageUploaderSection';
import RateSection from './RateSection';
import ReceptorSection from './ReceptorSection';
import TreatmentVisualizerSection from './TreatmentVisualizerSection';
import AudioSubliminalControls from '@/components/AudioSubliminalControls';

interface PresetTreatmentLayoutProps {
  presets: TreatmentPreset[];
  selectedPreset: string;
  isPlaying: boolean;
  onSelectPreset: (preset: TreatmentPreset) => void;
  controlProps: {
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
    startTreatment: () => void;
    stopTreatment: () => void;
    hypnoticSpeed: number[];
    setHypnoticSpeed: (value: number[]) => void;
    receptorName: string;
    audioFile: File | null;
    setAudioFile: (file: File | null) => void;
    audioVolume: number;
    setAudioVolume: (vol: number) => void;
    audioSubliminalPlaying: boolean;
    playSubliminalAudio: () => void;
    stopSubliminalAudio: () => void;
  };
  imageProps: {
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
  };
  rateProps: {
    rate1: string;
    setRate1: (value: string) => void;
    rate2: string;
    setRate2: (value: string) => void;
    rate3: string;
    setRate3: (value: string) => void;
  };
  receptorProps: {
    receptorName: string;
    setReceptorName: (name: string) => void;
  };
}

const PresetTreatmentLayout = ({
  presets,
  selectedPreset,
  isPlaying,
  onSelectPreset,
  controlProps,
  imageProps,
  rateProps,
  receptorProps,
}: PresetTreatmentLayoutProps) => {
  const { 
    frequency, setFrequency, duration, setDuration,
    intensity, setIntensity, useHeadphones, setUseHeadphones,
    visualFeedback, setVisualFeedback, timeRemaining, formatTime,
    startTreatment, stopTreatment, hypnoticSpeed, setHypnoticSpeed,
    receptorName,
    audioFile,
    setAudioFile,
    audioVolume,
    setAudioVolume,
    audioSubliminalPlaying,
    playSubliminalAudio,
    stopSubliminalAudio
  } = controlProps;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <PresetSelector 
          presets={presets}
          selectedPreset={selectedPreset}
          isPlaying={isPlaying}
          onSelectPreset={onSelectPreset}
        />
      </div>
      
      <div className="lg:col-span-2 space-y-6">
        <Card className="quantum-card p-6">
          <TreatmentControls
            selectedPreset={selectedPreset}
            presets={presets}
            frequency={frequency}
            setFrequency={setFrequency}
            duration={duration}
            setDuration={setDuration}
            intensity={intensity}
            setIntensity={setIntensity}
            setUseHeadphones={setUseHeadphones}
            useHeadphones={useHeadphones}
            visualFeedback={visualFeedback}
            setVisualFeedback={setVisualFeedback}
            isPlaying={isPlaying}
            timeRemaining={timeRemaining}
            startTreatment={startTreatment}
            stopTreatment={stopTreatment}
            formatTime={formatTime}
            hypnoticSpeed={hypnoticSpeed}
            setHypnoticSpeed={setHypnoticSpeed}
            receptorName={receptorName}
          />

          <ImageUploaderSection 
            isPlaying={isPlaying}
            radionicImage={imageProps.radionicImage}
            setRadionicImage={imageProps.setRadionicImage}
            receptorImage={imageProps.receptorImage}
            setReceptorImage={imageProps.setReceptorImage}
            radionicImages={imageProps.radionicImages}
            setRadionicImages={imageProps.setRadionicImages}
            receptorImages={imageProps.receptorImages}
            setReceptorImages={imageProps.setReceptorImages}
          />

          <AudioSubliminalControls
            audioFile={audioFile}
            setAudioFile={setAudioFile}
            audioVolume={audioVolume}
            setAudioVolume={setAudioVolume}
            isPlaying={isPlaying}
            playAudio={playSubliminalAudio}
            stopAudio={stopSubliminalAudio}
            maxVolume={20}
          />

          <ReceptorSection
            receptorName={receptorProps.receptorName}
            setReceptorName={receptorProps.setReceptorName}
            isPlaying={isPlaying}
          />

          <RateSection
            rate1={rateProps.rate1}
            setRate1={rateProps.setRate1}
            rate2={rateProps.rate2}
            setRate2={rateProps.setRate2}
            rate3={rateProps.rate3}
            setRate3={rateProps.setRate3}
            isPlaying={isPlaying}
          />
        </Card>

        <TreatmentVisualizerSection 
          isPlaying={isPlaying}
          visualFeedback={visualFeedback}
          radionicImage={imageProps.radionicImage}
          receptorImage={imageProps.receptorImage}
          radionicImages={imageProps.radionicImages}
          receptorImages={imageProps.receptorImages}
          currentImage={imageProps.currentImage}
          hypnoticEffect={imageProps.hypnoticEffect}
          frequency={frequency}
          intensity={intensity}
          rate1={rateProps.rate1}
          rate2={rateProps.rate2}
          rate3={rateProps.rate3}
          hypnoticSpeed={hypnoticSpeed}
          receptorName={receptorName}
        />
      </div>
    </div>
  );
};

export default PresetTreatmentLayout;
