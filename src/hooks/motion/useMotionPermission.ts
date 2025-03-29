
import { useState } from "react";

export function useMotionPermission() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(false);

  // Request device motion permissions (for iOS 13+)
  const requestPermission = async () => {
    console.log("Solicitando permiso para sensor de movimiento");
    if (typeof DeviceMotionEvent !== 'undefined' && 
        typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        console.log("Dispositivo iOS detectado, solicitando permisos específicos");
        const permissionState = await (DeviceMotionEvent as any).requestPermission();
        const granted = permissionState === 'granted';
        setHasPermission(granted);
        console.log("Permiso concedido:", granted);
        return granted;
      } catch (e) {
        console.error('Error requesting device motion permission:', e);
        setHasPermission(false);
        return false;
      }
    } else {
      // Para dispositivos no iOS o iOS < 13, el permiso se concede implícitamente
      console.log("Dispositivo no iOS o anterior a iOS 13, permisos concedidos implícitamente");
      setHasPermission(true);
      setIsSupported(typeof DeviceMotionEvent !== 'undefined');
      return true;
    }
  };

  return {
    hasPermission,
    isSupported,
    requestPermission,
    setIsSupported
  };
}
