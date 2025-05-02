
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ReceptorNameInputProps {
  receptorName: string;
  setReceptorName: (name: string) => void;
  isPlaying: boolean;
  isActive?: boolean; // Add optional isActive prop for backward compatibility
}

const ReceptorNameInput = ({
  receptorName,
  setReceptorName,
  isPlaying,
  isActive,
}: ReceptorNameInputProps) => {
  // Use isActive if provided, otherwise fall back to isPlaying
  const isDisabled = isActive !== undefined ? isActive : isPlaying;
  
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
        disabled={isDisabled}
      />
      <p className="text-xs text-muted-foreground">
        {receptorName.length}/50 caracteres
      </p>
    </div>
  );
};

export default ReceptorNameInput;
