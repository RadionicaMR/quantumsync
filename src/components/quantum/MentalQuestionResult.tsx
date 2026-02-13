
import { motion } from 'framer-motion';


interface MentalQuestionResultProps {
  cameraResult: 'SI' | 'NO' | null;
  askingMental: boolean;
  onAskAgain: () => void;
  onStartQuestion: () => void;
  countdownSeconds?: number;
}

const MentalQuestionResult: React.FC<MentalQuestionResultProps> = ({ 
  cameraResult, 
  askingMental, 
  onAskAgain, 
  onStartQuestion,
  countdownSeconds = 0
}) => {
  if (askingMental) {
    return (
      <div className="text-center mt-8 animate-pulse">
        <p className="text-lg">Formulando tu pregunta...</p>
        {countdownSeconds > 0 && (
          <p className="text-2xl font-bold mt-4 mb-2">
            {countdownSeconds}
          </p>
        )}
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
          <button 
            onClick={onAskAgain} 
            className="px-8 py-3 rounded-xl bg-quantum-primary text-white hover:bg-quantum-primary/90 font-medium transition-colors"
            style={{ WebkitAppearance: 'none', touchAction: 'manipulation' }}
          >
            Volver a preguntar
          </button>
        </div>
      </motion.div>
    );
  }
  
  return (
    <div className="text-center">
      <p className="text-lg mb-6">Piensa en una pregunta que pueda responderse con SÍ o NO</p>
      <button 
        onClick={onStartQuestion} 
        disabled={askingMental}
        className="px-6 py-3 rounded-xl bg-quantum-primary text-white hover:bg-quantum-primary/90 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ WebkitAppearance: 'none', touchAction: 'manipulation' }}
      >
        Iniciar Pregunta Mental
      </button>
    </div>
  );
};

export default MentalQuestionResult;
