
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEffect } from 'react';

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
  // Log intention changes for debugging
  useEffect(() => {
    console.log("IntentionInput - Current intention value:", intention);
  }, [intention]);

  const handleIntentionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    console.log("IntentionInput - Setting new intention:", newValue);
    setIntention(newValue);
  };

  return (
    <div>
      <Label htmlFor="intention" className="mb-2 block">Establece tu intención</Label>
      <Textarea 
        id="intention" 
        placeholder="Escribe tu intención con claridad y precisión..."
        className="quantum-input"
        value={intention}
        onChange={handleIntentionChange}
        disabled={isDisabled}
        rows={4}
      />
    </div>
  );
};

export default IntentionInput;
