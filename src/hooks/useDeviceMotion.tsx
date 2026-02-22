
import { useEffect } from "react";
import { useMotionPermission } from "./motion/useMotionPermission";
import { useMotionEvents } from "./motion/useMotionEvents";
import { useCalibration } from "./motion/useCalibration";
import { useMotionDetection } from "./useMotionDetection";

export function useDeviceMotion() {
  const { motion, setMotion } = useMotionEvents();
  const { hasPermission, isSupported, requestPermission } = useMotionPermission();
  const { calibration, calibrateDevice } = useCalibration(motion);
  const { significantMotion, detectMotion } = useMotionDetection(motion, calibration);

  // CRITICAL FIX: Sync permission state in useEffect, NOT in render body.
  // Calling setState during render causes infinite re-render loops that crash Safari.
  useEffect(() => {
    if (motion.hasPermission !== hasPermission || motion.isSupported !== isSupported) {
      setMotion(prev => ({
        ...prev,
        hasPermission,
        isSupported
      }));
    }
  }, [hasPermission, isSupported]);

  return {
    motion,
    requestPermission,
    calibrateDevice,
    detectMotion,
    significantMotion,
  };
}
