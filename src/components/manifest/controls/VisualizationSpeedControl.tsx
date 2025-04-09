
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

interface VisualizationSpeedControlProps {
  visualSpeed: number[];
  setVisualSpeed: (value: number[]) => void;
  isDisabled: boolean;
}

const VisualizationSpeedControl = ({
  visualSpeed,
  setVisualSpeed,
  isDisabled
}: VisualizationSpeedControlProps) => {
  const handleSpeedInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 30) {
      setVisualSpeed([value]);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <Label>Velocidad de Visualización:</Label>
        <div className="flex items-center">
          <Input
            type="number"
            value={visualSpeed[0]}
            onChange={handleSpeedInputChange}
            disabled={isDisabled}
            className="w-24 ml-2"
            min={1}
            max={30}
          />
        </div>
      </div>
      <Slider
        min={1}
        max={30}
        step={1}
        value={visualSpeed}
        onValueChange={setVisualSpeed}
        disabled={isDisabled}
        className="mb-4"
      />
    </div>
  );
};

export default VisualizationSpeedControl;
