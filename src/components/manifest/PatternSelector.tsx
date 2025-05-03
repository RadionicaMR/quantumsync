
import React from 'react';
import { Card } from '@/components/ui/card';

interface Pattern {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface PatternSelectorProps {
  patterns: Pattern[];
  selectedPattern: string;
  isManifestActive: boolean;
  onSelectPattern: (patternId: string) => void;
}

const PatternSelector = ({ 
  patterns, 
  selectedPattern, 
  isManifestActive,
  onSelectPattern 
}: PatternSelectorProps) => {
  // Función de debugging para seguimiento de selección de patrones
  const handleSelectPattern = (patternId: string) => {
    console.log("PatternSelector: Seleccionando patrón", patternId);
    onSelectPattern(patternId);
  };
  
  return (
    <Card className="quantum-card p-6 lg:col-span-1">
      <h3 className="text-xl font-semibold mb-4">Selecciona un Patrón Radiónico</h3>
      <div className="space-y-2">
        {patterns.map((pattern) => (
          <button
            key={pattern.id}
            className={`w-full p-3 rounded-xl text-left transition-all ${
              selectedPattern === pattern.id 
                ? 'bg-quantum-primary text-white' 
                : 'bg-muted hover:bg-muted/80'
            }`}
            onClick={() => handleSelectPattern(pattern.id)}
            disabled={isManifestActive}
          >
            <div className="font-medium">{pattern.name}</div>
            <div className={`text-sm ${selectedPattern === pattern.id ? 'text-white/80' : 'text-muted-foreground'}`}>
              {pattern.description}
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
};

export default PatternSelector;
