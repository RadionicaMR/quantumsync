
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface IntentionInputProps {
  intention: string;
  setIntention: (value: string) => void;
  isDisabled: boolean;
}

const IntentionInput = ({
  intention,
  setIntention,
  isDisabled
}: IntentionInputProps) => {
  return (
    <div>
      <Label htmlFor="intention" className="mb-2 block">Establece tu intención</Label>
      <Textarea 
        id="intention" 
        placeholder="Escribe tu intención con claridad y precisión..."
        className="min-h-[100px] quantum-input"
        value={intention}
        onChange={(e) => setIntention(e.target.value)}
        disabled={isDisabled}
      />
    </div>
  );
};

export default IntentionInput;
