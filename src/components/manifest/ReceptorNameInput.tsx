
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ReceptorNameInputProps {
  receptorName: string;
  setReceptorName: (name: string) => void;
  isActive: boolean;
}

const ReceptorNameInput = ({
  receptorName,
  setReceptorName,
  isActive,
}: ReceptorNameInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="manifestReceptorName" className="text-sm font-medium">
        Nombre del Receptor
      </Label>
      <Input
        id="manifestReceptorName"
        placeholder="Ingrese el nombre del receptor"
        value={receptorName}
        onChange={(e) => setReceptorName(e.target.value)}
        maxLength={50}
        className="focus:ring-primary"
        disabled={isActive}
      />
      <p className="text-xs text-muted-foreground">
        {receptorName.length}/50 caracteres
      </p>
    </div>
  );
};

export default ReceptorNameInput;
