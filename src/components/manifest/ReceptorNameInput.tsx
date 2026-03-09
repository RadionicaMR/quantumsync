
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
    <div className="space-y-2 p-4 rounded-lg border-2 border-primary/40 bg-primary/5">
      <Label htmlFor="manifestReceptorName" className="text-sm font-semibold text-primary">
        Nombre del Receptor
      </Label>
      <Input
        id="manifestReceptorName"
        placeholder="Ingrese el nombre del receptor"
        value={receptorName}
        onChange={(e) => setReceptorName(e.target.value)}
        maxLength={100}
        className="focus:ring-primary border-primary/30"
        disabled={isActive}
      />
      <p className="text-xs text-muted-foreground">
        {receptorName.length}/100 caracteres
      </p>
    </div>
  );
};

export default ReceptorNameInput;
