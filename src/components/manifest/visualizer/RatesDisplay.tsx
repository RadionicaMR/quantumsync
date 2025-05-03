
import React from 'react';

interface RatesDisplayProps {
  rate1?: string;
  rate2?: string;
  rate3?: string;
  rateAnimationDuration: number;
}

const RatesDisplay: React.FC<RatesDisplayProps> = ({
  rate1 = "",
  rate2 = "",
  rate3 = "",
  rateAnimationDuration
}) => {
  if (!rate1 && !rate2 && !rate3) {
    return null;
  }
  
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
      <div className="relative w-full h-full max-w-[90%] max-h-[90%]">
        {rate1 && (
          <div className="absolute text-blue-400 font-mono bg-black/60 px-3 py-2 rounded text-sm md:text-base shadow-lg border border-blue-500/30" 
              style={{ 
                left: '20%', 
                top: '20%',
                maxWidth: '80%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                animation: `random-move ${rateAnimationDuration}s infinite alternate`,
                textShadow: '0 0 5px rgba(59, 130, 246, 0.7)'
              }}>
            {rate1}
          </div>
        )}
        {rate2 && (
          <div className="absolute text-blue-400 font-mono bg-black/60 px-3 py-2 rounded text-sm md:text-base shadow-lg border border-blue-500/30"
              style={{ 
                left: '50%', 
                top: '40%',
                maxWidth: '80%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                animation: `random-move ${rateAnimationDuration + 3}s infinite alternate-reverse`,
                textShadow: '0 0 5px rgba(59, 130, 246, 0.7)'
              }}>
            {rate2}
          </div>
        )}
        {rate3 && (
          <div className="absolute text-blue-400 font-mono bg-black/60 px-3 py-2 rounded text-sm md:text-base shadow-lg border border-blue-500/30"
              style={{ 
                left: '30%', 
                top: '60%',
                maxWidth: '80%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                animation: `random-move ${rateAnimationDuration + 5}s infinite`,
                textShadow: '0 0 5px rgba(59, 130, 246, 0.7)'
              }}>
            {rate3}
          </div>
        )}
      </div>
    </div>
  );
};

export default RatesDisplay;
