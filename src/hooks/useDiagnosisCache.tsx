
import { useState, useEffect } from 'react';

// Interface for storing recent diagnosis results
export interface RecentDiagnosisResult {
  area: string;
  result: string;
  percentage: number;
  timestamp: number;
  personName?: string;
}

export const useDiagnosisCache = () => {
  const [recentResults, setRecentResults] = useState<RecentDiagnosisResult[]>([]);

  // Check if there's a recent result for the given area
  const getRecentResult = (area: string): RecentDiagnosisResult | undefined => {
    const now = Date.now();
    return recentResults.find(result => 
      result.area === area && (now - result.timestamp) < 5 * 60 * 1000
    );
  };

  // Add a new result to the cache
  const addResultToCache = (result: RecentDiagnosisResult) => {
    setRecentResults(prev => [...prev, result]);
  };

  // Clean up old results
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setRecentResults(prev => 
        prev.filter(result => (now - result.timestamp) < 5 * 60 * 1000)
      );
    }, 60000); // Check every minute
    
    return () => clearInterval(cleanupInterval);
  }, []);

  return {
    getRecentResult,
    addResultToCache,
    recentResults
  };
};
