
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface PersonNameInputProps {
  personName: string;
  setPersonName: (name: string) => void;
  isPlaying: boolean;
}

const PersonNameInput = ({ personName, setPersonName, isPlaying }: PersonNameInputProps) => {
  return (
    <div className="mb-6">
      <Label htmlFor="personName" className="block mb-2">
        Nombre de la persona a tratar
      </Label>
      <Input
        id="personName"
        value={personName}
        onChange={(e) => setPersonName(e.target.value)}
        placeholder="Ingresa el nombre"
        maxLength={100}
        className="bg-quantum-dark/30 border-quantum-primary/30"
        disabled={isPlaying}
      />
    </div>
  );
};

export default PersonNameInput;
