import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import FeatureCard from '@/components/FeatureCard';
import QuantumButton from '@/components/QuantumButton';
import { Card } from '@/components/ui/card';

const Index = () => {
  const [activeTab, setActiveTab] = useState(0);
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
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4.93 4.93L6.34 6.34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17.66 17.66L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6.34 17.66L4.93 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19.07 4.93L17.66 6.34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Diagnóstico Energético",
      description: "Identifica desequilibrios energéticos usando nuestro péndulo virtual e interfaz intuitiva."
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 12H7L10 20L14 4L17 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Tratamiento Vibracional",
      description: "Aplica patrones de frecuencia precisos para equilibrar y armonizar tu campo energético."
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Manifestación de Objetivos",
      description: "Establece intenciones claras con nuestras herramientas radiónicas para atraer lo que realmente deseas."
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 6H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 12H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 18H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

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
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Potentes Herramientas a Tu Alcance</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              QuantumSync ofrece tecnología radiónica avanzada que antes solo estaba disponible para especialistas, ahora accesible a través de tu dispositivo móvil.
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={item}>
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about-section" className="py-16 px-4 bg-quantum-gradient-soft">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Acerca de QuantumSync</h2>
              <div className="quantum-divider w-24 my-4"></div>
              <p className="text-muted-foreground mb-6">
                QuantumSync es más que una empresa de tecnología; somos un equipo comprometido con hacer que el bienestar sea accesible para todos. Combinamos innovación de vanguardia con principios espirituales para crear soluciones que impacten positivamente en la vida de las personas.
              </p>
              <p className="text-muted-foreground mb-6">
                Nuestra esencia radica en integrar tecnología avanzada con conocimientos tradicionales y modernos sobre energía y vibraciones. Sabemos que la energía es la base de todo en el universo, y QuantumSync te da la oportunidad de conectarte con ella de manera práctica y efectiva.
              </p>
              <QuantumButton onClick={() => navigate('/about')}>Conoce Nuestra Misión</QuantumButton>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-quantum-primary/10 rounded-full animate-pulse-soft"></div>
              <div className="relative z-10 bg-white dark:bg-card p-4 rounded-xl shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                  alt="Personas usando QuantumSync" 
                  className="rounded-lg w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Experimenta Beneficios Reales</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              QuantumSync ofrece mejoras tangibles en múltiples áreas de tu vida.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefitItems.map((benefit, index) => (
              <Card key={index} className="quantum-card p-6">
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-16 px-4 bg-quantum-gradient-soft">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-quantum-primary/10 rounded-full animate-pulse-soft"></div>
              <div className="relative z-10 bg-white dark:bg-card p-4 rounded-xl shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                  alt="Mauricio Ramos - Fundador" 
                  className="rounded-lg w-full h-auto"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold mb-4">Conoce a Nuestro Fundador</h2>
              <div className="quantum-divider w-24 my-4"></div>
              <p className="text-muted-foreground mb-6">
                Detrás de cada gran idea hay una mente creativa y visionaria. En QuantumSync, esa mente pertenece a Mauricio Ramos, un estudioso de las terapias energéticas, sobre todo de la radiónica, y experto en comunicación interpersonal y tecnologías de bienestar.
              </p>
              <p className="text-muted-foreground mb-6">
                Mauricio ha dedicado su carrera a entender cómo la energía y la intención pueden transformar vidas. Durante muchos años, estudió y fabricó equipos radiónicos clásicos, introduciendo modificaciones y mejoras en cada diseño que creó y construyó.
              </p>
              <p className="text-muted-foreground mb-6">
                La idea de QuantumSync nació de su deseo de unir ciencia, tecnología y espiritualidad en una solución práctica y accesible. Mauricio vio la oportunidad de aprovechar la radiónica y las frecuencias vibracionales para crear una herramienta que cualquiera pudiera usar, independientemente de su nivel de experiencia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Lo Que Dicen Nuestros Usuarios</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Descubre cómo QuantumSync está transformando vidas en todo el mundo.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${activeTab === index ? 'bg-quantum-primary w-6' : 'bg-quantum-primary/30'}`}
                onClick={() => setActiveTab(index)}
              />
            ))}
          </div>
          
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeTab * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="w-full flex-shrink-0 px-4"
                >
                  <Card className="quantum-card p-8 max-w-2xl mx-auto">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-quantum-primary">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{testimonial.name}</h3>
                        <p className="text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-lg italic text-muted-foreground">"{testimonial.content}"</p>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Affiliate Program Section */}
      <section className="py-16 px-4 bg-quantum-gradient-soft">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Únete a Nuestro Programa de Afiliados</h2>
              <div className="quantum-divider w-24 my-4"></div>
              <p className="text-muted-foreground mb-6">
                QuantumSync no es solo una herramienta para transformar tu vida, sino también una oportunidad para generar ingresos. Nuestro plan de compensación está diseñado para recompensar tus esfuerzos en la promoción de la aplicación, creando un modelo justo y escalable.
              </p>
              <QuantumButton onClick={() => navigate('/affiliate')}>Conviértete en Afiliado (MUY PRONTO)</QuantumButton>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-quantum-primary/10 rounded-full animate-pulse-soft"></div>
              <div className="relative z-10 bg-white dark:bg-card p-4 rounded-xl shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1513682121497-80211f36a7d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                  alt="Persona feliz ganando dinero" 
                  className="rounded-lg w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-quantum-gradient text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para Transformar Tu Vida?</h2>
          <p className="max-w-2xl mx-auto mb-8 text-white/80">
            Descarga QuantumSync hoy y comienza tu viaje hacia un mejor bienestar, energía equilibrada y nuevas posibilidades.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="bg-white text-quantum-primary font-medium px-6 py-3 rounded-full shadow-lg hover:bg-white/90 transition-colors"
              onClick={() => navigate('/diagnose')}
            >
              Comienza Ahora
            </button>
            <button 
              className="border-2 border-white text-white font-medium px-6 py-3 rounded-full hover:bg-white/10 transition-colors"
              onClick={() => navigate('/about')}
            >
              Saber Más
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
