
import { CHAKRA_COLORS } from '@/constants/chakraData';
import type { ChakraName } from '@/constants/chakraData';
import { Progress } from '@/components/ui/progress';

interface ProgressDisplayProps {
  isPlaying: boolean;
  currentChakra: ChakraName | '';
  progress: number;
  frequency: number;
}

const ProgressDisplay = ({ isPlaying, currentChakra, progress, frequency }: ProgressDisplayProps) => {
  if (!isPlaying) return null;
  
  // Get the color for the current chakra or use a default color
  const chakraColor = currentChakra ? CHAKRA_COLORS[currentChakra] : '#4b5563';
  
  // Ensure progress is a valid number between 0 and 100
  const safeProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className="w-full max-w-xs mx-auto mb-8 text-center">
      <p className="text-sm mb-1">
        Armonizando chakra {currentChakra} ({frequency} Hz)
      </p>
      <div className="h-2 w-full relative bg-secondary rounded-full overflow-hidden">
        <Progress 
          value={safeProgress} 
          className="h-full"
          style={{
            "--progress-foreground": chakraColor,
            "--progress-background": "transparent"
          } as React.CSSProperties}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Progreso: {Math.round(safeProgress)}%
      </p>
    </div>
  );
};

export default ProgressDisplay;
