
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RateInputsProps {
  rate1: string;
  setRate1: (value: string) => void;
  rate2: string;
  setRate2: (value: string) => void;
  rate3: string;
  setRate3: (value: string) => void;
  isPlaying: boolean;
}

const RateInputs = ({
  rate1,
  setRate1,
  rate2,
  setRate2,
  rate3,
  setRate3,
  isPlaying,
}: RateInputsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col">
        <Label htmlFor="rate1" className="mb-1">RATE 1</Label>
        <Input
          id="rate1"
          type="text"
          maxLength={30}
          placeholder="Ingrese RATE 1"
          value={rate1}
          onChange={(e) => setRate1(e.target.value)}
          disabled={isPlaying}
          className={isPlaying ? "animate-[pulse_1s_ease-in-out_infinite] bg-quantum-primary/10" : ""}
        />
      </div>
      
      <div className="flex flex-col">
        <Label htmlFor="rate2" className="mb-1">RATE 2</Label>
        <Input
          id="rate2"
          type="text"
          maxLength={30}
          placeholder="Ingrese RATE 2"
          value={rate2}
          onChange={(e) => setRate2(e.target.value)}
          disabled={isPlaying}
          className={isPlaying ? "animate-[pulse_1.2s_ease-in-out_infinite] bg-quantum-primary/10" : ""}
        />
      </div>
      
      <div className="flex flex-col">
        <Label htmlFor="rate3" className="mb-1">RATE 3</Label>
        <Input
          id="rate3"
          type="text"
          maxLength={30}
          placeholder="Ingrese RATE 3"
          value={rate3}
          onChange={(e) => setRate3(e.target.value)}
          disabled={isPlaying}
          className={isPlaying ? "animate-[pulse_1.4s_ease-in-out_infinite] bg-quantum-primary/10" : ""}
        />
      </div>
    </div>
  );
};

export default RateInputs;
