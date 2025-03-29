
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
  });

  const [significantMotion, setSignificantMotion] = useState<boolean | null>(null);

  // Request device motion permissions (for iOS 13+)
  const requestPermission = async () => {
    if (typeof DeviceMotionEvent !== 'undefined' && 
        typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (DeviceMotionEvent as any).requestPermission();
        setMotion(prev => ({
          ...prev,
          hasPermission: permissionState === 'granted',
        }));
        return permissionState === 'granted';
      } catch (e) {
        console.error('Error requesting device motion permission:', e);
        setMotion(prev => ({
          ...prev,
          hasPermission: false,
        }));
        return false;
      }
    } else {
      // For non-iOS devices or iOS < 13, permission is implicitly granted
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
    if (motion.rotation.beta !== null && motion.rotation.gamma !== null) {
      setCalibration({
        beta: motion.rotation.beta,
        gamma: motion.rotation.gamma,
      });
      return true;
    }
    return false;
  };

  // Start monitoring device motion for a specific duration
  const detectMotion = (durationMs = 5000, thresholdDegrees = 5) => {
    return new Promise<boolean>((resolve) => {
      let maxDeviation = 0;
      let detected = false;
      
      // Reset the calibration
      calibrateDevice();
      
      // Start monitoring
      const interval = setInterval(() => {
        if (motion.rotation.beta !== null && motion.rotation.gamma !== null) {
          // Calculate deviation from calibrated position
          const betaDeviation = Math.abs(motion.rotation.beta - calibration.beta);
          const gammaDeviation = Math.abs(motion.rotation.gamma - calibration.gamma);
          
          // Use the maximum deviation on any axis
          const currentDeviation = Math.max(betaDeviation, gammaDeviation);
          
          // Update maximum deviation seen during this monitoring period
          maxDeviation = Math.max(maxDeviation, currentDeviation);
          
          // Check if threshold is exceeded
          if (currentDeviation > thresholdDegrees) {
            detected = true;
            setSignificantMotion(true);
          }
        }
      }, 100);
      
      // After specified duration, resolve the promise with the result
      setTimeout(() => {
        clearInterval(interval);
        setSignificantMotion(detected);
        resolve(detected);
      }, durationMs);
    });
  };

  // Setup device motion event listeners
  useEffect(() => {
    const isSupported = typeof window !== 'undefined' && 'DeviceMotionEvent' in window;
    
    if (!isSupported) {
      setMotion(prev => ({ ...prev, isSupported: false }));
      return;
    }
    
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
