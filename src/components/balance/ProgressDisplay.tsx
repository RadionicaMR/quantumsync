
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
  
  // Get the color for the current chakra or use a default color
  const chakraColor = currentChakra ? CHAKRA_COLORS[currentChakra] : '#4b5563';

  return (
    <div className="w-full max-w-xs mx-auto mb-8 text-center">
      <p className="text-sm mb-1">
        Armonizando chakra {currentChakra} ({frequency} Hz)
      </p>
      <Progress 
        value={progress} 
        className="h-2 w-full rounded-full overflow-hidden"
        style={{ 
          // Apply the chakra color to the progress indicator
          "--progress-background": "rgba(229, 231, 235, 0.5)",
          "--progress-foreground": chakraColor
        } as React.CSSProperties}
      />
      <p className="text-xs text-muted-foreground mt-1">
        Progreso: {Math.round(progress)}%
      </p>
    </div>
  );
};

export default ProgressDisplay;
