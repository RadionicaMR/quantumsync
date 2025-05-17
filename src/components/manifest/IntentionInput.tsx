
import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface IntentionInputProps {
  intention: string;
  setIntention: (value: string) => void;
}

const IntentionInput: React.FC<IntentionInputProps> = ({
  intention,
  setIntention
}) => {
  // Log intention changes for debugging
  useEffect(() => {
    console.log("IntentionInput main - Current intention value:", intention);
  }, [intention]);

  const handleIntentionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    console.log("IntentionInput main - Setting new intention:", newValue);
    setIntention(newValue);
  };

  return (
    <div className="mb-6">
      <Label htmlFor="intention" className="mb-2 block">Establece tu intención</Label>
      <Textarea 
        id="intention" 
        placeholder="Escribe tu intención con claridad y precisión..."
        className="quantum-input"
        value={intention}
        onChange={handleIntentionChange}
        rows={4}
      />
    </div>
  );
};

export default IntentionInput;
