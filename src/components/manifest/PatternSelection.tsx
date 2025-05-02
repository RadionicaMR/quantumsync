
import React from 'react';
import { Card } from '@/components/ui/card';
import { ManifestPattern } from '@/data/manifestPatterns';

interface PatternSelectionProps {
  patterns: ManifestPattern[];
  selectedPattern: string;
  selectPattern: (pattern: ManifestPattern) => void;
}

const PatternSelection: React.FC<PatternSelectionProps> = ({
  patterns,
  selectedPattern,
  selectPattern
}) => {
  return (
    <div className="mb-6">
      <h4 className="mb-2 font-medium">Selecciona un patrón</h4>
      <div className="space-y-2">
        {patterns.map((pattern) => (
          <button
            key={pattern.id}
            className={`w-full p-3 rounded-xl text-left transition-all ${
              selectedPattern === pattern.id 
                ? 'bg-quantum-primary text-white' 
                : 'bg-muted hover:bg-muted/80'
            }`}
            onClick={() => selectPattern(pattern)}
          >
            <div className="font-medium">{pattern.name}</div>
            <div className={`text-sm ${selectedPattern === pattern.id ? 'text-white/80' : 'text-muted-foreground'}`}>
              {pattern.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PatternSelection;
