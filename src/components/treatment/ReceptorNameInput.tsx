
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ReceptorNameInputProps {
  receptorName: string;
  setReceptorName: (name: string) => void;
  isPlaying: boolean;
}

const ReceptorNameInput = ({
  receptorName,
  setReceptorName,
  isPlaying,
}: ReceptorNameInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="receptorName" className="text-sm font-medium">
        Nombre del Receptor
      </Label>
      <Input
        id="receptorName"
        placeholder="Ingrese el nombre del receptor"
        value={receptorName}
        onChange={(e) => setReceptorName(e.target.value)}
        maxLength={50}
        className="focus:ring-primary"
        disabled={isPlaying}
      />
      <p className="text-xs text-muted-foreground">
        {receptorName.length}/50 caracteres
      </p>
    </div>
  );
};

export default ReceptorNameInput;
