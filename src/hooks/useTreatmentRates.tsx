
import { useState } from 'react';

export const useTreatmentRates = () => {
  const [rate1, setRate1] = useState('');
  const [rate2, setRate2] = useState('');
  const [rate3, setRate3] = useState('');
  const [rate4, setRate4] = useState('');
  const [rate5, setRate5] = useState('');
  const [rate6, setRate6] = useState('');
  
  return {
    rate1, setRate1,
    rate2, setRate2,
    rate3, setRate3,
    rate4, setRate4,
    rate5, setRate5,
    rate6, setRate6,
  };
};
