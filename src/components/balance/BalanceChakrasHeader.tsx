
import { motion } from 'framer-motion';

interface BalanceChakrasHeaderProps {
  personName: string;
}

const BalanceChakrasHeader = ({ personName }: BalanceChakrasHeaderProps) => {
  return (
    <div className="text-center mb-6">
      <h2 className="text-2xl font-bold holographic-gradient mb-2">Equilibrar Chakras</h2>
      <p className="text-muted-foreground">
        Armoniza y equilibra los 7 chakras principales con frecuencias específicas
        {personName && ` para ${personName}`}
      </p>
    </div>
  );
};

export default BalanceChakrasHeader;
