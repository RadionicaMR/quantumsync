
import { useEffect, useState } from "react";
import { DeviceMotionState } from "./types";

export function useMotionEvents() {
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
    setMotion
  };
}
