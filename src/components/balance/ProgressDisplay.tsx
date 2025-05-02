
import { CHAKRA_COLORS } from '@/constants/chakraData';
import type { ChakraName } from '@/constants/chakraData';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState, useRef } from 'react';

interface ProgressDisplayProps {
  isPlaying: boolean;
  currentChakra: ChakraName | '';
  progress: number;
  frequency: number;
}

const ProgressDisplay = ({ isPlaying, currentChakra, progress, frequency }: ProgressDisplayProps) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  const prevChakraRef = useRef<string>('');
  const prevProgressRef = useRef<number>(0);
  
  // Enhanced chakra change detection and progress management
  useEffect(() => {
    // Force progress reset when chakra changes
    if (currentChakra !== prevChakraRef.current) {
      console.log(`ProgressDisplay: Chakra changed from ${prevChakraRef.current} to ${currentChakra}, forcing progress reset`);
      setDisplayProgress(0);
      prevChakraRef.current = currentChakra;
      prevProgressRef.current = 0;
    } 
    // Handle progress updates
    else if (progress !== prevProgressRef.current) {
      console.log(`ProgressDisplay: Progress updated from ${prevProgressRef.current} to ${progress}`);
      setDisplayProgress(progress);
      prevProgressRef.current = progress;
      
      // Special case for progress reset
      if (progress === 0 && prevProgressRef.current !== 0) {
        console.log(`ProgressDisplay: Progress reset to 0 detected`);
      }
    }
  }, [progress, currentChakra]);
  
  if (!isPlaying || !currentChakra) return null;
  
  // Get the color for the current chakra or use a default color
  const chakraColor = currentChakra ? CHAKRA_COLORS[currentChakra] : '#4b5563';
  
  // Ensure progress is a valid number between 0 and 100
  const safeProgress = Math.max(0, Math.min(100, displayProgress || 0));

  return (
    <div className="w-full max-w-xs mx-auto mb-8 text-center">
      <p className="text-sm mb-2">
        Armonizando chakra {currentChakra} ({frequency} Hz)
      </p>
      <div className="relative w-full">
        <Progress 
          value={safeProgress} 
          className="h-4 w-full"
          style={{
            "--progress-foreground": chakraColor,
            "--progress-background": "#f3f4f6"
          } as React.CSSProperties}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Progreso: {Math.round(safeProgress)}%
      </p>
    </div>
  );
};

export default ProgressDisplay;
