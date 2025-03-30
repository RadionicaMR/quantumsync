
import PresetSelector, { TreatmentPreset } from './PresetSelector';
import TreatmentControls from './TreatmentControls';
import TreatmentVisualizer from './TreatmentVisualizer';
import ImageUploader from './image-uploader/ImageUploader';
import RateInputs from './RateInputs';
import { Card } from '@/components/ui/card';

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
  // Add the properties needed for TreatmentVisualizer
  radionicImage: string | null;
  setRadionicImage: (image: string | null) => void;
  receptorImage: string | null;
  setReceptorImage: (image: string | null) => void;
  radionicImages: string[];
  setRadionicImages: (images: string[]) => void;
  receptorImages: string[];
  setReceptorImages: (images: string[]) => void;
  currentImage: 'radionic' | 'receptor';
  hypnoticEffect: boolean;
  rate1: string;
  setRate1: (value: string) => void;
  rate2: string;
  setRate2: (value: string) => void;
  rate3: string;
  setRate3: (value: string) => void;
  hypnoticSpeed: number[];
  setHypnoticSpeed: (value: number[]) => void;
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
  // Add the properties for TreatmentVisualizer and image uploaders
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
}: PresetTreatmentProps) => {
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
            radionicImage={radionicImage}
            hypnoticSpeed={hypnoticSpeed}
            setHypnoticSpeed={setHypnoticSpeed}
          />
          
          {/* Moved image uploaders inside the main Card */}
          <div className="mt-6">
            <h3 className="font-semibold mb-4">Imágenes del Tratamiento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ImageUploader
                title="Imagen del RECEPTOR"
                subtitle="Sujeto del tratamiento"
                image={receptorImage}
                setImage={setReceptorImage}
                images={receptorImages}
                setImages={setReceptorImages}
                isPlaying={isPlaying}
              />
              
              <ImageUploader
                title="Gráfico RADIÓNICO"
                subtitle="Patrones de tratamiento"
                image={radionicImage}
                setImage={setRadionicImage}
                images={radionicImages}
                setImages={setRadionicImages}
                isPlaying={isPlaying}
              />
            </div>
          </div>

          {/* Add rate inputs inside the Card */}
          <div className="mt-6">
            <h3 className="font-semibold mb-4">Configuración de RATES</h3>
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
        </Card>

        {/* Add TreatmentVisualizer when active */}
        {isPlaying && visualFeedback && (
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Visualización del Tratamiento</h3>
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
          </Card>
        )}
      </div>
    </div>
  );
};

export default PresetTreatment;
