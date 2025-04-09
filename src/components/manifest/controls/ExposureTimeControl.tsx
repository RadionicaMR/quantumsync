
import { Clock } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

interface ExposureTimeControlProps {
  exposureTime: number[];
  setExposureTime: (value: number[]) => void;
  isDisabled: boolean;
}

const ExposureTimeControl = ({
  exposureTime,
  setExposureTime,
  isDisabled
}: ExposureTimeControlProps) => {
  const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 180) {
      setExposureTime([value]);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <Label className="flex items-center gap-2">
          <Clock size={16} className="text-quantum-primary" />
          Tiempo de Exposición:
        </Label>
        <div className="flex items-center">
          <Input
            type="number"
            value={exposureTime[0]}
            onChange={handleTimeInputChange}
            disabled={isDisabled}
            className="w-24 ml-2"
            min={1}
            max={180}
          />
          <span className="ml-2 text-sm text-muted-foreground">min</span>
        </div>
      </div>
      <Slider
        min={1}
        max={180}
        step={1}
        value={exposureTime}
        onValueChange={setExposureTime}
        disabled={isDisabled}
        className="mb-4"
      />
    </div>
  );
};

export default ExposureTimeControl;
