
import { useCallback } from 'react';
import { toast } from "@/components/ui/use-toast";
import { usePendulumAudio } from '@/hooks/usePendulumAudio';
import { useDeviceMotion } from '@/hooks/useDeviceMotion';
import { usePendulumAnimation } from './usePendulumAnimation';
import { useDiagnosisResults } from './useDiagnosisResults';

interface UseMotionDiagnosisProps {
  useCameraMode: boolean;
  pendulumSound: boolean;
  setCameraResult: (result: 'SI' | 'NO' | null) => void;
  personName: string;
  updateDiagnosisState: (updates: any) => void;
  addResultToCache: (result: any) => void;
}

export const useMotionDiagnosis = ({
  useCameraMode,
  pendulumSound,
  setCameraResult,
  personName,
  updateDiagnosisState,
  addResultToCache
}: UseMotionDiagnosisProps) => {
  const { detectMotion, requestPermission, calibrateDevice } = useDeviceMotion();
  const { startPendulumSound, stopPendulumSound } = usePendulumAudio();
  const { startPendulumSwing, stopPendulumSwing } = usePendulumAnimation();
  const { generateResult } = useDiagnosisResults();

  const handleMotionDiagnosis = useCallback(async (area: string) => {
    setCameraResult(null);
    updateDiagnosisState({
      processingCamera: true,
      isPendulumSwinging: true
    });

    const { interval, angle } = startPendulumSwing();
    updateDiagnosisState({ swingIntervalId: interval, pendulumAngle: angle });

    const hasPermission = await requestPermission();
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    calibrateDevice();
    if (pendulumSound) startPendulumSound();

    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Análisis en curso",
      description: "Mantenga el dispositivo mientras se realiza el análisis...",
    });

    const hasSignificantMotion = await detectMotion(5000, 6.5);
    const result = generateResult(area, personName);
    
    handleMotionResult(hasSignificantMotion, result, area);
    return result;
  }, [
    setCameraResult, updateDiagnosisState, startPendulumSwing, 
    requestPermission, calibrateDevice, pendulumSound, 
    startPendulumSound, detectMotion, generateResult, personName
  ]);

  const handleMotionResult = useCallback((hasSignificantMotion: boolean, result: any, area: string) => {
    if (area === "Chakras") {
      setCameraResult(hasSignificantMotion ? "SI" : "NO");
    } else {
      setCameraResult(hasSignificantMotion ? "SI" : "NO");
    }

    updateDiagnosisState({
      diagnosisResult: result.result,
      diagnosisPercentage: result.percentage,
      processingCamera: false,
      isPendulumSwinging: false
    });

    addResultToCache(result);
    stopPendulumSound();
  }, [setCameraResult, updateDiagnosisState, addResultToCache, stopPendulumSound]);

  const handleDiagnosisError = useCallback((area: string) => {
    console.error("Error durante el diagnóstico con movimiento");
    toast({
      title: "Error",
      description: "Ocurrió un error durante el análisis de movimiento.",
      variant: "destructive"
    });

    setCameraResult("NO");
    const result = generateResult(area, personName);
    
    updateDiagnosisState({
      diagnosisResult: result.result,
      diagnosisPercentage: result.percentage,
      processingCamera: false,
      isPendulumSwinging: false
    });

    addResultToCache(result);
  }, [setCameraResult, generateResult, personName, updateDiagnosisState, addResultToCache]);

  return {
    handleMotionDiagnosis,
    handleDiagnosisError
  };
};
