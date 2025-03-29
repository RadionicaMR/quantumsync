
import { useState } from "react";
import { CalibrationState, DeviceMotionState } from "@/hooks/motion/types";

export function useMotionDetection(motion: DeviceMotionState, calibration: CalibrationState) {
  const [significantMotion, setSignificantMotion] = useState<boolean | null>(null);
  const [lastMotionValues, setLastMotionValues] = useState<number[]>([]);

  // Detección de movimiento que responde SI o NO según haya o no movimiento
  const detectMotion = (durationMs = 5000, thresholdDegrees = 2) => {
    return new Promise<boolean>((resolve) => {
      console.log(`Iniciando detección de movimiento (umbral: ${thresholdDegrees}°, duración: ${durationMs}ms)`);
      let motionDetected = false;
      const startTime = Date.now();
      
      // Limpiar valores anteriores
      setLastMotionValues([]);
      setSignificantMotion(null);
      
      // Monitorear con alta frecuencia
      const interval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        console.log(`Tiempo transcurrido: ${Math.floor(elapsedTime / 1000)}s de ${Math.floor(durationMs / 1000)}s`);

        if (motion.rotation.beta !== null || motion.rotation.gamma !== null || 
            motion.acceleration.x !== null || motion.acceleration.y !== null || 
            motion.acceleration.z !== null) {
            
          // Calcular desviaciones de rotación
          const betaDeviation = Math.abs((motion.rotation.beta || 0) - calibration.beta);
          const gammaDeviation = Math.abs((motion.rotation.gamma || 0) - calibration.gamma);
          const alphaDeviation = Math.abs((motion.rotation.alpha || 0) - calibration.alpha);
          
          // Calcular desviaciones de aceleración
          const xDeviation = Math.abs((motion.acceleration.x || 0) - calibration.x);
          const yDeviation = Math.abs((motion.acceleration.y || 0) - calibration.y);
          const zDeviation = Math.abs((motion.acceleration.z || 0) - calibration.z);
          
          // Almacenar la desviación actual para historial
          const rotationDeviation = Math.max(betaDeviation, gammaDeviation, alphaDeviation);
          const accelDeviation = Math.max(xDeviation, yDeviation, zDeviation);
          
          console.log(`Desviación rotación: ${rotationDeviation.toFixed(2)}° | Aceleración: ${accelDeviation.toFixed(2)}`);
          
          setLastMotionValues(prev => [...prev, rotationDeviation, accelDeviation * 100]);
          
          // Detectamos movimiento con umbral bajo para mayor sensibilidad
          if (rotationDeviation > 1.0 || accelDeviation > 0.05) {
            console.log("¡Movimiento detectado! Se responderá SI");
            motionDetected = true;
          }
        }
        
        // Esperamos siempre el tiempo completo antes de resolver
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
