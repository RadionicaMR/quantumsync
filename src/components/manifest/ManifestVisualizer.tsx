
import React, { useEffect, useState } from 'react';
import { ManifestPattern } from '@/data/manifestPatterns';
import VisualizationContainer from './visualizer/VisualizationContainer';
import ManifestVisualizerInfo from './visualizer/ManifestVisualizerInfo';

interface ManifestVisualizerProps {
  currentImage: 'pattern' | 'receptor' | 'mix' | 'radionic';
  patternImage: string | null;
  patternImages: string[];
  receptorImage: string | null;
  receptorImages: string[];
  isActive: boolean;
  selectedPattern: string;
  patterns: ManifestPattern[];
  manifestPatterns: Record<string, string>;
  intention: string;
  manifestSound: boolean;
  manifestFrequency: number[];
  exposureTime: number[];
  manifestSpeed: number[];
  visualSpeed?: number[];
  rate1?: string;
  rate2?: string;
  rate3?: string;
  receptorName?: string;
}

const ManifestVisualizer: React.FC<ManifestVisualizerProps> = ({
  currentImage,
  patternImage,
  patternImages,
  receptorImage,
  receptorImages,
  isActive,
  selectedPattern,
  patterns,
  manifestPatterns,
  intention,
  manifestSound,
  manifestFrequency,
  exposureTime,
  manifestSpeed,
  visualSpeed = [10],
  rate1 = "",
  rate2 = "",
  rate3 = "",
  receptorName = ""
}) => {
  // State to track alternate display for active visualization
  const [displayAlternate, setDisplayAlternate] = useState(false);

  // Debug log for visualization
  useEffect(() => {
    console.log("ManifestVisualizer render:", {
      currentImage,
      isActive,
      patternImage,
      receptorImage,
      patternImagesCount: patternImages.length,
      receptorImagesCount: receptorImages.length,
      selectedPattern,
      intention,
      visualSpeed
    });
  }, [currentImage, isActive, patternImage, receptorImage, patternImages, receptorImages, selectedPattern, intention, visualSpeed]);

  // Effect to handle image alternation when active
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    if (isActive && currentImage !== 'mix') {
      // Calculate interval based on visualSpeed (higher speed = shorter interval)
      const speed = visualSpeed[0] || 10;
      const intervalTime = 2000 / Math.max(1, speed); // 2000ms at speed 1, scaled down as speed increases
      
      console.log(`Setting up image alternation interval: ${intervalTime}ms at speed ${speed}`);
      
      // Set up the alternating interval
      intervalId = setInterval(() => {
        setDisplayAlternate(prev => !prev);
      }, intervalTime);
    } else {
      // Reset to default display when inactive or in mix mode
      setDisplayAlternate(false);
    }
    
    // Clean up interval on unmount or when dependencies change
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isActive, currentImage, visualSpeed]);

  // Get the current pattern image
  const getPatternImageSrc = () => {
    if (patternImage) {
      return patternImage;
    } else if (patternImages.length > 0) {
      // Return the first image from the array
      return patternImages[0];
    } else if (selectedPattern && manifestPatterns[selectedPattern]) {
      return manifestPatterns[selectedPattern];
    }
    return null;
  };

  // Get the current receptor image or name
  const getReceptorImageSrc = () => {
    if (receptorImage) {
      return receptorImage;
    } else if (receptorImages.length > 0) {
      // Return the first image from the array
      return receptorImages[0];
    }
    return null;
  };

  const patternImageSrc = getPatternImageSrc();
  const receptorImageSrc = getReceptorImageSrc();
  
  // Determine which images to show based on current mode and active state
  let showPatternImage = false;
  let showReceptorImage = false;
  
  if (currentImage === 'mix') {
    // In mix mode, show both
    showPatternImage = true;
    showReceptorImage = true;
  } else if (isActive) {
    // When active, use alternation logic based on the currentImage setting
    if (currentImage === 'pattern' || currentImage === 'radionic') {
      // In pattern mode, alternate between pattern and nothing
      showPatternImage = !displayAlternate;
      showReceptorImage = false;
    } else if (currentImage === 'receptor') {
      // In receptor mode, alternate between receptor and nothing
      showPatternImage = false;
      showReceptorImage = !displayAlternate;
    }
  } else {
    // When inactive, respect the current image mode
    if (currentImage === 'pattern' || currentImage === 'radionic') {
      showPatternImage = true;
      showReceptorImage = false;
    } else if (currentImage === 'receptor') {
      showPatternImage = false;
      showReceptorImage = true;
    }
  }

  return (
    <div className="relative min-h-[300px] bg-black/20 dark:bg-black/40 rounded-lg overflow-hidden p-4">
      <VisualizationContainer
        showPatternImage={showPatternImage}
        showReceptorImage={showReceptorImage}
        patternImageSrc={patternImageSrc}
        receptorImageSrc={receptorImageSrc}
        isActive={isActive}
        intention={intention}
        receptorName={receptorName}
      />
      
      <ManifestVisualizerInfo
        isActive={isActive}
        manifestFrequency={manifestFrequency}
        visualSpeed={visualSpeed}
        rate1={rate1}
        rate2={rate2}
        rate3={rate3}
      />
    </div>
  );
};

export default ManifestVisualizer;
