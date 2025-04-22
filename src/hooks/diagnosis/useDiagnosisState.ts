
import { useState } from 'react';
import { DiagnosisState } from './types';

export const useDiagnosisState = () => {
  const [state, setState] = useState<DiagnosisState>({
    isPendulumSwinging: false,
    pendulumAngle: 0,
    diagnosisResult: null,
    diagnosisPercentage: 0,
    processingCamera: false,
    swingIntervalId: null
  });

  const updateState = (updates: Partial<DiagnosisState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  return {
    ...state,
    updateState
  };
};
