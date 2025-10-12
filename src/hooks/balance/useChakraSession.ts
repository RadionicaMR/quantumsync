
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ChakraName } from '@/constants/chakraData';
import { addChakraBalanceSession } from '@/utils/chakraBalanceStorage';
import { useSessionRecording } from '@/hooks/useSessionRecording';

export const useChakraSession = (initialPersonName = '') => {
  const navigate = useNavigate();
  const { recordSession: recordToDatabase } = useSessionRecording();
  const [personName, setPersonName] = useState(initialPersonName);
  const [duration, setDuration] = useState([1]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  const recordSession = useCallback(async (chakraData?: any) => {
    if (personName) {
      // Keep localStorage for backward compatibility
      addChakraBalanceSession(personName);
      
      // Save to database
      await recordToDatabase(
        personName,
        'balance_chakras',
        {
          duration: duration[0],
          chakras: chakraData,
          completedAt: new Date().toISOString()
        }
      );
    }
  }, [personName, duration, recordToDatabase]);
  
  const navigateToDiagnose = useCallback(() => {
    navigate('/diagnose');
  }, [navigate]);

  return {
    personName,
    setPersonName,
    duration,
    setDuration,
    isPlaying,
    setIsPlaying,
    completed,
    setCompleted,
    recordSession,
    navigateToDiagnose
  };
};
