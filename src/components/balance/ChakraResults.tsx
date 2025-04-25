
import { CHAKRA_COLORS } from '@/constants/chakraData';
import type { ChakraName } from '@/constants/chakraData';

interface ChakraResult {
  name: string;
  state: string | null;
}

interface ChakraResultsProps {
  chakraStates: ChakraResult[];
}

const ChakraResults = ({ chakraStates }: ChakraResultsProps) => {
  return (
    <div className="mb-6 p-4 bg-background/50 rounded-lg">
      <h3 className="font-medium mb-2">Resultados del diagnóstico:</h3>
      <ul className="text-sm space-y-1">
        {chakraStates.map((chakra) => (
          <li key={chakra.name} className="flex items-center">
            <span 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: CHAKRA_COLORS[chakra.name as ChakraName] }}
            />
            <span>{chakra.name}: </span>
            <span className={`ml-1 font-medium ${
              chakra.state === 'EQUILIBRADO' ? 'text-green-600' : 
              chakra.state === 'CERRADO' ? 'text-amber-600' : 'text-red-600'
            }`}>
              {chakra.state}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChakraResults;
