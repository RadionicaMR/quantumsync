
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface PersonNameInputProps {
  personName: string;
  setPersonName: (name: string) => void;
}

const PersonNameInput: React.FC<PersonNameInputProps> = ({ personName, setPersonName }) => {
  return (
    <div className="w-full max-w-xs mb-6">
      <Label htmlFor="personName" className="text-sm font-medium mb-1 block">
        Nombre de la persona
      </Label>
      <Input 
        id="personName"
        value={personName}
        onChange={(e) => setPersonName(e.target.value)}
        placeholder="Ingresa el nombre"
        className="bg-quantum-dark/30 border-quantum-primary/30"
      />
    </div>
  );
};

export default PersonNameInput;
