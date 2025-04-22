
export type ChakraState = 'EQUILIBRADO' | 'ABIERTO' | 'CERRADO' | 'BLOQUEADO';

export interface RecentDiagnosisResult {
  area: string;
  result: string;
  percentage: number;
  timestamp: number;
  personName?: string;
}

export interface DiagnosisState {
  isPendulumSwinging: boolean;
  pendulumAngle: number;
  diagnosisResult: string | null;
  diagnosisPercentage: number;
  processingCamera: boolean;
  swingIntervalId: number | null;
}

export interface UseDiagnosisProps {
  useCameraMode: boolean;
  pendulumSound: boolean;
  setCameraResult: (result: 'SI' | 'NO' | null) => void;
  personName: string;
  getRecentResult: (area: string) => RecentDiagnosisResult | undefined;
  addResultToCache: (result: RecentDiagnosisResult) => void;
}
