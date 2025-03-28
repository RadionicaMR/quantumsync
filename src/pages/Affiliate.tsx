
import React from 'react';
import Layout from '@/components/Layout';
import QuantumButton from '@/components/QuantumButton';

const Affiliate = () => {
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6">Programa de Afiliados</h1>
        
        {/* Add affiliate content here */}
        <p className="mb-6">Únete a nuestro programa de afiliados y gana comisiones refiriendo nuevos usuarios a QuantumSync.</p>
        
        <QuantumButton className="bg-quantum-primary text-white px-6 py-3 rounded-full" disabled={false}>
          Aplicar Ahora
        </QuantumButton>
      </div>
    </Layout>
  );
};

export default Affiliate;
