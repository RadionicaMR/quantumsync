
import { useState } from 'react';
import type { ChakraName } from '@/constants/chakraData';

export const useChakraProgress = () => {
  // Initialize with empty string for chakra and 0 for progress
  const [currentChakra, setCurrentChakra] = useState<ChakraName | ''>('');
  const [progress, setProgress] = useState<number>(0);

  return {
    currentChakra,
    setCurrentChakra,
    progress,
    setProgress
  };
};
