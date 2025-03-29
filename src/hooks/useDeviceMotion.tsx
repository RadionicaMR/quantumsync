
import { useState, useEffect } from "react";

interface DeviceMotionState {
  acceleration: {
    x: number | null;
    y: number | null;
    z: number | null;
  };
  rotation: {
    alpha: number | null; // Z axis - the compass direction the device is facing in degrees
    beta: number | null;  // X axis - front to back motion of the device in degrees
    gamma: number | null; // Y axis - left to right motion of the device in degrees
  };
  interval: number | null;
  hasPermission: boolean | null;
  isSupported: boolean;
}

export function useDeviceMotion() {
  const [motion, setMotion] = useState<DeviceMotionState>({
    acceleration: {
      x: null,
      y: null,
      z: null,
    },
    rotation: {
      alpha: null,
      beta: null,
      gamma: null,
    },
    interval: null,
    hasPermission: null,
    isSupported: false,
  });

  const [calibration, setCalibration] = useState({
    beta: 0,
    gamma: 0,
    alpha: 0,
    x: 0,
    y: 0,
    z: 0
  });

  const [significantMotion, setSignificantMotion] = useState<boolean | null>(null);
  const [lastMotionValues, setLastMotionValues] = useState<number[]>([]);

  // Request device motion permissions (for iOS 13+)
  const requestPermission = async () => {
    console.log("Solicitando permiso para sensor de movimiento");
    if (typeof DeviceMotionEvent !== 'undefined' && 
        typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        console.log("Dispositivo iOS detectado, solicitando permisos específicos");
        const permissionState = await (DeviceMotionEvent as any).requestPermission();
        const granted = permissionState === 'granted';
        setMotion(prev => ({
          ...prev,
          hasPermission: granted,
        }));
        console.log("Permiso concedido:", granted);
        return granted;
      } catch (e) {
        console.error('Error requesting device motion permission:', e);
        setMotion(prev => ({
          ...prev,
          hasPermission: false,
        }));
        return false;
      }
    } else {
      // Para dispositivos no iOS o iOS < 13, el permiso se concede implícitamente
      console.log("Dispositivo no iOS o anterior a iOS 13, permisos concedidos implícitamente");
      setMotion(prev => ({
        ...prev,
        hasPermission: true,
        isSupported: typeof DeviceMotionEvent !== 'undefined',
      }));
      return true;
    }
  };

  // Calibrate the device's current position as the neutral position
  const calibrateDevice = () => {
    console.log("Calibrando dispositivo...");
    // Guardar posición actual como punto de referencia
    setCalibration({
      beta: motion.rotation.beta || 0,
      gamma: motion.rotation.gamma || 0,
      alpha: motion.rotation.alpha || 0,
      x: motion.acceleration.x || 0,
      y: motion.acceleration.y || 0,
      z: motion.acceleration.z || 0
    });
    
    console.log("Dispositivo calibrado:", {
      beta: motion.rotation.beta,
      gamma: motion.rotation.gamma,
      alpha: motion.rotation.alpha,
      x: motion.acceleration.x,
      y: motion.acceleration.y,
      z: motion.acceleration.z
    });
    
    // Reiniciamos la detección de movimiento
    setSignificantMotion(false);
    setLastMotionValues([]);
    
    return true;
  };

  // Enhanced motion detection that stores a history of motion values
  const detectMotion = (durationMs = 5000, thresholdDegrees = 5) => {
    return new Promise<boolean>((resolve) => {
      console.log(`Iniciando detección de movimiento (umbral: ${thresholdDegrees}°, duración: ${durationMs}ms)`);
      let maxDeviation = 0;
      let detected = false;
      let motionDetected = false;
      const startTime = Date.now();
      
      // Reset the calibration to get a fresh reference point
      calibrateDevice();
      
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
          
          // Detect any movement at all (extremely sensitive - almost any non-zero value)
          if (rotationDeviation > 0.00001 || accelDeviation > 0.00001) {
            console.log("¡Movimiento mínimo detectado!");
            detected = true;
            motionDetected = true;
            setSignificantMotion(true);
            
            // Resolver inmediatamente si detectamos movimiento
            clearInterval(interval);
            resolve(true);
          }
        }
        
        // Early resolve if time is up
        if (Date.now() - startTime >= durationMs) {
          clearInterval(interval);
          
          // Check if there was any motion at all during the period
          const hasAnyMotion = lastMotionValues.some(value => value > 0);
          
          console.log(`Tiempo completado. Máxima desviación: ${maxDeviation.toFixed(6)}`);
          console.log(`¿Se detectó algún movimiento?: ${hasAnyMotion || detected}`);
          
          // Si se detectó cualquier movimiento, resolver como true
          if (hasAnyMotion || detected || maxDeviation > 0) {
            setSignificantMotion(true);
            resolve(true);
          } else {
            setSignificantMotion(false);
            resolve(false);
          }
        }
      }, 25); // Frecuencia muy alta (25ms) para capturar cualquier movimiento
      
      // After specified duration, ensure we resolve the promise
      setTimeout(() => {
        clearInterval(interval);
        
        // Final check for ANY motion at all
        const hasAnyMotion = lastMotionValues.some(value => value > 0);
        
        console.log(`Tiempo límite alcanzado. ¿Se detectó algún movimiento?: ${hasAnyMotion || detected}`);
        
        if (hasAnyMotion || detected || maxDeviation > 0) {
          setSignificantMotion(true);
          resolve(true);
        } else {
          setSignificantMotion(false);
          resolve(false);
        }
      }, durationMs + 50);
    });
  };

  // Setup device motion event listeners with high precision
  useEffect(() => {
    const isSupported = typeof window !== 'undefined' && 'DeviceMotionEvent' in window;
    
    if (!isSupported) {
      console.log("Los eventos de movimiento no son compatibles con este dispositivo");
      setMotion(prev => ({ ...prev, isSupported: false }));
      return;
    }
    
    console.log("Configurando listeners de eventos de movimiento del dispositivo");
    setMotion(prev => ({ ...prev, isSupported: true }));
    
    const handleDeviceMotion = (event: DeviceMotionEvent) => {
      const acceleration = event.accelerationIncludingGravity || { x: null, y: null, z: null };
      
      setMotion(prev => ({
        ...prev,
        acceleration: {
          x: acceleration.x,
          y: acceleration.y,
          z: acceleration.z,
        },
        rotation: {
          alpha: event.rotationRate?.alpha || null,
          beta: event.rotationRate?.beta || null,
          gamma: event.rotationRate?.gamma || null,
        },
        interval: event.interval || null,
      }));
    };
    
    window.addEventListener('devicemotion', handleDeviceMotion);
    
    return () => {
      window.removeEventListener('devicemotion', handleDeviceMotion);
    };
  }, []);
  
  return {
    motion,
    requestPermission,
    calibrateDevice,
    detectMotion,
    significantMotion,
  };
}
