
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export type BalanceOption = 'all' | 'blocked';

interface BalanceOptionsProps {
  balanceOption: BalanceOption;
  setBalanceOption: (value: BalanceOption) => void;
  isPlaying: boolean;
}

const BalanceOptions = ({ balanceOption, setBalanceOption, isPlaying }: BalanceOptionsProps) => {
  return (
    <div className="mb-6">
      <Label className="block mb-2">
        Opción de equilibrado
      </Label>
      <RadioGroup 
        value={balanceOption} 
        onValueChange={(value) => setBalanceOption(value as BalanceOption)}
        className="flex flex-col space-y-2"
        disabled={isPlaying}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="all" id="option-all" />
          <Label htmlFor="option-all" className="cursor-pointer">
            Equilibrar todos los chakras
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="blocked" id="option-blocked" />
          <Label htmlFor="option-blocked" className="cursor-pointer">
            Equilibrar solo chakras cerrados o bloqueados
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default BalanceOptions;
