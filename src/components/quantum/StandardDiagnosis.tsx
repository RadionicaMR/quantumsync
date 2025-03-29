
import { useState, useEffect, useRef } from 'react';
import { toast } from "@/components/ui/use-toast";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PendulumVisual from './PendulumVisual';
import DiagnosisResult from './DiagnosisResult';
import { useDeviceMotion } from '@/hooks/useDeviceMotion';
import { usePendulumAudio } from '@/hooks/usePendulumAudio';
import { RecentDiagnosisResult } from '@/hooks/useDiagnosisCache';

interface StandardDiagnosisProps {
  selectedArea: string | null;
  useCameraMode: boolean;
  pendulumSound: boolean;
  cameraResult: 'SI' | 'NO' | null;
  setCameraResult: (result: 'SI' | 'NO' | null) => void;
  personName: string;
  setPersonName: (name: string) => void;
  getRecentResult: (area: string) => RecentDiagnosisResult | undefined;
  addResultToCache: (result: RecentDiagnosisResult) => void;
}

const StandardDiagnosis: React.FC<StandardDiagnosisProps> = ({
  selectedArea,
  useCameraMode,
  pendulumSound,
  cameraResult,
  setCameraResult,
  personName,
  setPersonName,
  getRecentResult,
  addResultToCache
}) => {
  const [isPendulumSwinging, setIsPendulumSwinging] = useState(false);
  const [pendulumAngle, setPendulumAngle] = useState(0);
  const [diagnosisResult, setDiagnosisResult] = useState<string | null>(null);
  const [diagnosisPercentage, setDiagnosisPercentage] = useState(0);
  const [processingCamera, setProcessingCamera] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [swingIntervalId, setSwingIntervalId] = useState<number | null>(null);
  
  const { detectMotion, requestPermission, calibrateDevice } = useDeviceMotion();
  const { startPendulumSound, stopPendulumSound } = usePendulumAudio();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
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
  
  const startPendulum = (area: string) => {
    console.log(`Iniciando diagnóstico para: ${area}`);
    
    // Check if there's a recent result for this area (less than 5 minutes)
    const recentResult = getRecentResult(area);
    
    if (recentResult) {
      console.log(`Usando resultado reciente para ${area}: ${recentResult.result} (${recentResult.percentage}%)`);
      setDiagnosisResult(recentResult.result);
      setDiagnosisPercentage(recentResult.percentage);
      return;
    }
    
    setIsPendulumSwinging(true);
    setDiagnosisResult(null);
    setCameraResult(null);
    
    // Play sound if enabled
    if (pendulumSound) {
      startPendulumSound();
    }
    
    // Simulate pendulum swing
    let angle = 0;
    const interval = window.setInterval(() => {
      angle = Math.sin(Date.now() / 500) * 30;
      setPendulumAngle(angle);
    }, 16);
    
    setSwingIntervalId(interval);
    
    // Stop after random time between 3-6 seconds
    const duration = Math.random() * 3000 + 3000;
    setTimeout(() => {
      clearInterval(interval);
      setSwingIntervalId(null);
      setIsPendulumSwinging(false);
      setPendulumAngle(0);
      
      // Generate diagnosis result
      const percentage = Math.floor(Math.random() * 101);
      setDiagnosisPercentage(percentage);
      
      let result;
      if (percentage < 30) {
        result = "Bajo";
      } else if (percentage < 70) {
        result = "Medio";
      } else {
        result = "Alto";
      }
      
      setDiagnosisResult(result);
      
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

  const startMotionDiagnosis = async (area: string) => {
    if (!useCameraMode) {
      startPendulum(area);
      return;
    }

    // Check if there's a recent result for this area (less than 5 minutes)
    const recentResult = getRecentResult(area);
    
    if (recentResult) {
      console.log(`Usando resultado reciente para ${area}: ${recentResult.result} (${recentResult.percentage}%)`);
      setDiagnosisResult(recentResult.result);
      setDiagnosisPercentage(recentResult.percentage);
      if (recentResult.result === "Alto") {
        setCameraResult("SI");
      } else if (recentResult.result === "Bajo") {
        setCameraResult("NO");
      }
      return;
    }

    console.log("Iniciando diagnóstico con sensor de movimiento");
    setCameraResult(null);
    setProcessingCamera(true);
    setIsPendulumSwinging(true);
    
    // Let's mimic pendulum swinging during motion detection
    let angle = 0;
    const interval = window.setInterval(() => {
      angle = Math.sin(Date.now() / 500) * 30;
      setPendulumAngle(angle);
    }, 16);
    
    setSwingIntervalId(interval);
    
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
        setSwingIntervalId(null);
        setProcessingCamera(false);
        setIsPendulumSwinging(false);
        return;
      }
      
      // Calibrar el dispositivo para detectar posteriormente cualquier cambio
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
      
      // Detect motion with a reasonable threshold (increased to 3.0 degrees)
      const hasSignificantMotion = await detectMotion(5000, 3.0);
      console.log("¿Se detectó movimiento significativo?", hasSignificantMotion);
      
      // Stop swing animation
      clearInterval(interval);
      setSwingIntervalId(null);
      setPendulumAngle(0);
      setIsPendulumSwinging(false);
      
      // Respuestas basadas en movimiento real
      const percentage = hasSignificantMotion ? 85 : 15;
      setDiagnosisPercentage(percentage);
      
      let result;
      if (hasSignificantMotion) {
        console.log("Configurando resultado como ALTO/SI");
        result = "Alto";
        setCameraResult("SI");
      } else {
        console.log("Configurando resultado como BAJO/NO");
        result = "Bajo";
        setCameraResult("NO");
      }
      
      setDiagnosisResult(result);
      
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
      setSwingIntervalId(null);
      
      // Default to NO on error
      setCameraResult("NO");
      setDiagnosisResult("Bajo");
      setDiagnosisPercentage(15);
      
      // Save error result in recent results
      addResultToCache({
        area,
        result: "Bajo",
        percentage: 15,
        timestamp: Date.now(),
        personName: personName || undefined
      });
    } finally {
      setProcessingCamera(false);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup camera on component unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Cleanup audio
      stopPendulumSound();
      
      // Clear any remaining intervals
      if (swingIntervalId !== null) {
        clearInterval(swingIntervalId);
      }
    };
  }, [stopPendulumSound, swingIntervalId]);

  if (!selectedArea) {
    return (
      <div className="text-center text-muted-foreground">
        <div className="text-quantum-primary text-5xl mb-4">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p className="mb-4">Selecciona un área para comenzar tu diagnóstico energético</p>
        <p className="text-sm">El péndulo virtual te ayudará a identificar desequilibrios en tu campo energético</p>
      </div>
    );
  }

  return (
    <>
      {/* Campo para nombre de la persona */}
      <div className="w-full max-w-xs mb-6">
        <Label htmlFor="personName" className="text-sm font-medium mb-1 block">
          Nombre de la persona
        </Label>
        <Input 
          id="personName"
          value={personName}
          onChange={(e) => setPersonName(e.target.value)}
          placeholder="Ingresa el nombre"
          className="bg-quantum-dark/30 border-quantum-primary/30"
        />
      </div>
      
      <div className="text-lg mb-6">
        Diagnosticando: <span className="font-semibold">{selectedArea}</span>
        {personName && (
          <span> para <span className="font-semibold">{personName}</span></span>
        )}
      </div>
      
      <PendulumVisual 
        isPendulumSwinging={isPendulumSwinging} 
        pendulumAngle={pendulumAngle} 
      />
      
      {/* Video de la cámara (oculto) */}
      {useCameraMode && (
        <video 
          ref={videoRef}
          autoPlay 
          playsInline
          className="hidden"
        />
      )}
      
      <DiagnosisResult
        diagnosisResult={diagnosisResult}
        diagnosisPercentage={diagnosisPercentage}
        selectedArea={selectedArea}
        cameraResult={cameraResult}
        onDiagnoseAgain={() => startMotionDiagnosis(selectedArea)}
        personName={personName}
      />
      
      {(isPendulumSwinging || processingCamera) && (
        <div className="text-muted-foreground animate-pulse mt-8">
          {useCameraMode ? "Analizando movimiento del dispositivo..." : "Analizando patrones energéticos..."}
        </div>
      )}
      
      {!isPendulumSwinging && !diagnosisResult && (
        <div className="mt-6">
          <button
            className="bg-quantum-primary text-white px-6 py-2 rounded-md hover:bg-quantum-primary/90 transition-colors"
            onClick={() => startMotionDiagnosis(selectedArea)}
          >
            Iniciar Diagnóstico
          </button>
        </div>
      )}
    </>
  );
};

export default StandardDiagnosis;
