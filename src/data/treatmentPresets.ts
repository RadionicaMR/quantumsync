
import { TreatmentPreset } from "@/hooks/useTreatment";

export const treatmentPresets: TreatmentPreset[] = [
  { id: 'sleep', name: 'Mejorar el Sueño', frequency: 396, description: 'Ondas Delta para promover un sueño profundo y reparador', duration: 45 },
  { id: 'stress', name: 'Reducir el Estrés', frequency: 639, description: 'Frecuencias Theta para relajación y alivio de la ansiedad', duration: 20 },
  { id: 'focus', name: 'Mejorar la Concentración', frequency: 852, description: 'Ondas Beta para mejorar la concentración y claridad mental', duration: 15 },
  { id: 'energy', name: 'Aumentar Energía', frequency: 528, description: 'La "frecuencia milagrosa" para vitalidad y reparación del ADN', duration: 10 },
  { id: 'harmony', name: 'Equilibrio Emocional', frequency: 741, description: 'Ayuda a liberar emociones negativas y promover la armonía', duration: 15 },
  { id: 'manifest', name: 'Manifestación', frequency: 963, description: 'Conecta con la conciencia espiritual y el poder de manifestación', duration: 30 },
];
