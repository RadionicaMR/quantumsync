
import RateInputs from '../RateInputs';

interface RateSectionProps {
  rate1: string;
  setRate1: (value: string) => void;
  rate2: string;
  setRate2: (value: string) => void;
  rate3: string;
  setRate3: (value: string) => void;
  isPlaying: boolean;
}

const RateSection = ({
  rate1,
  setRate1,
  rate2,
  setRate2,
  rate3,
  setRate3,
  isPlaying,
}: RateSectionProps) => {
  return (
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
  );
};

export default RateSection;
