
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import QuantumButton from '@/components/QuantumButton';
import FeaturesSection from '@/components/home/FeaturesSection';
import AboutSection from '@/components/home/AboutSection';
import BenefitsSection from '@/components/home/BenefitsSection';
import FounderSection from '@/components/home/FounderSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import AffiliateSection from '@/components/home/AffiliateSection';
import CTASection from '@/components/home/CTASection';
import { SunIcon, WaveIcon, TargetIcon, ListIcon } from '@/components/home/HomeFeatureIcons';

const Index = () => {
  const navigate = useNavigate();

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Instructora de Yoga",
      content: "QuantumSync ha transformado mi enfoque de la sanación energética. Mis clientes notan la diferencia inmediatamente después de incorporar estas frecuencias.",
      image: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    {
      name: "Michael Chen",
      role: "Terapeuta Holístico",
      content: "Como alguien que ha estado practicando trabajo energético durante años, QuantumSync ha añadido una nueva dimensión a mi práctica. Es intuitivo y sorprendentemente poderoso.",
      image: "https://randomuser.me/api/portraits/men/46.jpg"
    },
    {
      name: "Elena Rodríguez",
      role: "Coach de Bienestar",
      content: "Al principio era escéptica, pero después de solo dos semanas usando QuantumSync, he experimentado meditaciones más profundas y mejor sueño. ¡A mis clientes también les encanta!",
      image: "https://randomuser.me/api/portraits/women/68.jpg"
    }
  ];

  const features = [
    {
      icon: <SunIcon />,
      title: "Diagnóstico Energético",
      description: "Identifica desequilibrios energéticos usando nuestro péndulo virtual e interfaz intuitiva."
    },
    {
      icon: <WaveIcon />,
      title: "Tratamiento Vibracional",
      description: "Aplica patrones de frecuencia precisos para equilibrar y armonizar tu campo energético."
    },
    {
      icon: <TargetIcon />,
      title: "Manifestación de Objetivos",
      description: "Establece intenciones claras con nuestras herramientas radiónicas para atraer lo que realmente deseas."
    },
    {
      icon: <ListIcon />,
      title: "Programas Personalizados",
      description: "Crea protocolos personalizados para el sueño, estrés, concentración y más, adaptados a tus necesidades únicas."
    }
  ];

  const benefitItems = [
    {
      title: "Duerme Mejor",
      description: "Las frecuencias Delta te ayudan a lograr un sueño más profundo y reparador."
    },
    {
      title: "Reduce el Estrés",
      description: "Las ondas Theta inducen calma y serenidad, disolviendo la ansiedad."
    },
    {
      title: "Mejora la Concentración",
      description: "Las frecuencias Beta mejoran la concentración y la claridad mental."
    },
    {
      title: "Equilibra las Emociones",
      description: "Las vibraciones dirigidas ayudan a estabilizar las respuestas emocionales."
    },
    {
      title: "Aumenta la Energía",
      description: "Revitaliza tu cuerpo y mente con patrones energéticos específicos."
    },
    {
      title: "Limpia Espacios",
      description: "Elimina la energía negativa de tu hogar o espacio de trabajo."
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection
        title="Transforma Tu Vida a Través de la Tecnología de Frecuencia Cuántica"
        subtitle="QuantumSync combina ciencia, tecnología y bienestar para ayudarte a equilibrar tu energía y alcanzar tus objetivos."
      >
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <QuantumButton size="lg" onClick={() => navigate('/diagnose')}>Comenzar</QuantumButton>
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

      {/* About Section */}
      <AboutSection />

      {/* Benefits Section */}
      <BenefitsSection benefitItems={benefitItems} />

      {/* Founder Section */}
      <FounderSection />

      {/* Testimonials */}
      <TestimonialsSection testimonials={testimonials} />

      {/* Affiliate Program Section */}
      <AffiliateSection />

      {/* CTA Section */}
      <CTASection />
    </Layout>
  );
};

export default Index;
