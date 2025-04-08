
import { useState } from 'react';
import Layout from '@/components/Layout';
import { useIsMobileOnly } from '@/hooks/use-mobile';
import DiagnosisHeader from '@/components/quantum/DiagnosisHeader';
import DiagnosisTabs from '@/components/quantum/DiagnosisTabs';
import DiagnosisFooter from '@/components/quantum/DiagnosisFooter';

const Diagnose = () => {
  const isMobile = useIsMobileOnly();

  return (
    <Layout>
      <DiagnosisHeader />

      <section className="py-4 md:py-6 px-4 bg-gradient-to-b from-quantum-dark/70 to-background">
        <DiagnosisTabs isMobile={isMobile} />
      </section>

      <DiagnosisFooter />
    </Layout>
  );
};

export default Diagnose;
