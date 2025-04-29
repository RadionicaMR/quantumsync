
import { useEffect, useState } from 'react';
import { toast } from "@/components/ui/use-toast";
import { useDeviceMotion } from '@/hooks/useDeviceMotion';
import { usePendulumAudio } from '@/hooks/usePendulumAudio';
import { UseDiagnosisProps } from './types';
import { useDiagnosisState } from './useDiagnosisState';
import { usePendulumAnimation } from './usePendulumAnimation';
import { useDiagnosisResults } from './useDiagnosisResults';
import { usePendulumDiagnosis } from './usePendulumDiagnosis';
import { useMotionDiagnosis } from './useMotionDiagnosis';

export const useDiagnosis = ({
  useCameraMode,
  pendulumSound,
  setCameraResult,
  personName,
  getRecentResult,
  addResultToCache
}: UseDiagnosisProps) => {
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const { stopPendulumSound } = usePendulumAudio();
  const diagnosisState = useDiagnosisState();
  const { stopPendulumSwing } = usePendulumAnimation();

  // Create pendulum diagnosis instance
  const { startPendulum } = usePendulumDiagnosis({
    pendulumSound,
    updateDiagnosisState: diagnosisState.updateState,
    personName,
    addResultToCache
  });

  // Create motion diagnosis instance
  const { handleMotionDiagnosis, handleDiagnosisError } = useMotionDiagnosis({
    useCameraMode,
    pendulumSound,
    setCameraResult,
    personName,
    updateDiagnosisState: diagnosisState.updateState,
    addResultToCache
  });

  // Check if it's a mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      if (/android|iPad|iPhone|iPod/i.test(userAgent)) {
        setIsMobileDevice(true);
      }
    };
    checkMobile();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPendulumSound();
      if (diagnosisState.swingIntervalId !== null) {
        stopPendulumSwing(diagnosisState.swingIntervalId);
      }
    };
  }, [diagnosisState.swingIntervalId, stopPendulumSound, stopPendulumSwing]);

  // Main function to handle diagnosis process
  const startMotionDiagnosis = async (area: string) => {
    // Check if there's a recent result for this area
    const recentResult = getRecentResult(area);
    
    if (recentResult) {
      handleRecentResult(recentResult, area);
      return;
    }

    // Choose between camera mode or standard pendulum
    if (!useCameraMode) {
      startPendulum(area);
      return;
    }

    // Handle motion-based diagnosis
    try {
      await handleMotionDiagnosis(area);
    } catch (error) {
      handleDiagnosisError(area);
    }
  };

  // Helper function to handle recent results
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

  return {
    ...diagnosisState,
    isMobileDevice,
    startMotionDiagnosis
  };
};
