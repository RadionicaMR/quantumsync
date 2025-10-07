import Layout from '@/components/Layout';
import NewHeroSection from '@/components/home/NewHeroSection';
import ProblemSection from '@/components/home/ProblemSection';
import SolutionSection from '@/components/home/SolutionSection';
import NewBenefitsSection from '@/components/home/NewBenefitsSection';
import AppShowcaseSection from '@/components/home/AppShowcaseSection';
import QuantumFoundationSection from '@/components/home/QuantumFoundationSection';
import NewTestimonialsSection from '@/components/home/NewTestimonialsSection';
import FAQSection from '@/components/home/FAQSection';
import PricingSection from '@/components/home/PricingSection';
import FinalClosingSection from '@/components/home/FinalClosingSection';
import CTAButton from '@/components/home/CTAButton';

const Index = () => {
  return (
    <Layout>
      {/* 1. Hero Section */}
      <NewHeroSection />

      {/* 2. Problem/Pain Section */}
      <ProblemSection />

      {/* CTA Button 1 */}
      <CTAButton />

      {/* 3. Solution Section */}
      <SolutionSection />

      {/* 4. Benefits Section */}
      <NewBenefitsSection />

      {/* CTA Button 2 */}
      <CTAButton />

      {/* 5. App Showcase Section */}
      <AppShowcaseSection />

      {/* 6. Quantum Foundation Section */}
      <QuantumFoundationSection />

      {/* CTA Button 3 */}
      <CTAButton />

      {/* 7. Testimonials Section */}
      <NewTestimonialsSection />

      {/* 8. FAQ Section */}
      <FAQSection />

      {/* 9. Pricing/CTA Section */}
      <PricingSection />

      {/* 10. Final Closing Section */}
      <FinalClosingSection />
    </Layout>
  );
};

export default Index;
