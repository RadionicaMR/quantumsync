
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ChakraName } from '@/constants/chakraData';
import { addChakraBalanceSession } from '@/utils/chakraBalanceStorage';

export const useChakraSession = (initialPersonName = '') => {
  const navigate = useNavigate();
  const [personName, setPersonName] = useState(initialPersonName);
  const [duration, setDuration] = useState([1]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  const recordSession = useCallback(() => {
    if (personName) {
      addChakraBalanceSession(personName);
    }
  }, [personName]);
  
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
