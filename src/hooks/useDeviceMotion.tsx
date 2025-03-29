
import { useMotionPermission } from "./motion/useMotionPermission";
import { useMotionEvents } from "./motion/useMotionEvents";
import { useCalibration } from "./motion/useCalibration";
import { useMotionDetection } from "./motion/useMotionDetection";

export function useDeviceMotion() {
  const { motion, setMotion } = useMotionEvents();
  const { hasPermission, isSupported, requestPermission } = useMotionPermission();
  const { calibration, calibrateDevice } = useCalibration(motion);
  const { significantMotion, detectMotion } = useMotionDetection(motion, calibration);

  // Update the motion state with permission state from useMotionPermission
  if (motion.hasPermission !== hasPermission || motion.isSupported !== isSupported) {
    setMotion(prev => ({
      ...prev,
      hasPermission,
      isSupported
    }));
  }

  return {
    motion,
    requestPermission,
    calibrateDevice,
    detectMotion,
    significantMotion,
  };
}
