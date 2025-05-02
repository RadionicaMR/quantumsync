
import React from 'react';
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
  return (
    <div className="mb-6">
      <Label htmlFor="intention" className="mb-2 block">Establece tu intención</Label>
      <Textarea 
        id="intention" 
        placeholder="Escribe tu intención con claridad y precisión..."
        className="quantum-input"
        value={intention}
        onChange={(e) => setIntention(e.target.value)}
        rows={4}
      />
    </div>
  );
};

export default IntentionInput;
