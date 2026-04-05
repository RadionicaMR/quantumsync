import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Clock, CreditCard, ArrowRight } from 'lucide-react';

const TrialExpired = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-lg w-full"
        >
          <Card className="p-8 bg-gradient-to-br from-card/90 to-card/70 border-purple-500/20">
            <div className="text-center space-y-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Clock className="h-8 w-8 text-purple-400" />
              </div>
              
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                Tu período de prueba ha finalizado
              </h1>
              
              <p className="text-muted-foreground">
                Los 7 días de prueba gratuita han terminado. Para continuar usando QuantumSync y acceder a todas las funciones, incluyendo la Manifestación Cuántica, adquiere tu membresía.
              </p>

              <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                <p className="text-sm text-purple-200">
                  ✨ Al adquirir tu membresía obtendrás acceso ilimitado a todas las funciones, incluyendo la poderosa herramienta de <strong>Manifestación Cuántica</strong>.
                </p>
              </div>

              <Button
                size="lg"
                onClick={() => navigate('/purchase')}
                className="w-full bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 hover:from-purple-700 hover:via-purple-600 hover:to-blue-600 text-white text-lg py-6 h-auto rounded-full shadow-[0_0_30px_rgba(168,85,247,0.4)] font-semibold"
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Adquirir Membresía
              </Button>

              <p className="text-xs text-muted-foreground">
                ¿Ya realizaste el pago? <button onClick={() => navigate('/access')} className="text-purple-400 hover:text-purple-300 underline">Accede aquí</button>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default TrialExpired;
