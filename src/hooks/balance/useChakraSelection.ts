
import { useState, useCallback } from 'react';
import { CHAKRA_ORDER } from '@/constants/chakraData';
import type { ChakraName } from '@/constants/chakraData';
import type { BalanceOption } from '@/components/balance/BalanceOptions';

export const useChakraSelection = (initialChakraStates: any[] = []) => {
  const [balanceOption, setBalanceOption] = useState<BalanceOption>('all');

  const getChakrasToBalance = useCallback(() => {
    if (balanceOption === 'all') {
      return [...CHAKRA_ORDER];
    } else if (balanceOption === 'blocked') {
      if (initialChakraStates && initialChakraStates.length > 0) {
        const blockedChakras = CHAKRA_ORDER.filter(chakraName => {
          const chakraData = initialChakraStates.find(c => c.name === chakraName);
          const state = (chakraData?.state || '').toString().trim().toLowerCase();
          return state === 'cerrado' || state === 'bloqueado' || state === 'cerrada' || state === 'bloqueada';
        });
        
        if (blockedChakras.length === 0) {
          return [];
        }
        
        return blockedChakras;
      } else {
        return [];
      }
    }
    
    return [...CHAKRA_ORDER];
  }, [balanceOption, initialChakraStates]);

  return {
    balanceOption,
    setBalanceOption,
    getChakrasToBalance
  };
};
