
import { Camera, Volume, Volume2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import QuantumButton from '@/components/QuantumButton';
import { Label } from '@/components/ui/label';

interface DiagnoseControlsProps {
  useCameraMode: boolean;
  setUseCameraMode: (value: boolean) => void;
  pendulumSound: boolean;
  setPendulumSound: (value: boolean) => void;
  sensitivity: number[];
  setSensitivity: (value: number[]) => void;
  isPendulumSwinging: boolean;
  processingCamera: boolean;
  toggleCamera: () => void;
  isCameraActive: boolean;
}

const DiagnoseControls: React.FC<DiagnoseControlsProps> = ({
  useCameraMode,
  setUseCameraMode,
  pendulumSound,
  setPendulumSound,
  sensitivity,
  setSensitivity,
  isPendulumSwinging,
  processingCamera,
  toggleCamera,
  isCameraActive
}) => {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium">Modo de Diagnóstico</h4>
        <div className="flex items-center">
          <Switch
            checked={pendulumSound}
            onCheckedChange={setPendulumSound}
            disabled={isPendulumSwinging || processingCamera}
            id="sound-toggle"
            className="mr-2"
          />
          <Label htmlFor="sound-toggle" className="cursor-pointer">
            {pendulumSound ? <Volume size={18} /> : <Volume2 size={18} />}
          </Label>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 mb-4">
        <Switch
          checked={useCameraMode}
          onCheckedChange={setUseCameraMode}
          disabled={isPendulumSwinging || processingCamera}
          id="camera-mode"
        />
        <Label htmlFor="camera-mode" className="cursor-pointer flex items-center gap-2">
          <Camera size={18} className="text-quantum-primary" />
          Usar sensor de movimiento
        </Label>
      </div>
      
      <h4 className="font-medium mb-2">Sensibilidad del Péndulo</h4>
      <Slider
        defaultValue={[50]}
        max={100}
        step={1}
        value={sensitivity}
        onValueChange={setSensitivity}
        disabled={isPendulumSwinging || processingCamera}
      />
      <div className="flex justify-between text-sm text-muted-foreground mt-1">
        <span>Baja</span>
        <span>Media</span>
        <span>Alta</span>
      </div>

      {useCameraMode && (
        <div className="mt-4">
          <QuantumButton onClick={toggleCamera} variant="outline">
            {isCameraActive ? "Detener Cámara" : "Probar Cámara"}
          </QuantumButton>
        </div>
      )}
    </div>
  );
};

export default DiagnoseControls;
