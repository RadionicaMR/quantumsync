
import { Play, Square, Wand2 } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import QuantumButton from '@/components/QuantumButton';

interface DowsingScannerControlsProps {
  scanning: boolean;
  scanComplete: boolean;
  progress: number;
  startScan: () => void;
  stopScan: () => void;
  navigateToBalance: () => void;
}

const DowsingScannerControls: React.FC<DowsingScannerControlsProps> = ({
  scanning,
  scanComplete,
  progress,
  startScan,
  stopScan,
  navigateToBalance
}) => {
  return (
    <>
      <div className="mb-6">
        {scanning && (
          <div className="w-full max-w-xs mx-auto">
            <Progress value={progress} className="h-2 mb-2" />
            <p className="text-sm text-muted-foreground">Progreso del escáner: {Math.round(progress)}%</p>
          </div>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {!scanning && !scanComplete && (
          <QuantumButton 
            onClick={startScan}
            className="bg-quantum-primary text-white hover:bg-quantum-primary/80"
          >
            <Play size={16} />
            Iniciar Escaneo
          </QuantumButton>
        )}
        
        {scanning && (
          <QuantumButton 
            onClick={stopScan}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            <Square size={16} />
            Detener Escaneo
          </QuantumButton>
        )}
        
        {scanComplete && (
          <QuantumButton 
            onClick={navigateToBalance} 
            className="bg-gradient-to-r from-quantum-primary to-purple-500 text-white hover:from-quantum-primary/90 hover:to-purple-500/90"
          >
            <Wand2 size={16} />
            Equilibrar Chakras
          </QuantumButton>
        )}
      </div>
    </>
  );
};

export default DowsingScannerControls;
