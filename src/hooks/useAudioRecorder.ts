
import { useState, useRef } from "react";

type AudioRecorderHook = {
  isRecording: boolean;
  audioURL: string | null;
  audioBlob: Blob | null;
  startRecording: () => void;
  stopRecording: () => void;
  clearRecording: () => void;
};

export function useAudioRecorder(maxDurationSeconds = 60): AudioRecorderHook {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timeoutRef = useRef<number>();

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert("Tu navegador no soporta grabación de audio");
      return;
    }
    setAudioURL(null);
    setAudioBlob(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e: BlobEvent) => {
        chunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioURL(URL.createObjectURL(blob));
        // Detener tracks para liberar el micrófono
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
      // Detener grabación después de maxDurationSeconds
      timeoutRef.current = window.setTimeout(() => {
        stopRecording();
      }, maxDurationSeconds * 1000);
    } catch (error) {
      alert("No se pudo acceder al micrófono.");
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
