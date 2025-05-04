
import { useState } from 'react';
import { ManifestState } from './types';

export const useManifestState = (): ManifestState & {
  setIntention: (value: string) => void;
  setVisualSpeed: (value: number[]) => void;
  setPatternImage: (value: string | null) => void;
  setReceptorImage: (value: string | null) => void;
  setPatternImages: (value: string[]) => void;
  setReceptorImages: (value: string[]) => void;
  setActiveTab: (value: string) => void;
  setManifestSound: (value: boolean) => void;
  setManifestFrequency: (value: number[]) => void;
  setCurrentImage: (value: ((prev: 'pattern' | 'receptor' | 'mix' | 'radionic') => 'pattern' | 'receptor' | 'mix' | 'radionic') | 'pattern' | 'receptor' | 'mix' | 'radionic') => void;
  setExposureTime: (value: number[]) => void;
  setTimeRemaining: (value: ((prev: number | null) => number | null) | number | null) => void;
  setReceptorName: (value: string) => void;
  setRate1: (value: string) => void;
  setRate2: (value: string) => void;
  setRate3: (value: string) => void;
  setIsManifestActive: (value: boolean) => void;
  setSelectedPattern: (value: string) => void;
  setIndefiniteTime: (value: boolean) => void;
  setManifestSpeed: (value: number[]) => void;
} => {
  const [intention, setIntention] = useState('');
  const [isManifestActive, setIsManifestActive] = useState(false);
  const [visualSpeed, setVisualSpeed] = useState([10]);
  const [patternImage, setPatternImage] = useState<string | null>(null);
  const [receptorImage, setReceptorImage] = useState<string | null>(null);
  // State for multiple images
  const [patternImages, setPatternImages] = useState<string[]>([]);
  const [receptorImages, setReceptorImages] = useState<string[]>([]);
  const [selectedPattern, setSelectedPattern] = useState('');
  const [activeTab, setActiveTab] = useState("presets");
  const [manifestSound, setManifestSound] = useState(true);
  const [manifestFrequency, setManifestFrequency] = useState([528]);
  const [currentImage, setCurrentImage] = useState<'pattern' | 'receptor' | 'mix' | 'radionic'>('pattern');
  const [exposureTime, setExposureTime] = useState([5]); 
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [receptorName, setReceptorName] = useState('');
  const [rate1, setRate1] = useState('');
  const [rate2, setRate2] = useState('');
  const [rate3, setRate3] = useState('');
  const [indefiniteTime, setIndefiniteTime] = useState(false);
  // Add manifestSpeed state with default value
  const [manifestSpeed, setManifestSpeed] = useState([10]);

  return {
    intention,
    isManifestActive,
    visualSpeed,
    patternImage,
    receptorImage,
    patternImages,
    receptorImages,
    selectedPattern,
    activeTab,
    manifestSound,
    manifestFrequency,
    currentImage,
    exposureTime,
    timeRemaining,
    receptorName,
    rate1,
    rate2,
    rate3,
    indefiniteTime,
    manifestSpeed,
    // Setters
    setIntention,
    setIsManifestActive,
    setVisualSpeed,
    setPatternImage,
    setReceptorImage,
    setPatternImages,
    setReceptorImages,
    setSelectedPattern,
    setActiveTab,
    setManifestSound,
    setManifestFrequency,
    setCurrentImage,
    setExposureTime,
    setTimeRemaining,
    setReceptorName,
    setRate1,
    setRate2,
    setRate3,
    setIndefiniteTime,
    setManifestSpeed
  };
};
