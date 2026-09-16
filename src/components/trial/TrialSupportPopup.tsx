import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useTrialStatus } from '@/hooks/useTrialStatus';
import { useAuth } from '@/context/AuthContext';

const WHATSAPP_NUMBER = '542945581188';
const WHATSAPP_MESSAGE = encodeURIComponent(
  'Hola, estoy en mi período de prueba de QuantumSync y quisiera hacerte una consulta.'
);

const TrialSupportPopup = () => {
  const { isTrialActive, daysRemaining, hasPaid, isLoading } = useTrialStatus();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user?.isAdmin) return;
    if (isLoading || hasPaid || !isTrialActive) return;
    // Trial de 3 días: aviso el último día (1 día restante)
    if (daysRemaining !== 1) return;

    const storageKey = `trialSupportPopupShown_day${daysRemaining}`;
    if (localStorage.getItem(storageKey)) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
      localStorage.setItem(storageKey, 'true');
    }, 5000);

    return () => clearTimeout(timer);
  }, [isLoading, hasPaid, isTrialActive, daysRemaining]);

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-[#0f0520] border-purple-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-green-300 via-emerald-300 to-green-200 bg-clip-text text-transparent">
            ¿Tienes dudas sobre QuantumSync?
          </DialogTitle>
          <DialogDescription className="text-center text-purple-200/80 pt-2">
            Tu período de prueba está por finalizar. Si tienes dudas o quieres realizar alguna consulta, puedes escribirme directamente por WhatsApp y con gusto te ayudaré.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 pt-2">
          <Button
            onClick={handleWhatsApp}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white text-lg py-6 h-auto rounded-full shadow-[0_0_30px_rgba(34,197,94,0.4)] font-semibold"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Escribirme por WhatsApp
          </Button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            Ahora no
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrialSupportPopup;
