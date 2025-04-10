
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import QuantumButton from '@/components/QuantumButton';
import FeaturesSection from '@/components/home/FeaturesSection';
import BenefitsSection from '@/components/home/BenefitsSection';
import FounderSection from '@/components/home/FounderSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import AffiliateSection from '@/components/home/AffiliateSection';
import CTASection from '@/components/home/CTASection';
import { SunIcon, WaveIcon, TargetIcon, ListIcon } from '@/components/home/HomeFeatureIcons';
import { Card } from '@/components/ui/card';

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

  const values = [
    {
      title: "Innovación",
      description: "Constantemente empujamos los límites para crear soluciones de vanguardia que unen ciencia y espiritualidad."
    },
    {
      title: "Confianza",
      description: "Construimos confianza a través de la transparencia, la fiabilidad y un profundo compromiso con el bienestar de nuestros usuarios."
    },
    {
      title: "Empoderamiento",
      description: "Sostenemos que nuestras creencias personales determinan nuestro mundo exterior, y que trabajando sobre nosotros mismos, cambiamos el mundo que nos rodea."
    },
    {
      title: "Transformación Positiva",
      description: "Todo lo que hacemos tiene como objetivo crear un cambio positivo en la vida de las personas y en el mundo en general."
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

      {/* Misión y Visión */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-8">
            <QuantumButton 
              className="bg-orange-500 hover:bg-orange-600 text-white glow-orange"
              onClick={() => navigate('/purchase')}
            >
              Adquiere QuantumSync
            </QuantumButton>
          </div>
          <h2 className="text-3xl font-bold mb-4">Nuestra Misión y Visión</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            En QuantumSync, estamos dedicados a hacer que el bienestar energético sea accesible para todos a través de tecnología innovadora.
          </p>
        </div>
      </section>

      {/* Company Description */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">La Historia de QuantumSync</h2>
              <div className="quantum-divider w-24 my-4"></div>
              <p className="text-muted-foreground mb-6">
                QuantumSync es más que una empresa tecnológica; somos un equipo comprometido con hacer que el bienestar sea accesible para todos. Combinamos innovación de vanguardia con principios espirituales para crear soluciones que impacten positivamente en la vida de las personas.
              </p>
              <p className="text-muted-foreground mb-6">
                Nuestra esencia radica en integrar tecnología avanzada con conocimientos tradicionales y modernos sobre energía y vibraciones. Sabemos que la energía es la base de todo en el universo, y QuantumSync te da la oportunidad de conectarte con ella de manera práctica y efectiva.
              </p>
              <p className="text-muted-foreground mb-6">
                Con una visión global, buscamos llevar nuestra propuesta de bienestar a millones de personas en todo el mundo. Nuestro compromiso es ofrecer herramientas tecnológicas fáciles de usar, respaldadas científicamente y, sobre todo, útiles para cualquier persona, independientemente de su nivel de conocimiento previo.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-quantum-primary/10 rounded-full animate-pulse-soft"></div>
              <div className="relative z-10 bg-white dark:bg-card p-4 rounded-xl shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                  alt="Tecnología QuantumSync" 
                  className="rounded-lg w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 bg-quantum-gradient-soft">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="quantum-card p-8">
              <h2 className="text-2xl font-bold mb-4">Nuestra Misión</h2>
              <div className="quantum-divider w-16 my-4"></div>
              <p className="text-muted-foreground mb-6">
                La misión de QuantumSync es clara: hacer que el equilibrio energético y el bienestar personal sean accesibles a través de tecnología avanzada y fácil de usar. Queremos que cualquier persona, desde cualquier lugar del mundo, pueda acceder a herramientas que antes eran exclusivas de especialistas.
              </p>
              <p className="text-muted-foreground">
                Creemos que las herramientas energéticas deben democratizarse, permitiendo a todos tomar el control de su propio bienestar sin requerir años de entrenamiento especializado.
              </p>
            </div>
            <div className="quantum-card p-8">
              <h2 className="text-2xl font-bold mb-4">Nuestra Visión</h2>
              <div className="quantum-divider w-16 my-4"></div>
              <p className="text-muted-foreground mb-6">
                Nuestra visión es convertirnos en líderes globales en soluciones digitales para el bienestar energético. Esto significa no solo crear una aplicación innovadora, sino también desarrollar una comunidad global que valore el impacto positivo de la energía en sus vidas.
              </p>
              <p className="text-muted-foreground">
                Visualizamos un mundo donde las herramientas energéticas sean tan comunes como las aplicaciones de fitness, donde las personas mantengan rutinariamente su salud energética junto con su bienestar físico y mental.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex justify-center mb-8">
            <QuantumButton 
              className="bg-orange-500 hover:bg-orange-600 text-white glow-orange"
              onClick={() => navigate('/purchase')}
            >
              Adquiere QuantumSync
            </QuantumButton>
          </div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nuestros Valores Fundamentales</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Estos principios guían todo lo que hacemos en QuantumSync, desde el desarrollo de productos hasta las interacciones con los clientes.
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {values.map((value, index) => (
              <motion.div key={index} variants={item}>
                <Card className="quantum-card p-6 h-full">
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-16 px-4 bg-quantum-gradient-soft">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 relative">
              <div className="sticky top-24">
                <div className="relative">
                  <div className="absolute inset-0 bg-quantum-primary/10 rounded-full animate-pulse-soft"></div>
                  <div className="relative z-10 bg-white dark:bg-card p-4 rounded-xl shadow-xl">
                    <img 
                      src="/lovable-uploads/bfbeb5d4-24e2-405c-86c8-9d1c408d09fc.png" 
                      alt="Mauricio Ramos - Fundador" 
                      className="rounded-lg w-full h-auto"
                    />
                  </div>
                </div>
                <div className="text-center mt-6">
                  <h3 className="text-2xl font-bold">Mauricio Ramos</h3>
                  <p className="text-muted-foreground">Fundador & CEO</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-4">El Viaje de Nuestro Fundador</h2>
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
              <p className="text-muted-foreground mb-6">
                Con una combinación de conocimientos en psicología, terapias alternativas o energéticas y desarrollo personal, Mauricio ha liderado QuantumSync con una visión clara: empoderar a las personas para que tomen el control de su bienestar energético. Su compromiso con la innovación y la accesibilidad ha sido la base de cada decisión estratégica en la empresa.
              </p>
              <p className="text-muted-foreground mb-6">
                Mauricio no es solo el fundador de QuantumSync; también es un apasionado usuario de la aplicación, lo que garantiza que cada característica sea probada y perfeccionada desde la perspectiva de quienes más la necesitan.
              </p>
              <blockquote className="border-l-4 border-quantum-primary pl-4 italic text-muted-foreground my-8">
                "Creo que todos merecen acceso a herramientas que puedan mejorar su bienestar. La tecnología debe servir a la humanidad haciendo que soluciones poderosas sean accesibles para todos, no solo para especialistas o unos pocos privilegiados."
                <footer className="text-foreground font-medium mt-2">— Mauricio Ramos</footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex justify-center mb-8">
            <QuantumButton 
              className="bg-orange-500 hover:bg-orange-600 text-white glow-orange"
              onClick={() => navigate('/purchase')}
            >
              Adquiere QuantumSync
            </QuantumButton>
          </div>
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
      <FounderSection />

      {/* Testimonials */}
      <section className="py-16 px-4 bg-quantum-gradient-soft">
        <div className="container mx-auto">
          <div className="flex justify-center mb-8">
            <QuantumButton 
              className="bg-orange-500 hover:bg-orange-600 text-white glow-orange"
              onClick={() => navigate('/purchase')}
            >
              Adquiere QuantumSync
            </QuantumButton>
          </div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Lo que Dicen Nuestros Usuarios</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Descubre cómo QuantumSync ha transformado la vida de personas de diferentes ámbitos.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="quantum-card p-6 h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground flex-grow">{testimonial.content}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </Layout>
  );
};

export default Index;
