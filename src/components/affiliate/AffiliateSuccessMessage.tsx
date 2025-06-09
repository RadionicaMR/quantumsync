
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const AffiliateSuccessMessage = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <Card className="p-6 shadow-xl text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">¡Solicitud Enviada!</h2>
        <p className="text-muted-foreground mb-6">
          Tu solicitud para ser afiliado ha sido enviada correctamente. Te contactaremos pronto para revisar tu aplicación.
        </p>
        <Button 
          className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
          onClick={() => navigate('/')}
        >
          Volver al Inicio
        </Button>
      </Card>
    </motion.div>
  );
};

export default AffiliateSuccessMessage;
