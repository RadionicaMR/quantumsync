
import { useState, useCallback } from 'react';
import { CHAKRA_ORDER } from '@/constants/chakraData';
import type { ChakraName } from '@/constants/chakraData';
import type { BalanceOption } from '@/components/balance/BalanceOptions';

export const useChakraSelection = (initialChakraStates: any[] = []) => {
  const [balanceOption, setBalanceOption] = useState<BalanceOption>('all');

  const getChakrasToBalance = useCallback(() => {
    console.log('Getting chakras to balance:', { balanceOption, initialChakraStates });
    
    if (balanceOption === 'all') {
      console.log('Balancing all chakras:', CHAKRA_ORDER);
      return [...CHAKRA_ORDER];
    } else if (balanceOption === 'blocked') {
      if (initialChakraStates && initialChakraStates.length > 0) {
        const blockedChakras = CHAKRA_ORDER.filter(chakraName => {
          const chakraData = initialChakraStates.find(c => c.name === chakraName);
          const state = (chakraData?.state || '').toString().trim().toLowerCase();
          const isBlocked = state === 'cerrado' || state === 'bloqueado' || state === 'cerrada' || state === 'bloqueada';
          console.log(`Chakra ${chakraName}: ${chakraData?.state} - isBlocked: ${isBlocked}`);
          return isBlocked;
        });
        console.log('Filtered blocked chakras:', blockedChakras);
        
        // Si no hay chakras bloqueados, devolver lista vacía (se notificará arriba)
        if (blockedChakras.length === 0) {
          console.log('No blocked chakras found, returning empty list');
          return [];
        }
        
        return blockedChakras;
      } else {
        console.log('No initial chakra states provided, returning empty list for blocked mode');
        return [];
      }
    }
    
    console.log('Default case: returning all chakras');
    return [...CHAKRA_ORDER];
  }, [balanceOption, initialChakraStates]);

  return {
    balanceOption,
    setBalanceOption,
    getChakrasToBalance
  };
};
