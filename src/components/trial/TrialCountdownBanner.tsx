import { useTrialStatus } from '@/hooks/useTrialStatus';
import { Clock, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const TrialCountdownBanner = () => {
  const { isTrialActive, daysRemaining, hoursRemaining, minutesRemaining, hasPaid, isLoading } = useTrialStatus();
  const navigate = useNavigate();

  if (isLoading || hasPaid || !isTrialActive) return null;

  return (
    <div className="bg-gradient-to-r from-purple-900/90 via-blue-900/90 to-purple-900/90 border-b border-purple-500/30 px-4 py-2">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-white text-sm">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-purple-300 animate-pulse" />
          <span className="font-medium">
            Prueba gratuita: 
          </span>
          <span className="font-bold text-purple-200">
            {daysRemaining}d {hoursRemaining}h {minutesRemaining}m restantes
          </span>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="border-purple-400/50 text-purple-200 hover:bg-purple-800/50 h-7 text-xs"
          onClick={() => navigate('/purchase')}
        >
          <Sparkles className="h-3 w-3 mr-1" />
          Obtener acceso completo
        </Button>
      </div>
    </div>
  );
};

export default TrialCountdownBanner;
