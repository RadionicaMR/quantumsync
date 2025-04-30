
import { motion } from 'framer-motion';
import QuantumButton from '@/components/QuantumButton';

interface DiagnosisResultProps {
  diagnosisResult: string | null;
  diagnosisPercentage: number;
  selectedArea: string;
  cameraResult: 'SI' | 'NO' | null;
  onDiagnoseAgain: () => void;
  personName?: string;
  onStartTreatment: () => void;
}

const DiagnosisResult: React.FC<DiagnosisResultProps> = ({ 
  diagnosisResult, 
  diagnosisPercentage, 
  selectedArea,
  cameraResult,
  onDiagnoseAgain,
  personName,
  onStartTreatment
}) => {
  if (!diagnosisResult) return null;
  
  // Define colors based on result
  const getResultColor = () => {
    if (selectedArea === "Chakras") {
      switch (diagnosisResult) {
        case "EN ARMONÍA": return "bg-green-500";
        case "CERRADOS": return "bg-yellow-500";
        case "DESEQUILIBRADOS": return "bg-orange-500";
        case "BLOQUEOS": return "bg-red-500";
        default: return "bg-blue-500";
      }
    } else {
      if (diagnosisPercentage < 30) return "bg-red-500";
      if (diagnosisPercentage < 70) return "bg-yellow-500";
      return "bg-green-500";
    }
  };
  
  return (
    <motion.div 
      className="text-center mt-8 w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="text-2xl font-semibold mb-2"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        Resultado del Diagnóstico: {diagnosisResult}
      </motion.div>
      
      <div className="w-full h-4 bg-muted rounded-full mb-2 overflow-hidden">
        <motion.div 
          className={`h-full ${getResultColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${diagnosisPercentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      
      <motion.div 
        className="text-muted-foreground mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        {selectedArea === "Chakras" ? (
          <span>
            {personName ? `Los chakras de ${personName} están:` : "Tus chakras están:"} {diagnosisResult}
          </span>
        ) : personName ? (
          <span>{personName} tiene {selectedArea} al {diagnosisPercentage}% del nivel óptimo</span>
        ) : (
          <span>Tu {selectedArea} está al {diagnosisPercentage}% del nivel óptimo</span>
        )}
      </motion.div>
      
      {/* SI/NO result display removed as requested */}
      
      <motion.div 
        className="mt-6 flex flex-col md:flex-row gap-3 justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
      >
        <QuantumButton onClick={onDiagnoseAgain} variant="outline">
          Diagnosticar de Nuevo
        </QuantumButton>
        
        <QuantumButton onClick={onStartTreatment} className="mt-2 md:mt-0">
          Iniciar Tratamiento
        </QuantumButton>
      </motion.div>
    </motion.div>
  );
};

export default DiagnosisResult;
