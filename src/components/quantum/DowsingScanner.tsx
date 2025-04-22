
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDowsingScanner } from '@/hooks/useDowsingScanner';
import DowsingScannerVisualization from './DowsingScannerVisualization';
import DowsingScannerControls from './DowsingScannerControls';

const DowsingScanner = () => {
  const {
    personName,
    setPersonName,
    scanning,
    progress,
    scanComplete,
    chakras,
    scanBarPosition,
    startScan,
    stopScan,
    navigateToBalance,
    progressBarRef
  } = useDowsingScanner();

  return (
    <Card className="quantum-card p-6">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl font-semibold mb-4">Escáner Completo de Campo Energético</h3>
        
        <div className="mb-6">
          <Label htmlFor="personName" className="block text-left mb-2">
            Nombre de la persona a diagnosticar
          </Label>
          <Input
            id="personName"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            placeholder="Ingresa el nombre"
            maxLength={100}
            className="bg-quantum-dark/30 border-quantum-primary/30"
            disabled={scanning}
          />
        </div>

        <DowsingScannerVisualization
          scanning={scanning}
          scanBarPosition={scanBarPosition}
          chakras={chakras}
          scanComplete={scanComplete}
          progressBarRef={progressBarRef}
        />

        <DowsingScannerControls
          scanning={scanning}
          scanComplete={scanComplete}
          progress={progress}
          startScan={startScan}
          stopScan={stopScan}
          navigateToBalance={navigateToBalance}
        />
      </motion.div>
    </Card>
  );
};

export default DowsingScanner;
