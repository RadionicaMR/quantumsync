
import { Card } from "@/components/ui/card";
import TreatmentVisualizer from "../TreatmentVisualizer";
import TreatmentActions from "../TreatmentActions";
import SettingsToggles from "../SettingsToggles";

interface TreatmentVisualizerSectionProps {
  isPlaying: boolean;
  timeRemaining: number | null;
  formatTime: (time: number | null) => string;
  startTreatment: () => void;
  stopTreatment: () => void;
  visualFeedback: boolean;
  setVisualFeedback: (value: boolean) => void;
  useHeadphones: boolean;
  setUseHeadphones: (value: boolean) => void;
  radionicImage: string | null;
  receptorImage: string | null;
  radionicImages: string[];
  receptorImages: string[];
  currentImage: 'radionic' | 'receptor' | 'mix';
  hypnoticEffect: boolean;
  frequency: number[];
  intensity: number[];
  rate1: string;
  rate2: string;
  rate3: string;
  hypnoticSpeed?: number[];
  receptorName?: string;
  backgroundModeActive?: boolean;
  intention?: string;
}

const TreatmentVisualizerSection: React.FC<TreatmentVisualizerSectionProps> = ({
  isPlaying,
  timeRemaining,
  formatTime,
  startTreatment,
  stopTreatment,
  visualFeedback,
  setVisualFeedback,
  useHeadphones,
  setUseHeadphones,
  radionicImage,
  receptorImage,
  radionicImages,
  receptorImages,
  currentImage,
  hypnoticEffect,
  frequency,
  intensity,
  rate1,
  rate2,
  rate3,
  hypnoticSpeed = [10],
  receptorName = "",
  backgroundModeActive = false,
  intention = ""
}) => {
  return (
    <div className="space-y-6">
      <Card className="bg-card/90 dark:bg-black/40 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Visualización de Tratamiento</h3>
        
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
          receptorName={receptorName}
          intention={intention}
        />
      </Card>
      
      <Card className="bg-card/90 dark:bg-black/40 p-6 rounded-lg">
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
        
        <div className="mt-4">
          <SettingsToggles 
            useHeadphones={useHeadphones}
            setUseHeadphones={setUseHeadphones}
            visualFeedback={visualFeedback}
            setVisualFeedback={setVisualFeedback}
            isPlaying={isPlaying}
          />
        </div>
      </Card>
    </div>
  );
};

export default TreatmentVisualizerSection;
