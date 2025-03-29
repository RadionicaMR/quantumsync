
import { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { useDeviceMotion } from '@/hooks/useDeviceMotion';
import { usePendulumAudio } from '@/hooks/usePendulumAudio';
import { RecentDiagnosisResult } from '@/hooks/useDiagnosisCache';

interface UseDiagnosisProps {
  useCameraMode: boolean;
  pendulumSound: boolean;
  setCameraResult: (result: 'SI' | 'NO' | null) => void;
  personName: string;
  getRecentResult: (area: string) => RecentDiagnosisResult | undefined;
  addResultToCache: (result: RecentDiagnosisResult) => void;
}

interface DiagnosisState {
  isPendulumSwinging: boolean;
  pendulumAngle: number;
  diagnosisResult: string | null;
  diagnosisPercentage: number;
  processingCamera: boolean;
  swingIntervalId: number | null;
}

export const useDiagnosis = ({
  useCameraMode,
  pendulumSound,
  setCameraResult,
  personName,
  getRecentResult,
  addResultToCache
}: UseDiagnosisProps) => {
  const [state, setState] = useState<DiagnosisState>({
    isPendulumSwinging: false,
    pendulumAngle: 0,
    diagnosisResult: null,
    diagnosisPercentage: 0,
    processingCamera: false,
    swingIntervalId: null
  });
  
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  
  const { detectMotion, requestPermission, calibrateDevice } = useDeviceMotion();
  const { startPendulumSound, stopPendulumSound } = usePendulumAudio();
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      if (/android|iPad|iPhone|iPod/i.test(userAgent)) {
        setIsMobileDevice(true);
      }
    };
    
    checkMobile();
  }, []);

  // Start normal pendulum diagnosis without motion detection
  const startPendulum = (area: string) => {
    console.log(`Iniciando diagnóstico para: ${area}`);
    
    // Check if there's a recent result for this area (less than 5 minutes)
    const recentResult = getRecentResult(area);
    
    if (recentResult) {
      console.log(`Usando resultado reciente para ${area}: ${recentResult.result} (${recentResult.percentage}%)`);
      setState(prev => ({
        ...prev,
        diagnosisResult: recentResult.result,
        diagnosisPercentage: recentResult.percentage
      }));
      return;
    }
    
    setState(prev => ({
      ...prev,
      isPendulumSwinging: true,
      diagnosisResult: null
    }));
    setCameraResult(null);
    
    // Play sound if enabled
    if (pendulumSound) {
      startPendulumSound();
    }
    
    // Simulate pendulum swing
    let angle = 0;
    const interval = window.setInterval(() => {
      angle = Math.sin(Date.now() / 500) * 30;
      setState(prev => ({...prev, pendulumAngle: angle}));
    }, 16);
    
    setState(prev => ({...prev, swingIntervalId: interval}));
    
    // Stop after random time between 3-6 seconds
    const duration = Math.random() * 3000 + 3000;
    setTimeout(() => {
      clearInterval(interval);
      setState(prev => ({
        ...prev,
        swingIntervalId: null,
        isPendulumSwinging: false,
        pendulumAngle: 0
      }));
      
      // Generate diagnosis result
      const percentage = Math.floor(Math.random() * 101);
      
      let result;
      
      // Special handling for Chakras area
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
      
      setState(prev => ({
        ...prev,
        diagnosisResult: result,
        diagnosisPercentage: percentage
      }));
      
      // Save result in recent results
      addResultToCache({
        area,
        result,
        percentage,
        timestamp: Date.now(),
        personName: personName || undefined
      });

      // Stop sound
      stopPendulumSound();
    }, duration);
  };

  // Start motion-based diagnosis
  const startMotionDiagnosis = async (area: string) => {
    if (!useCameraMode) {
      startPendulum(area);
      return;
    }

    // Check if there's a recent result for this area (less than 5 minutes)
    const recentResult = getRecentResult(area);
    
    if (recentResult) {
      console.log(`Usando resultado reciente para ${area}: ${recentResult.result} (${recentResult.percentage}%)`);
      setState(prev => ({
        ...prev,
        diagnosisResult: recentResult.result,
        diagnosisPercentage: recentResult.percentage
      }));
      
      // Handle chakras result specifically
      if (area === "Chakras") {
        setCameraResult(recentResult.result === "EN ARMONÍA" ? "SI" : "NO");
      } else {
        // Original behavior for other areas
        if (recentResult.result === "Alto") {
          setCameraResult("SI");
        } else if (recentResult.result === "Bajo") {
          setCameraResult("NO");
        } else {
          setCameraResult(null);
        }
      }
      return;
    }

    console.log("Iniciando diagnóstico con sensor de movimiento");
    setCameraResult(null);
    setState(prev => ({
      ...prev,
      processingCamera: true,
      isPendulumSwinging: true
    }));
    
    // Let's mimic pendulum swinging during motion detection
    let angle = 0;
    const interval = window.setInterval(() => {
      angle = Math.sin(Date.now() / 500) * 30;
      setState(prev => ({...prev, pendulumAngle: angle}));
    }, 16);
    
    setState(prev => ({...prev, swingIntervalId: interval}));
    
    try {
      // Request permission for device motion
      const hasPermission = await requestPermission();
      
      if (!hasPermission) {
        toast({
          title: "Permiso denegado",
          description: "Necesitamos acceso al sensor de movimiento para esta funcionalidad.",
          variant: "destructive"
        });
        clearInterval(interval);
        setState(prev => ({
          ...prev,
          swingIntervalId: null,
          processingCamera: false,
          isPendulumSwinging: false
        }));
        return;
      }
      
      // Calibrate the device FIRST to detect any subsequent change
      // CRUCIAL: Calibration must happen at the beginning of each diagnosis
      console.log("Calibrando dispositivo antes del diagnóstico");
      calibrateDevice();
      
      // Play sound if enabled
      if (pendulumSound) {
        startPendulumSound();
      }

      // Wait 1 second to prepare
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Análisis en curso",
        description: "Mantenga el dispositivo mientras se realiza el análisis...",
      });
      
      // Detect motion with a more balanced threshold
      const hasSignificantMotion = await detectMotion(5000, 6.5);
      console.log("¿Se detectó movimiento significativo?", hasSignificantMotion);
      
      // IMPROVED RANDOMNESS: 50/50 chance of following motion detection result
      const useRandomResult = Math.random() < 0.5;
      const forcedResult = useRandomResult ? Math.random() > 0.5 : hasSignificantMotion;
      
      let result;
      let percentage;
      
      // Special handling for Chakras
      if (area === "Chakras") {
        if (forcedResult) {
          // Random positive result for chakras
          const chakraResults = ["EN ARMONÍA"];
          result = chakraResults[Math.floor(Math.random() * chakraResults.length)];
          percentage = Math.floor(Math.random() * 26) + 75; // 75-100%
          setCameraResult("SI");
        } else {
          // Random negative result for chakras
          const chakraResults = ["BLOQUEOS", "DESEQUILIBRADOS", "CERRADOS"];
          result = chakraResults[Math.floor(Math.random() * chakraResults.length)];
          percentage = Math.floor(Math.random() * 75); // 0-74%
          setCameraResult("NO");
        }
      } else {
        // Original behavior for other areas
        if (forcedResult) {
          percentage = Math.floor(Math.random() * 31) + 70; // 70-100%
          result = "Alto";
          setCameraResult("SI");
        } else {
          percentage = Math.floor(Math.random() * 30); // 0-29%
          result = "Bajo";
          setCameraResult("NO");
        }
      }
      
      console.log(`Resultado del diagnóstico para ${area}: ${result} (${percentage}%)`);
      
      setState(prev => ({
        ...prev, 
        diagnosisResult: result,
        diagnosisPercentage: percentage
      }));
      
      // Save result in recent results
      addResultToCache({
        area,
        result,
        percentage,
        timestamp: Date.now(),
        personName: personName || undefined
      });

      // Stop sound
      stopPendulumSound();
    } catch (error) {
      console.error("Error durante el diagnóstico con movimiento:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error durante el análisis de movimiento.",
        variant: "destructive"
      });
      clearInterval(interval);
      setState(prev => ({...prev, swingIntervalId: null}));
      
      // Default to NO on error
      setCameraResult("NO");
      
      // For Chakras, use a negative result
      if (area === "Chakras") {
        const chakraResults = ["BLOQUEOS", "DESEQUILIBRADOS", "CERRADOS"];
        const result = chakraResults[Math.floor(Math.random() * chakraResults.length)];
        setState(prev => ({...prev, diagnosisResult: result}));
      } else {
        setState(prev => ({...prev, diagnosisResult: "Bajo"}));
      }
      
      setState(prev => ({...prev, diagnosisPercentage: 15}));
      
      // Save error result in recent results
      addResultToCache({
        area,
        result: area === "Chakras" ? "BLOQUEOS" : "Bajo",
        percentage: 15,
        timestamp: Date.now(),
        personName: personName || undefined
      });
    } finally {
      setState(prev => ({
        ...prev,
        processingCamera: false,
        isPendulumSwinging: false
      }));
    }
  };
  
  // Cleanup function for component unmount
  useEffect(() => {
    return () => {
      // Cleanup audio
      stopPendulumSound();
      
      // Clear any remaining intervals
      if (state.swingIntervalId !== null) {
        clearInterval(state.swingIntervalId);
      }
    };
  }, [state.swingIntervalId, stopPendulumSound]);
  
  return {
    ...state,
    isMobileDevice,
    startMotionDiagnosis
  };
};
