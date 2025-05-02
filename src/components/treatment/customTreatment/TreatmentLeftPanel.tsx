
import FrequencyControls from '../FrequencyControls';
import RateInputs from '../RateInputs';
import ReceptorNameInput from '../ReceptorNameInput';

interface TreatmentLeftPanelProps {
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
  hypnoticSpeed: number[];
  setHypnoticSpeed: (value: number[]) => void;
  isPlaying: boolean;
  receptorName: string;
  setReceptorName: (name: string) => void;
}

const TreatmentLeftPanel = ({
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
  hypnoticSpeed,
  setHypnoticSpeed,
  isPlaying,
  receptorName,
  setReceptorName
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
      
      <RateInputs
        rate1={rate1}
        setRate1={setRate1}
        rate2={rate2}
        setRate2={setRate2}
        rate3={rate3}
        setRate3={setRate3}
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
