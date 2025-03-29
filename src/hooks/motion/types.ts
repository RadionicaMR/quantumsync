
export interface DeviceMotionState {
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

export interface CalibrationState {
  beta: number;
  gamma: number;
  alpha: number;
  x: number;
  y: number;
  z: number;
}
