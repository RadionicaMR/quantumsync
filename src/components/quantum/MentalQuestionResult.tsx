
import { motion } from 'framer-motion';
import QuantumButton from '@/components/QuantumButton';

interface MentalQuestionResultProps {
  cameraResult: 'SI' | 'NO' | null;
  askingMental: boolean;
  onAskAgain: () => void;
  onStartQuestion: () => void;
}

const MentalQuestionResult: React.FC<MentalQuestionResultProps> = ({ 
  cameraResult, 
  askingMental, 
  onAskAgain, 
  onStartQuestion
}) => {
  if (askingMental) {
    return (
      <div className="text-center mt-8 animate-pulse">
        <p className="text-lg">Formulando tu pregunta...</p>
        <p className="text-sm text-muted-foreground mt-2">
          Mantén el dispositivo estable mientras piensas en tu pregunta
        </p>
      </div>
    );
  }
  
  if (cameraResult) {
    return (
      <motion.div 
        className="text-center mt-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-4xl font-bold mb-6">
          <span className={`px-8 py-4 rounded-full ${
            cameraResult === 'SI' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {cameraResult}
          </span>
        </div>
        
        <div className="mt-8">
          <QuantumButton onClick={onAskAgain} className="px-8">
            Volver a preguntar
          </QuantumButton>
        </div>
      </motion.div>
    );
  }
  
  return (
    <div className="text-center">
      <p className="text-lg mb-6">Piensa en una pregunta que pueda responderse con SÍ o NO</p>
      <QuantumButton onClick={onStartQuestion} disabled={askingMental}>
        Iniciar Pregunta Mental
      </QuantumButton>
    </div>
  );
};

export default MentalQuestionResult;
