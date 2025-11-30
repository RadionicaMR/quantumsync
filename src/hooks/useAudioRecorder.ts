
import { useState, useRef } from "react";

type AudioRecorderHook = {
  isRecording: boolean;
  audioURL: string | null;
  audioBlob: Blob | null;
  startRecording: () => void;
  stopRecording: () => void;
  clearRecording: () => void;
};

export function useAudioRecorder(maxDurationSeconds = 180): AudioRecorderHook {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timeoutRef = useRef<number>();
  const streamRef = useRef<MediaStream | null>(null);

  // Detectar Safari
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert("Tu navegador no soporta grabación de audio");
      return;
    }

    // Limpiar estado previo
    setAudioURL(null);
    setAudioBlob(null);

    try {
      // Solicitar permisos de micrófono con configuración compatible con Safari
      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      // Configurar MediaRecorder con formato compatible con Safari
      let options: MediaRecorderOptions = {};
      
      if (MediaRecorder.isTypeSupported('audio/mp4')) {
        options.mimeType = 'audio/mp4';
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        options.mimeType = 'audio/webm';
      } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
        options.mimeType = 'audio/ogg';
      }

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mimeType = options.mimeType || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        console.log("Audio grabado correctamente:", {
          size: blob.size,
          type: blob.type,
          duration: `${maxDurationSeconds}s max`
        });
        
        // Detener y limpiar el stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => {
            track.stop();
          });
          streamRef.current = null;
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('Error en MediaRecorder:', event);
        alert("Error durante la grabación. Intenta de nuevo.");
        setIsRecording(false);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      // Iniciar grabación
      mediaRecorder.start(isSafari ? 1000 : 250); // Safari funciona mejor con chunks más grandes
      setIsRecording(true);

      // Detener grabación después de maxDurationSeconds
      timeoutRef.current = window.setTimeout(() => {
        stopRecording();
      }, maxDurationSeconds * 1000);

    } catch (error: any) {
      console.error('Error al acceder al micrófono:', error);
      
      if (error.name === 'NotAllowedError') {
        alert("Permisos de micrófono denegados. Por favor, permite el acceso al micrófono en la configuración de tu navegador.");
      } else if (error.name === 'NotFoundError') {
        alert("No se encontró micrófono. Verifica que tu dispositivo tenga micrófono.");
      } else if (error.name === 'NotReadableError') {
        alert("El micrófono está siendo usado por otra aplicación.");
      } else {
        alert("No se pudo acceder al micrófono. Verifica los permisos y que no esté siendo usado por otra aplicación.");
      }
      
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const clearRecording = () => {
    setAudioURL(null);
    setAudioBlob(null);
    chunksRef.current = [];
  };

  return {
    isRecording,
    audioURL,
    audioBlob,
    startRecording,
    stopRecording,
    clearRecording,
  };
}
