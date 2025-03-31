
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Square } from 'lucide-react';

interface RateInputsProps {
  rate1: string;
  setRate1: (value: string) => void;
  rate2: string;
  setRate2: (value: string) => void;
  rate3: string;
  setRate3: (value: string) => void;
  isPlaying: boolean;
}

const RateInputs = ({
  rate1,
  setRate1,
  rate2,
  setRate2,
  rate3,
  setRate3,
  isPlaying,
}: RateInputsProps) => {
  const [isGenerating1, setIsGenerating1] = useState(false);
  const [isGenerating2, setIsGenerating2] = useState(false);
  const [isGenerating3, setIsGenerating3] = useState(false);
  
  // Function to generate a random 9-digit number
  const generateRandomNumber = () => {
    return Math.floor(100000000 + Math.random() * 900000000).toString();
  };
  
  // Set up interval effects for each button
  const handleMouseDown = (setIsGenerating: (val: boolean) => void, setRate: (val: string) => void) => {
    if (isPlaying) return;
    
    setIsGenerating(true);
    const intervalId = setInterval(() => {
      setRate(generateRandomNumber());
    }, 50); // Update every 50ms for a fast visual effect
    
    // Cleanup function that runs when mouse is released
    const handleMouseUp = () => {
      clearInterval(intervalId);
      setIsGenerating(false);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col">
        <Label htmlFor="rate1" className="mb-1">RATE 1</Label>
        <div className="flex gap-2">
          <Input
            id="rate1"
            type="text"
            maxLength={30}
            placeholder="Ingrese RATE 1"
            value={rate1}
            onChange={(e) => setRate1(e.target.value)}
            disabled={isPlaying}
            className={isPlaying ? "animate-[pulse_1s_ease-in-out_infinite] bg-quantum-primary/10 flex-1" : "flex-1"}
          />
          <Button
            variant="outline"
            size="icon"
            disabled={isPlaying}
            onMouseDown={() => handleMouseDown(setIsGenerating1, setRate1)}
            className={`min-w-10 h-10 ${isGenerating1 ? 'bg-quantum-primary/20' : ''}`}
            aria-label="Generar RATE 1 aleatorio"
          >
            <Square className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col">
        <Label htmlFor="rate2" className="mb-1">RATE 2</Label>
        <div className="flex gap-2">
          <Input
            id="rate2"
            type="text"
            maxLength={30}
            placeholder="Ingrese RATE 2"
            value={rate2}
            onChange={(e) => setRate2(e.target.value)}
            disabled={isPlaying}
            className={isPlaying ? "animate-[pulse_1.2s_ease-in-out_infinite] bg-quantum-primary/10 flex-1" : "flex-1"}
          />
          <Button
            variant="outline"
            size="icon"
            disabled={isPlaying}
            onMouseDown={() => handleMouseDown(setIsGenerating2, setRate2)}
            className={`min-w-10 h-10 ${isGenerating2 ? 'bg-quantum-primary/20' : ''}`}
            aria-label="Generar RATE 2 aleatorio"
          >
            <Square className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col">
        <Label htmlFor="rate3" className="mb-1">RATE 3</Label>
        <div className="flex gap-2">
          <Input
            id="rate3"
            type="text"
            maxLength={30}
            placeholder="Ingrese RATE 3"
            value={rate3}
            onChange={(e) => setRate3(e.target.value)}
            disabled={isPlaying}
            className={isPlaying ? "animate-[pulse_1.4s_ease-in-out_infinite] bg-quantum-primary/10 flex-1" : "flex-1"}
          />
          <Button
            variant="outline"
            size="icon"
            disabled={isPlaying}
            onMouseDown={() => handleMouseDown(setIsGenerating3, setRate3)}
            className={`min-w-10 h-10 ${isGenerating3 ? 'bg-quantum-primary/20' : ''}`}
            aria-label="Generar RATE 3 aleatorio"
          >
            <Square className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RateInputs;
