
import { useCallback } from 'react';
import { CHAKRA_FREQUENCIES } from '@/constants/chakraData';
import type { ChakraName } from '@/constants/chakraData';
import { useChakraNotifications } from '@/hooks/balance/useChakraNotifications';

export const useChakraControls = () => {
  const { 
    notifyStart, 
    notifyStop, 
    notifyCompletion, 
    notifyMissingName,
    notifyNoChakras 
  } = useChakraNotifications();

  const getCurrentFrequency = (currentChakra: ChakraName | '') => {
    return currentChakra ? CHAKRA_FREQUENCIES[currentChakra] : 0;
  };

  return {
    notifyStart,
    notifyStop,
    notifyCompletion,
    notifyMissingName,
    notifyNoChakras,
    getCurrentFrequency
  };
};
