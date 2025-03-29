
import { useState } from "react";
import { DeviceMotionState, CalibrationState } from "./types";

export function useCalibration(motion: DeviceMotionState) {
  const [calibration, setCalibration] = useState<CalibrationState>({
    beta: 0,
    gamma: 0,
    alpha: 0,
    x: 0,
    y: 0,
    z: 0
  });

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
    
    return true;
  };

  return {
    calibration,
    calibrateDevice
  };
}
