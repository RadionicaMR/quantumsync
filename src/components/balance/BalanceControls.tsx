
import { Check, Play, Square } from 'lucide-react';
import { motion } from 'framer-motion';
import QuantumButton from '@/components/QuantumButton';

interface BalanceControlsProps {
  isPlaying: boolean;
  completed: boolean;
  personName: string;
  onStart: () => void;
  onStop: () => void;
  onNavigate: () => void;
}

const BalanceControls = ({ 
  isPlaying, 
  completed, 
  personName, 
  onStart, 
  onStop, 
  onNavigate 
}: BalanceControlsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      {!isPlaying && !completed ? (
        <QuantumButton 
          onClick={onStart} 
          disabled={!personName.trim()}
          className="bg-quantum-primary text-white hover:bg-quantum-primary/80"
        >
          <Play size={16} />
          Iniciar Armonización
        </QuantumButton>
      ) : isPlaying ? (
        <QuantumButton 
          onClick={onStop}
          className="bg-red-500 text-white hover:bg-red-600"
        >
          <Square size={16} />
          Finalizar
        </QuantumButton>
      ) : (
        <QuantumButton 
          onClick={onStart}
          className="bg-quantum-primary text-white hover:bg-quantum-primary/80"
        >
          <Play size={16} />
          Iniciar Nuevamente
        </QuantumButton>
      )}
      
      {(completed || isPlaying) && (
        <QuantumButton 
          onClick={onNavigate}
          variant="outline"
          className="border-quantum-primary/30 hover:bg-quantum-primary/10"
        >
          Volver a Diagnóstico
        </QuantumButton>
      )}
    </div>
  );
};

export default BalanceControls;
