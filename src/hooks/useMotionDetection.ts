
import { useState } from "react";
import { CalibrationState, DeviceMotionState } from "@/hooks/motion/types";

export function useMotionDetection(motion: DeviceMotionState, calibration: CalibrationState) {
  const [significantMotion, setSignificantMotion] = useState<boolean | null>(null);
  const [lastMotionValues, setLastMotionValues] = useState<number[]>([]);
  const [lastMotionTime, setLastMotionTime] = useState<number>(Date.now());

  // Detección de movimiento que responde SI o NO según haya o no movimiento
  const detectMotion = (durationMs = 5000, thresholdDegrees = 0.02) => {
    return new Promise<boolean>((resolve) => {
      console.log(`Iniciando detección de movimiento (umbral: ${thresholdDegrees}, duración: ${durationMs}ms)`);
      let motionDetected = false;
      const startTime = Date.now();
      
      // Limpiar valores anteriores
      setLastMotionValues([]);
      setSignificantMotion(null);
      setLastMotionTime(Date.now());
      
      // Monitorear con alta frecuencia
      const interval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        console.log(`Tiempo transcurrido: ${Math.floor(elapsedTime / 1000)}s de ${Math.floor(durationMs / 1000)}s`);

        if (motion.acceleration.x !== null || motion.acceleration.y !== null || 
            motion.acceleration.z !== null) {
            
          // Calcular cambios en la aceleración con mayor sensibilidad
          const deltaX = Math.abs((motion.acceleration.x || 0) - calibration.x);
          const deltaY = Math.abs((motion.acceleration.y || 0) - calibration.y);
          const deltaZ = Math.abs((motion.acceleration.z || 0) - calibration.z);
          
          // Suma total del movimiento
          const totalDelta = deltaX + deltaY + deltaZ;
          
          console.log(`Delta total de movimiento: ${totalDelta.toFixed(4)}`);
          
          setLastMotionValues(prev => [...prev, totalDelta]);
          
          // Umbral más bajo para detectar movimientos mínimos
          if (totalDelta > thresholdDegrees) {
            console.log("¡Movimiento detectado! Actualizando tiempo");
            setLastMotionTime(Date.now());
            motionDetected = true;
            setSignificantMotion(true);
          } else if (Date.now() - lastMotionTime > 2500) {
            // Aumentamos el tiempo de espera antes de confirmar que no hay movimiento
            motionDetected = false;
            setSignificantMotion(false);
          }
        }
        
        // Siempre completamos el tiempo completo antes de resolver
        if (elapsedTime >= durationMs) {
          clearInterval(interval);
          
          console.log(`Tiempo completado (${durationMs}ms). ¿Se detectó movimiento?: ${motionDetected}`);
          
          if (motionDetected) {
            console.log("Resultado final: SI (se detectó movimiento)");
            setSignificantMotion(true);
            resolve(true);
          } else {
            console.log("Resultado final: NO (no se detectó movimiento)");
            setSignificantMotion(false);
            resolve(false);
          }
        }
      }, 100); // Monitoreo frecuente
      
      // Asegurar que siempre esperamos el tiempo completo
      setTimeout(() => {
        clearInterval(interval);
        
        console.log(`Tiempo expirado (${durationMs}ms). ¿Se detectó movimiento?: ${motionDetected}`);
        
        if (motionDetected) {
          setSignificantMotion(true);
          resolve(true);
        } else {
          setSignificantMotion(false);
          resolve(false);
        }
      }, durationMs + 100);
    });
  };

  return {
    significantMotion,
    setSignificantMotion,
    lastMotionValues,
    setLastMotionValues,
    detectMotion
  };
}
