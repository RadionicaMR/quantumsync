
import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ManifestationBoxProps {
  intention: string;
  setIntention: (value: string) => void;
  isDisabled?: boolean;
}

const ManifestationBox = ({
  intention,
  setIntention,
  isDisabled = false
}: ManifestationBoxProps) => {
  const handleIntentionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value.slice(0, 1500);
    console.log("ManifestationBox - Setting new intention:", newValue);
    setIntention(newValue);
  };

  return (
    <Card className="p-4 quantum-card border-quantum-primary">
      <div className="mb-2">
        <Label htmlFor="manifestation" className="text-xl font-bold text-center block">
          MANIFESTACIÓN
        </Label>
        <Textarea 
          id="manifestation" 
          placeholder="Escribe aquí tu manifestación deseada..."
          className="quantum-input min-h-[120px] mt-2 border-2 border-quantum-primary"
          value={intention}
          onChange={handleIntentionChange}
          disabled={isDisabled}
          rows={4}
          maxLength={1500}
        />
        <p className="text-xs text-muted-foreground mt-1 text-right">
          {intention.length}/1500 caracteres
        </p>
      </div>
    </Card>
  );
};

export default ManifestationBox;
