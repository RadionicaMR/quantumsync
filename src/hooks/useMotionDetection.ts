
import { useState } from "react";
import { CalibrationState, DeviceMotionState } from "@/hooks/motion/types";

export function useMotionDetection(motion: DeviceMotionState, calibration: CalibrationState) {
  const [significantMotion, setSignificantMotion] = useState<boolean | null>(null);
  const [lastMotionValues, setLastMotionValues] = useState<number[]>([]);

  // Detección de movimiento con umbral más bajo para mayor precisión
  const detectMotion = (durationMs = 5000, thresholdDegrees = 3) => {
    return new Promise<boolean>((resolve) => {
      console.log(`Iniciando detección de movimiento (umbral: ${thresholdDegrees}°, duración: ${durationMs}ms)`);
      let maxDeviation = 0;
      let detected = false;
      const startTime = Date.now();
      
      // Limpiar valores anteriores
      setLastMotionValues([]);
      
      // Monitorear con alta frecuencia
      const interval = setInterval(() => {
        if (motion.rotation.beta !== null || motion.rotation.gamma !== null || 
            motion.acceleration.x !== null || motion.acceleration.y !== null || 
            motion.acceleration.z !== null) {
            
          // Calcular desviaciones de rotación - más sensible
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
          
          console.log(`Desviación rotación: ${rotationDeviation.toFixed(5)}° | Aceleración: ${accelDeviation.toFixed(5)}`);
          
          setLastMotionValues(prev => [...prev, rotationDeviation, accelDeviation * 100]);
          
          // Actualizar la máxima desviación observada
          maxDeviation = Math.max(maxDeviation, rotationDeviation, accelDeviation * 100);
          
          // Detección con umbral muy bajo para capturar cualquier movimiento
          if (rotationDeviation > 1.5 || accelDeviation > 0.1) {
            console.log("¡Movimiento significativo detectado!");
            detected = true;
            setSignificantMotion(true);
            
            // Resolver inmediatamente si detectamos movimiento
            clearInterval(interval);
            resolve(true);
          }
        }
        
        // Resolver cuando se acabe el tiempo
        if (Date.now() - startTime >= durationMs) {
          clearInterval(interval);
          
          console.log(`Tiempo completado. Máxima desviación: ${maxDeviation.toFixed(6)}`);
          
          if (detected) {
            console.log("Resultado final: SI (se detectó movimiento)");
            setSignificantMotion(true);
            resolve(true);
          } else {
            console.log("Resultado final: NO (no se detectó movimiento)");
            setSignificantMotion(false);
            resolve(false);
          }
        }
      }, 10); // Monitoreo más frecuente
      
      // Asegurar que resolvemos la promesa después del tiempo especificado
      setTimeout(() => {
        clearInterval(interval);
        
        if (!detected) {
          console.log("Tiempo expirado sin detección: NO");
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
