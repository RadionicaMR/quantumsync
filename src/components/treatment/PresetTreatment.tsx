
import PresetSelector, { TreatmentPreset } from './PresetSelector';
import TreatmentControls from './TreatmentControls';

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
      
      <div className="lg:col-span-2">
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
        />
      </div>
    </div>
  );
};

export default PresetTreatment;
