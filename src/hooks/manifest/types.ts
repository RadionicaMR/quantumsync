
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
}
