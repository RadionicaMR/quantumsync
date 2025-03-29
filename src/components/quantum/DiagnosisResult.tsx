
import { motion } from 'framer-motion';
import QuantumButton from '@/components/QuantumButton';

interface DiagnosisResultProps {
  diagnosisResult: string | null;
  diagnosisPercentage: number;
  selectedArea: string;
  cameraResult: 'SI' | 'NO' | null;
  onDiagnoseAgain: () => void;
}

const DiagnosisResult: React.FC<DiagnosisResultProps> = ({ 
  diagnosisResult, 
  diagnosisPercentage, 
  selectedArea,
  cameraResult,
  onDiagnoseAgain
}) => {
  if (!diagnosisResult) return null;
  
  return (
    <motion.div 
      className="text-center mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-2xl font-semibold mb-2">
        Resultado del Diagnóstico: {diagnosisResult}
      </div>
      <div className="w-full max-w-md h-4 bg-muted rounded-full mb-2 overflow-hidden">
        <motion.div 
          className="h-full bg-quantum-gradient"
          initial={{ width: 0 }}
          animate={{ width: `${diagnosisPercentage}%` }}
          transition={{ duration: 1 }}
        />
      </div>
      <div className="text-muted-foreground">
        Tu {selectedArea} está al {diagnosisPercentage}% del nivel óptimo
      </div>
      
      {cameraResult && (
        <div className="mt-4 text-xl font-bold">
          <span className={`px-4 py-2 rounded-full ${cameraResult === 'SI' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
            {cameraResult}
          </span>
        </div>
      )}
      
      <div className="mt-6">
        <QuantumButton onClick={onDiagnoseAgain}>
          Diagnosticar de Nuevo
        </QuantumButton>
      </div>
    </motion.div>
  );
};

export default DiagnosisResult;
