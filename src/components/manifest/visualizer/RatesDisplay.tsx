
import React from 'react';

interface RatesDisplayProps {
  rate1?: string;
  rate2?: string;
  rate3?: string;
  rate4?: string;
  rate5?: string;
  rate6?: string;
  rateAnimationDuration: number;
}

const RatesDisplay: React.FC<RatesDisplayProps> = ({
  rate1 = "",
  rate2 = "",
  rate3 = "",
  rate4 = "",
  rate5 = "",
  rate6 = "",
  rateAnimationDuration
}) => {
  const allRates = [
    { val: rate1, left: '10%', top: '15%', durOffset: 0 },
    { val: rate2, left: '55%', top: '15%', durOffset: 2 },
    { val: rate3, left: '10%', top: '40%', durOffset: 4 },
    { val: rate4, left: '55%', top: '40%', durOffset: 1 },
    { val: rate5, left: '10%', top: '65%', durOffset: 3 },
    { val: rate6, left: '55%', top: '65%', durOffset: 5 },
  ];

  const hasAny = allRates.some(r => !!r.val);
  if (!hasAny) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
      <div className="relative w-full h-full max-w-[90%] max-h-[90%]">
        {allRates.map((r, i) => r.val ? (
          <div key={i} className="absolute text-blue-400 font-mono bg-black/60 px-2 py-1 rounded text-xs md:text-sm shadow-lg border border-blue-500/30" 
              style={{ 
                left: r.left, 
                top: r.top,
                maxWidth: '45%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                animation: `random-move ${rateAnimationDuration + r.durOffset}s infinite ${i % 2 === 0 ? 'alternate' : 'alternate-reverse'}`,
                textShadow: '0 0 5px rgba(59, 130, 246, 0.7)'
              }}>
            {r.val}
          </div>
        ) : null)}
      </div>
    </div>
  );
};

export default RatesDisplay;
