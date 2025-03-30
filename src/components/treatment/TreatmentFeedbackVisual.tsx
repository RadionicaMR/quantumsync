
import React from 'react';

interface TreatmentFeedbackVisualProps {
  isPlaying: boolean;
  visualFeedback: boolean;
  frequency: number[];
  intensity: number[];
}

const TreatmentFeedbackVisual = ({ 
  isPlaying, 
  visualFeedback, 
  frequency, 
  intensity 
}: TreatmentFeedbackVisualProps) => {
  if (!isPlaying || !visualFeedback) return null;
  
  return (
    <div className="mt-4 relative h-40 bg-black/5 dark:bg-white/5 rounded-lg overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 bg-quantum-primary/20 rounded-full animate-ping"></div>
        <div className="w-16 h-16 bg-quantum-primary/10 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-24 h-24 bg-quantum-primary/5 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
      </div>
      <div className="absolute bottom-4 left-4 text-xs text-muted-foreground">
        Frecuencia: {frequency[0]} Hz · Intensidad: {intensity[0]}%
      </div>
    </div>
  );
};

export default TreatmentFeedbackVisual;
