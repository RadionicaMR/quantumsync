import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Clock, Shield, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FreeTrialPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if popup was already shown in this session
    const alreadyShown = sessionStorage.getItem('trialPopupShown');
    if (alreadyShown) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
      sessionStorage.setItem('trialPopupShown', 'true');
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  const handleRegister = () => {
    setIsOpen(false);
    navigate('/register2974AHXW12');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-[#0f0520] border-purple-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-purple-300 via-blue-300 to-purple-200 bg-clip-text text-transparent">
            🎉 ¡Prueba GRATIS durante 7 días!
          </DialogTitle>
          <DialogDescription className="text-center text-purple-200/80">
            Accede a todas las funciones de QuantumSync sin compromiso
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3 text-purple-200">
            <Shield className="h-5 w-5 text-green-400 shrink-0" />
            <span>Sin tarjeta de crédito requerida</span>
          </div>
          <div className="flex items-center gap-3 text-purple-200">
            <Clock className="h-5 w-5 text-blue-400 shrink-0" />
            <span>7 días de acceso completo</span>
          </div>
          <div className="flex items-center gap-3 text-purple-200">
            <Zap className="h-5 w-5 text-yellow-400 shrink-0" />
            <span>Diagnóstico, Tratamiento, Chakras y más</span>
          </div>
          <div className="flex items-center gap-3 text-purple-200">
            <Sparkles className="h-5 w-5 text-purple-400 shrink-0" />
            <span>Cancela cuando quieras</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={handleRegister}
            className="w-full bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 hover:from-purple-700 hover:via-purple-600 hover:to-blue-600 text-white text-lg py-6 h-auto rounded-full shadow-[0_0_30px_rgba(168,85,247,0.4)] font-semibold"
          >
            ¡PROBAR GRATIS 7 DÍAS!
          </Button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            No, gracias
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FreeTrialPopup;
