
import FrequencyControls from '../FrequencyControls';
import ReceptorNameInput from '../ReceptorNameInput';

interface TreatmentLeftPanelProps {
  frequency: number[];
  setFrequency: (value: number[]) => void;
  duration: number[];
  setDuration: (value: number[]) => void;
  intensity: number[];
  setIntensity: (value: number[]) => void;
  hypnoticSpeed: number[];
  setHypnoticSpeed: (value: number[]) => void;
  isPlaying: boolean;
  receptorName: string;
  setReceptorName: (name: string) => void;
}

const TreatmentLeftPanel = ({
  frequency, setFrequency,
  duration, setDuration,
  intensity, setIntensity,
  hypnoticSpeed, setHypnoticSpeed,
  isPlaying,
  receptorName, setReceptorName
}: TreatmentLeftPanelProps) => {
  return (
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
      
      <ReceptorNameInput
        receptorName={receptorName}
        setReceptorName={setReceptorName}
        isPlaying={isPlaying}
      />
    </div>
  );
};

export default TreatmentLeftPanel;
