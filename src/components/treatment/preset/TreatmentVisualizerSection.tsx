
import { Card } from '@/components/ui/card';
import TreatmentVisualizer from '../TreatmentVisualizer';

interface TreatmentVisualizerSectionProps {
  isPlaying: boolean;
  visualFeedback: boolean;
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
  hypnoticSpeed: number[];
  receptorName: string;
}

const TreatmentVisualizerSection = ({
  isPlaying,
  visualFeedback,
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
  hypnoticSpeed,
  receptorName,
}: TreatmentVisualizerSectionProps) => {
  if (!isPlaying || !visualFeedback) return null;

  return (
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
        receptorName={receptorName}
      />
    </Card>
  );
};

export default TreatmentVisualizerSection;
