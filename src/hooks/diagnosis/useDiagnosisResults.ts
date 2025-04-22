
import { useCallback } from 'react';
import { RecentDiagnosisResult } from './types';

export const useDiagnosisResults = () => {
  const generateResult = useCallback((area: string, personName?: string) => {
    const percentage = Math.floor(Math.random() * 101);
    let result;
    
    if (area === "Chakras") {
      if (percentage < 25) {
        result = "BLOQUEOS";
      } else if (percentage < 50) {
        result = "DESEQUILIBRADOS";
      } else if (percentage < 75) {
        result = "CERRADOS";
      } else {
        result = "EN ARMONÍA";
      }
    } else {
      if (percentage < 30) {
        result = "Bajo";
      } else if (percentage < 70) {
        result = "Medio";
      } else {
        result = "Alto";
      }
    }

    return {
      area,
      result,
      percentage,
      timestamp: Date.now(),
      personName
    } as RecentDiagnosisResult;
  }, []);

  return { generateResult };
};
