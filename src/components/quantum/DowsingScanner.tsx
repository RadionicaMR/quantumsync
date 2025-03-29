
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Bell } from 'lucide-react';
import QuantumButton from '@/components/QuantumButton';
import DowsingRing from './DowsingRing';
import { toast } from "@/components/ui/use-toast";

const DowsingScanner = () => {
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [email, setEmail] = useState('');
  const [showNotificationForm, setShowNotificationForm] = useState(false);
  
  const handleSubscribe = () => {
    if (showNotificationForm) {
      if (!email) {
        toast({
          title: "Email requerido",
          description: "Por favor ingresa tu email para recibir notificaciones.",
          variant: "destructive"
        });
        return;
      }
      
      setIsSubscribing(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsSubscribing(false);
        toast({
          title: "¡Suscripción exitosa!",
          description: "Te notificaremos cuando el Escáner Energético esté disponible.",
        });
        setEmail('');
        setShowNotificationForm(false);
      }, 1500);
    } else {
      setShowNotificationForm(true);
    }
  };
  
  return (
    <Card className="quantum-card p-6">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl font-semibold mb-4">Escáner Completo de Campo Energético</h3>
        <p className="text-muted-foreground mb-8">
          El escáner energético avanzado utiliza principios radiónicos para proporcionar una evaluación integral de todo tu campo energético.
        </p>
        
        <motion.div 
          className="relative w-64 h-64 mx-auto mb-8"
          whileHover={{ scale: 1.05 }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <DowsingRing inset={0} opacity="20" />
          <DowsingRing inset={16} opacity="30" reverse duration="6s" />
          <DowsingRing inset={32} opacity="40" />
          <DowsingRing inset={48} opacity="50" reverse duration="4s" />
          
          <motion.div 
            className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-full backdrop-blur-sm"
            animate={{ 
              scale: isHovering ? 1.1 : 1,
              backgroundColor: isHovering ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.6)'
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-quantum-primary font-bold text-lg">Próximamente</div>
          </motion.div>
        </motion.div>
        
        <p className="text-muted-foreground mb-4">
          Nuestro escáner avanzado está actualmente en desarrollo y estará disponible en la próxima actualización.
        </p>
        
        {showNotificationForm ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4"
          >
            <input
              type="email"
              placeholder="Tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full max-w-xs p-2 border rounded-md mb-4"
            />
          </motion.div>
        ) : null}
        
        <QuantumButton 
          onClick={handleSubscribe} 
          disabled={isSubscribing}
        >
          {isSubscribing ? (
            <span className="flex items-center gap-2">
              <motion.div
                className="w-4 h-4 border-2 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              Procesando...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Bell size={16} />
              {showNotificationForm ? "Suscribirme" : "Recibir Notificación cuando esté Disponible"}
            </span>
          )}
        </QuantumButton>
      </motion.div>
    </Card>
  );
};

export default DowsingScanner;
