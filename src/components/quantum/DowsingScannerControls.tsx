
import { Play, Square, Wand2 } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

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
          <button 
            onClick={startScan}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-quantum-primary text-white hover:bg-quantum-primary/80 font-medium transition-colors duration-300"
            style={{ WebkitAppearance: 'none', touchAction: 'manipulation' }}
          >
            <Play size={16} />
            <span>Iniciar Escaneo</span>
          </button>
        )}
        
        {scanning && (
          <button 
            onClick={stopScan}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 font-medium transition-colors duration-300"
            style={{ WebkitAppearance: 'none', touchAction: 'manipulation' }}
          >
            <Square size={16} />
            <span>Detener Escaneo</span>
          </button>
        )}
        
        {scanComplete && (
          <button 
            onClick={navigateToBalance}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-quantum-primary to-purple-500 text-white hover:from-quantum-primary/90 hover:to-purple-500/90 font-medium transition-colors duration-300"
            style={{ WebkitAppearance: 'none', touchAction: 'manipulation' }}
          >
            <Wand2 size={16} />
            <span>Equilibrar Chakras</span>
          </button>
        )}
      </div>
    </>
  );
};

export default DowsingScannerControls;
