
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import QuantumButton from '@/components/QuantumButton';
import FeaturesSection from '@/components/home/FeaturesSection';
import BenefitsSection from '@/components/home/BenefitsSection';
import FounderSection from '@/components/home/FounderSection';
import AffiliateSection from '@/components/home/AffiliateSection';
import CTASection from '@/components/home/CTASection';
import MissionIntroSection from '@/components/home/MissionIntroSection';
import CompanyDescriptionSection from '@/components/home/CompanyDescriptionSection';
import MissionVisionSection from '@/components/home/MissionVisionSection';
import CoreValuesSection from '@/components/home/CoreValuesSection';
import AboutSection from '@/components/home/AboutSection';
import TestimonialsWrapper from '@/components/home/TestimonialsWrapper';
import { SunIcon, WaveIcon, TargetIcon, ListIcon } from '@/components/home/HomeFeatureIcons';
import { testimonials, benefitItems, values, features as featuresData } from '@/data/homePageData';

const Index = () => {
  const navigate = useNavigate();
  
  // Map the icon strings to actual components
  const features = featuresData.map(feature => {
    let iconComponent;
    switch (feature.icon) {
      case 'SunIcon':
        iconComponent = <SunIcon />;
        break;
      case 'WaveIcon':
        iconComponent = <WaveIcon />;
        break;
      case 'TargetIcon':
        iconComponent = <TargetIcon />;
        break;
      case 'ListIcon':
        iconComponent = <ListIcon />;
        break;
      default:
        iconComponent = null;
    }
    
    return {
      ...feature,
      icon: iconComponent
    };
  });

  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection
        title="Transforma Tu Vida a Través de la Tecnología de Frecuencia Cuántica"
        subtitle="QuantumSync combina ciencia, tecnología y bienestar para ayudarte a equilibrar tu energía y alcanzar tus objetivos."
      >
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <QuantumButton size="lg" onClick={() => navigate('/purchase')}>Adquiere QuantumSync</QuantumButton>
          <QuantumButton variant="outline" size="lg" onClick={() => {
            const aboutSection = document.querySelector('#about-section');
            if (aboutSection) {
              aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}>Saber Más</QuantumButton>
        </div>
      </HeroSection>

      {/* Features Section */}
      <FeaturesSection features={features} />

      {/* Mission Intro */}
      <MissionIntroSection />

      {/* Company Description */}
      <CompanyDescriptionSection />

      {/* Mission & Vision */}
      <MissionVisionSection />

      {/* Core Values */}
      <CoreValuesSection values={values} />

      {/* Founder Section */}
      <FounderSection />

      {/* Benefits Section */}
      <BenefitsSection benefitItems={benefitItems} />

      {/* About Section */}
      <AboutSection />

      {/* Testimonials */}
      <TestimonialsWrapper testimonials={testimonials} />

      {/* CTA Section */}
      <CTASection />
    </Layout>
  );
};

export default Index;
