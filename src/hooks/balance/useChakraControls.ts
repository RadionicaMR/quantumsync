
import { useCallback } from 'react';
import { CHAKRA_FREQUENCIES } from '@/constants/chakraData';
import type { ChakraName } from '@/constants/chakraData';
import { useChakraNotifications } from '@/hooks/balance/useChakraNotifications';

export const useChakraControls = () => {
  const { 
    notifyStart, 
    notifyStop, 
    notifyCompletion, 
    notifyChakraChange,
    notifyMissingName,
    notifyNoChakras 
  } = useChakraNotifications();

  const getCurrentFrequency = useCallback((currentChakra: ChakraName | ''): number => {
    return currentChakra ? CHAKRA_FREQUENCIES[currentChakra] : 0;
  }, []);

  return {
    notifyStart,
    notifyStop,
    notifyCompletion,
    notifyChakraChange,
    notifyMissingName,
    notifyNoChakras,
    getCurrentFrequency
  };
};
