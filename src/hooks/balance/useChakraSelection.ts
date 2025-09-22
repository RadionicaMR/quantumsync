
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
          const isBlocked = chakraData && (chakraData.state === 'CERRADO' || chakraData.state === 'BLOQUEADO');
          console.log(`Chakra ${chakraName}: ${chakraData?.state} - isBlocked: ${isBlocked}`);
          return isBlocked;
        });
        console.log('Filtered blocked chakras:', blockedChakras);
        
        // Si no hay chakras bloqueados, devolver todos con notificación
        if (blockedChakras.length === 0) {
          console.log('No blocked chakras found, falling back to all chakras');
          // Aquí deberíamos disparar una notificación, pero no podemos hacerlo desde un hook de estado
          // La notificación la manejaremos en el hook que usa este
          return [...CHAKRA_ORDER];
        }
        
        return blockedChakras;
      } else {
        console.log('No initial chakra states provided, returning all chakras');
        return [...CHAKRA_ORDER];
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
