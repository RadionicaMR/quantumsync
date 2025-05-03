
export interface ManifestState {
  intention: string;
  isManifestActive: boolean;
  visualSpeed: number[];
  patternImage: string | null;
  receptorImage: string | null;
  // New properties for multiple images
  patternImages: string[];
  receptorImages: string[];
  selectedPattern: string;
  activeTab: string;
  manifestSound: boolean;
  manifestFrequency: number[];
  currentImage: 'pattern' | 'receptor' | 'mix';
  exposureTime: number[];
  timeRemaining: number | null;
  receptorName: string;
  rate1: string;
  rate2: string;
  rate3: string;
  indefiniteTime: boolean;
}

export interface ManifestAudio {
  oscillatorRef: React.RefObject<OscillatorNode | null>;
  audioContextRef: React.RefObject<AudioContext | null>;
  startAudio: (frequency: number) => void;
  stopAudio: () => void;
}

export interface ManifestTimers {
  hypnoticTimerRef: React.RefObject<NodeJS.Timeout | null>;
  exposureTimerRef: React.RefObject<NodeJS.Timeout | null>;
  countdownTimerRef: React.RefObject<NodeJS.Timeout | null>;
}
