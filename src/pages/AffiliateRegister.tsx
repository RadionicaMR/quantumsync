
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import AffiliateRegistrationForm from '@/components/affiliate/AffiliateRegistrationForm';
import AffiliateSuccessMessage from '@/components/affiliate/AffiliateSuccessMessage';
import { useAffiliateRegistration } from '@/hooks/useAffiliateRegistration';

const AffiliateRegister = () => {
  const { handleSubmit, error, loading, registered } = useAffiliateRegistration();

  if (registered) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[80vh]">
          <AffiliateSuccessMessage />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <Card className="p-8 shadow-xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Únete como Afiliado</h1>
              <p className="text-muted-foreground">
                Gana comisiones promoviendo QuantumSync y ayudando a otros a transformar sus vidas
              </p>
            </div>
            
            <AffiliateRegistrationForm 
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
            />
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AffiliateRegister;
