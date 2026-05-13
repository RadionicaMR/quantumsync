
import { useState } from 'react';

export const useTreatmentRates = () => {
  const [rate1, setRate1] = useState('');
  const [rate2, setRate2] = useState('');
  const [rate3, setRate3] = useState('');
  const [rate4, setRate4] = useState('');
  const [rate5, setRate5] = useState('');
  const [rate6, setRate6] = useState('');
  const [rate7, setRate7] = useState('');
  const [rate8, setRate8] = useState('');
  const [rate9, setRate9] = useState('');
  
  return {
    rate1, setRate1,
    rate2, setRate2,
    rate3, setRate3,
    rate4, setRate4,
    rate5, setRate5,
    rate6, setRate6,
    rate7, setRate7,
    rate8, setRate8,
    rate9, setRate9,
  };
};
