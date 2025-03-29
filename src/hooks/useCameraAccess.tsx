
import { useState, useRef, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";

export const useCameraAccess = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  // Function to start/stop camera
  const toggleCamera = async () => {
    if (isCameraActive && streamRef.current) {
      // Stop camera
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsCameraActive(false);
      return;
    }

    try {
      // Request camera permissions
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: { ideal: 'environment' } } 
      });
      
      streamRef.current = stream;
      setIsCameraActive(true);
      
      toast({
        title: "Cámara activada",
        description: "La cámara se ha activado correctamente.",
      });
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast({
        title: "Error de cámara",
        description: "No pudimos acceder a la cámara de tu dispositivo.",
        variant: "destructive"
      });
    }
  };

  // Cleanup camera on component unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return {
    isCameraActive,
    toggleCamera
  };
};
