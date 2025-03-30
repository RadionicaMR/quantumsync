
import { useState } from 'react';

export const useTreatmentRates = () => {
  const [rate1, setRate1] = useState('');
  const [rate2, setRate2] = useState('');
  const [rate3, setRate3] = useState('');
  
  return {
    rate1,
    setRate1,
    rate2,
    setRate2,
    rate3,
    setRate3
  };
};
