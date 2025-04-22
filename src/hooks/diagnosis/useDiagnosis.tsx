
import { useEffect, useState } from 'react';
import { toast } from "@/components/ui/use-toast";
import { useDeviceMotion } from '@/hooks/useDeviceMotion';
import { usePendulumAudio } from '@/hooks/usePendulumAudio';
import { UseDiagnosisProps } from './types';
import { useDiagnosisState } from './useDiagnosisState';
import { usePendulumAnimation } from './usePendulumAnimation';
import { useDiagnosisResults } from './useDiagnosisResults';

export const useDiagnosis = ({
  useCameraMode,
  pendulumSound,
  setCameraResult,
  personName,
  getRecentResult,
  addResultToCache
}: UseDiagnosisProps) => {
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const { detectMotion, requestPermission, calibrateDevice } = useDeviceMotion();
  const { startPendulumSound, stopPendulumSound } = usePendulumAudio();
  const diagnosisState = useDiagnosisState();
  const { startPendulumSwing, stopPendulumSwing } = usePendulumAnimation();
  const { generateResult } = useDiagnosisResults();

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      if (/android|iPad|iPhone|iPod/i.test(userAgent)) {
        setIsMobileDevice(true);
      }
    };
    checkMobile();
  }, []);

  useEffect(() => {
    return () => {
      stopPendulumSound();
      if (diagnosisState.swingIntervalId !== null) {
        stopPendulumSwing(diagnosisState.swingIntervalId);
      }
    };
  }, [diagnosisState.swingIntervalId, stopPendulumSound]);

  const startPendulum = async (area: string) => {
    console.log(`Iniciando diagnóstico para: ${area}`);
    const recentResult = getRecentResult(area);
    
    if (recentResult) {
      console.log(`Usando resultado reciente para ${area}: ${recentResult.result} (${recentResult.percentage}%)`);
      diagnosisState.updateState({
        diagnosisResult: recentResult.result,
        diagnosisPercentage: recentResult.percentage
      });
      return;
    }

    diagnosisState.updateState({
      isPendulumSwinging: true,
      diagnosisResult: null
    });
    setCameraResult(null);

    if (pendulumSound) {
      startPendulumSound();
    }

    const { interval, angle } = startPendulumSwing();
    diagnosisState.updateState({ 
      swingIntervalId: interval,
      pendulumAngle: angle
    });

    const duration = Math.random() * 3000 + 3000;
    setTimeout(() => {
      stopPendulumSwing(interval);
      diagnosisState.updateState({
        swingIntervalId: null,
        isPendulumSwinging: false,
        pendulumAngle: 0
      });

      const result = generateResult(area, personName);
      diagnosisState.updateState({
        diagnosisResult: result.result,
        diagnosisPercentage: result.percentage
      });

      addResultToCache(result);
      stopPendulumSound();
    }, duration);
  };

  const startMotionDiagnosis = async (area: string) => {
    if (!useCameraMode) {
      startPendulum(area);
      return;
    }

    const recentResult = getRecentResult(area);
    if (recentResult) {
      handleRecentResult(recentResult, area);
      return;
    }

    try {
      await handleMotionDiagnosis(area);
    } catch (error) {
      handleDiagnosisError(area);
    }
  };

  const handleRecentResult = (recentResult: any, area: string) => {
    console.log(`Usando resultado reciente para ${area}: ${recentResult.result} (${recentResult.percentage}%)`);
    diagnosisState.updateState({
      diagnosisResult: recentResult.result,
      diagnosisPercentage: recentResult.percentage
    });
    
    if (area === "Chakras") {
      setCameraResult(recentResult.result === "EN ARMONÍA" ? "SI" : "NO");
    } else {
      setCameraResult(recentResult.result === "Alto" ? "SI" : "NO");
    }
  };

  const handleMotionDiagnosis = async (area: string) => {
    setCameraResult(null);
    diagnosisState.updateState({
      processingCamera: true,
      isPendulumSwinging: true
    });

    const { interval, angle } = startPendulumSwing();
    diagnosisState.updateState({ swingIntervalId: interval, pendulumAngle: angle });

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
  };

  const handleMotionResult = (hasSignificantMotion: boolean, result: any, area: string) => {
    if (area === "Chakras") {
      setCameraResult(hasSignificantMotion ? "SI" : "NO");
    } else {
      setCameraResult(hasSignificantMotion ? "SI" : "NO");
    }

    diagnosisState.updateState({
      diagnosisResult: result.result,
      diagnosisPercentage: result.percentage,
      processingCamera: false,
      isPendulumSwinging: false
    });

    addResultToCache(result);
    stopPendulumSound();
  };

  const handleDiagnosisError = (area: string) => {
    console.error("Error durante el diagnóstico con movimiento");
    toast({
      title: "Error",
      description: "Ocurrió un error durante el análisis de movimiento.",
      variant: "destructive"
    });

    setCameraResult("NO");
    const result = generateResult(area, personName);
    
    diagnosisState.updateState({
      diagnosisResult: result.result,
      diagnosisPercentage: result.percentage,
      processingCamera: false,
      isPendulumSwinging: false
    });

    addResultToCache(result);
  };

  return {
    ...diagnosisState,
    isMobileDevice,
    startMotionDiagnosis
  };
};
