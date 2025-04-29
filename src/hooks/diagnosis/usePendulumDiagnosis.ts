
import { useCallback } from 'react';
import { toast } from "@/components/ui/use-toast";
import { usePendulumAudio } from '@/hooks/usePendulumAudio';
import { usePendulumAnimation } from './usePendulumAnimation';
import { useDiagnosisResults } from './useDiagnosisResults';

interface UsePendulumDiagnosisProps {
  pendulumSound: boolean;
  updateDiagnosisState: (updates: any) => void;
  personName: string;
  addResultToCache: (result: any) => void;
}

export const usePendulumDiagnosis = ({
  pendulumSound,
  updateDiagnosisState,
  personName,
  addResultToCache
}: UsePendulumDiagnosisProps) => {
  const { startPendulumSound, stopPendulumSound } = usePendulumAudio();
  const { startPendulumSwing, stopPendulumSwing } = usePendulumAnimation();
  const { generateResult } = useDiagnosisResults();

  const startPendulum = useCallback(async (area: string) => {
    console.log(`Iniciando diagnóstico para: ${area}`);

    updateDiagnosisState({
      isPendulumSwinging: true,
      diagnosisResult: null
    });

    if (pendulumSound) {
      startPendulumSound();
    }

    const { interval, angle } = startPendulumSwing();
    updateDiagnosisState({ 
      swingIntervalId: interval,
      pendulumAngle: angle
    });

    const duration = Math.random() * 3000 + 3000;
    setTimeout(() => {
      stopPendulumSwing(interval);
      updateDiagnosisState({
        swingIntervalId: null,
        isPendulumSwinging: false,
        pendulumAngle: 0
      });

      const result = generateResult(area, personName);
      updateDiagnosisState({
        diagnosisResult: result.result,
        diagnosisPercentage: result.percentage
      });

      addResultToCache(result);
      stopPendulumSound();
    }, duration);
  }, [
    updateDiagnosisState, 
    pendulumSound, 
    startPendulumSound, 
    startPendulumSwing, 
    stopPendulumSwing, 
    generateResult, 
    personName,
    addResultToCache, 
    stopPendulumSound
  ]);

  return { startPendulum };
};
