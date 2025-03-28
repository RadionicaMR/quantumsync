import React from 'react';
import Layout from '@/components/Layout';
import QuantumButton from '@/components/QuantumButton';

const Affiliate = () => {
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6">Affiliate Program</h1>
        
        {/* Add affiliate content here */}
        <p className="mb-6">Join our affiliate program and earn commissions by referring new users to QuantumSync.</p>
        
        <QuantumButton className="bg-quantum-primary text-white px-6 py-3 rounded-full" disabled={false}>
          Apply Now
        </QuantumButton>
      </div>
    </Layout>
  );
};

export default Affiliate;
