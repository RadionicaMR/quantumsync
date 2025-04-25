
import { Progress } from "@/components/ui/progress";
import { CHAKRA_COLORS } from '@/constants/chakraData';
import type { ChakraName } from '@/constants/chakraData';

interface ProgressDisplayProps {
  isPlaying: boolean;
  currentChakra: ChakraName | '';
  progress: number;
  frequency: number;
}

const ProgressDisplay = ({ isPlaying, currentChakra, progress, frequency }: ProgressDisplayProps) => {
  if (!isPlaying) return null;

  return (
    <div className="w-full max-w-xs mx-auto mb-8 text-center">
      <p className="text-sm mb-1">
        Armonizando chakra {currentChakra} ({frequency} Hz)
      </p>
      <Progress 
        value={progress} 
        className="h-2 w-full bg-gray-200 rounded-full overflow-hidden"
        style={{
          "--progress-foreground": CHAKRA_COLORS[currentChakra as ChakraName]
        } as React.CSSProperties}
      />
      <p className="text-xs text-muted-foreground mt-1">
        Progreso: {Math.round(progress)}%
      </p>
    </div>
  );
};

export default ProgressDisplay;
