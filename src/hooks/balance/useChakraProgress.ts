
import { useState } from 'react';
import type { ChakraName } from '@/constants/chakraData';

export const useChakraProgress = () => {
  const [currentChakra, setCurrentChakra] = useState<ChakraName | ''>('');
  const [progress, setProgress] = useState(0);

  return {
    currentChakra,
    setCurrentChakra,
    progress,
    setProgress
  };
};
