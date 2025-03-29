
import { useState } from "react";
import { CalibrationState, DeviceMotionState } from "./types";

export function useMotionDetection(motion: DeviceMotionState, calibration: CalibrationState) {
  const [significantMotion, setSignificantMotion] = useState<boolean | null>(null);
  const [lastMotionValues, setLastMotionValues] = useState<number[]>([]);

  // Enhanced motion detection that stores a history of motion values
  const detectMotion = (durationMs = 5000, thresholdDegrees = 5) => {
    return new Promise<boolean>((resolve) => {
      console.log(`Iniciando detección de movimiento (umbral: ${thresholdDegrees}°, duración: ${durationMs}ms)`);
      let maxDeviation = 0;
      let detected = false;
      const startTime = Date.now();
      
      // Clear previous motion values
      setLastMotionValues([]);
      
      // Start monitoring with high frequency (25ms)
      const interval = setInterval(() => {
        if (motion.rotation.beta !== null || motion.rotation.gamma !== null || 
            motion.acceleration.x !== null || motion.acceleration.y !== null || 
            motion.acceleration.z !== null) {
            
          // Calculate rotation deviations
          const betaDeviation = Math.abs((motion.rotation.beta || 0) - calibration.beta);
          const gammaDeviation = Math.abs((motion.rotation.gamma || 0) - calibration.gamma);
          const alphaDeviation = Math.abs((motion.rotation.alpha || 0) - calibration.alpha);
          
          // Calculate acceleration deviations
          const xDeviation = Math.abs((motion.acceleration.x || 0) - calibration.x);
          const yDeviation = Math.abs((motion.acceleration.y || 0) - calibration.y);
          const zDeviation = Math.abs((motion.acceleration.z || 0) - calibration.z);
          
          // Store the current deviation for history
          const rotationDeviation = Math.max(betaDeviation, gammaDeviation, alphaDeviation);
          const accelDeviation = Math.max(xDeviation, yDeviation, zDeviation);
          
          console.log(`Desviación rotación: ${rotationDeviation.toFixed(5)}° | Aceleración: ${accelDeviation.toFixed(5)}`);
          
          setLastMotionValues(prev => [...prev, rotationDeviation, accelDeviation * 100]);
          
          // Update maximum deviation seen during this monitoring period
          maxDeviation = Math.max(maxDeviation, rotationDeviation, accelDeviation * 100);
          
          // BALANCED THRESHOLD - More moderate than before
          // This requires intentional movement but not as extreme as before
          if (rotationDeviation > 6.5 || accelDeviation > 0.35) {
            console.log("¡Movimiento significativo detectado!");
            detected = true;
            setSignificantMotion(true);
            
            // Resolver inmediatamente si detectamos movimiento
            clearInterval(interval);
            resolve(true);
          }
        }
        
        // Early resolve if time is up
        if (Date.now() - startTime >= durationMs) {
          clearInterval(interval);
          
          // More balanced threshold for final detection
          const hasSignificantMotion = lastMotionValues.some(value => value > 5.5);
          
          console.log(`Tiempo completado. Máxima desviación: ${maxDeviation.toFixed(6)}`);
          console.log(`¿Se detectó movimiento significativo?: ${hasSignificantMotion || detected}`);
          
          if (hasSignificantMotion || detected) {
            setSignificantMotion(true);
            resolve(true);
          } else {
            setSignificantMotion(false);
            resolve(false);
          }
        }
      }, 25);
      
      // After specified duration, ensure we resolve the promise
      setTimeout(() => {
        clearInterval(interval);
        
        // Final check for SIGNIFICANT motion (more balanced threshold)
        const hasSignificantMotion = lastMotionValues.some(value => value > 5.5);
        
        console.log(`Tiempo límite alcanzado. ¿Se detectó movimiento significativo?: ${hasSignificantMotion || detected}`);
        
        if (hasSignificantMotion || detected) {
          setSignificantMotion(true);
          resolve(true);
        } else {
          setSignificantMotion(false);
          resolve(false);
        }
      }, durationMs + 50);
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
