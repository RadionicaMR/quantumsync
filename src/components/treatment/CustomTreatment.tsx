
import FrequencyControls from './FrequencyControls';
import RateInputs from './RateInputs';
import ImageGrid from './ImageGrid';
import SettingsToggles from './SettingsToggles';
import TreatmentActions from './TreatmentActions';
import TreatmentVisualizer from './TreatmentVisualizer';

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
  currentImage: 'radionic' | 'receptor';
  hypnoticEffect: boolean;
  startTreatment: () => void;
  stopTreatment: () => void;
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
  } = props;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Panel izquierdo - Controles */}
      <div className="lg:col-span-1 w-full">
        <div className="space-y-6 w-full">
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
          
          <RateInputs
            rate1={rate1}
            setRate1={setRate1}
            rate2={rate2}
            setRate2={setRate2}
            rate3={rate3}
            setRate3={setRate3}
            isPlaying={isPlaying}
          />
        </div>
      </div>
      
      {/* Panel derecho - Upload y visualización */}
      <div className="lg:col-span-2 w-full">
        <div className="space-y-6 w-full">
          <ImageGrid 
            radionicImage={radionicImage}
            setRadionicImage={setRadionicImage}
            radionicImages={radionicImages}
            setRadionicImages={setRadionicImages}
            receptorImage={receptorImage}
            setReceptorImage={setReceptorImage}
            receptorImages={receptorImages}
            setReceptorImages={setReceptorImages}
            isPlaying={isPlaying}
          />
          
          <SettingsToggles 
            useHeadphones={useHeadphones}
            setUseHeadphones={setUseHeadphones}
            visualFeedback={visualFeedback}
            setVisualFeedback={setVisualFeedback}
            isPlaying={isPlaying}
          />
          
          <TreatmentActions 
            isPlaying={isPlaying}
            timeRemaining={timeRemaining}
            formatTime={formatTime}
            startTreatment={startTreatment}
            stopTreatment={stopTreatment}
            radionicImage={radionicImage}
          />
          
          <TreatmentVisualizer 
            isPlaying={isPlaying}
            visualFeedback={visualFeedback}
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
          />
        </div>
      </div>
    </div>
  );
};

export default CustomTreatment;
