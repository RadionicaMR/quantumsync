
import { useState } from 'react';
import { motion } from 'framer-motion';
import InfoCard from './InfoCard';
import { useLocation } from 'react-router-dom';

const InfoSection = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const location = useLocation();
  
  // Different info cards based on the current page
  const manifestCards = [
    {
      step: 1,
      title: "Selecciona el Área de Enfoque",
      description: "Elige un patrón radiónico para manifestar abundancia, salud, amor u otra área de tu vida que desees transformar."
    },
    {
      step: 2,
      title: "Programa tu Intención",
      description: "Define claramente qué deseas manifestar e incorpora rates o gráficos radiónicos para amplificar la energía de tu intención."
    },
    {
      step: 3,
      title: "Configura Tiempo y Frecuencia",
      description: "Establece los parámetros de exposición y repite el proceso regularmente hasta lograr la manifestación de tus deseos."
    }
  ];

  const diagnoseCards = [
    {
      step: 1,
      title: "Selecciona Área de Enfoque",
      description: "Elige qué aspecto de tu campo energético quieres diagnosticar, desde vitalidad física hasta equilibrio emocional."
    },
    {
      step: 2,
      title: "Analiza Patrones Energéticos",
      description: "Nuestro VibraCheck Cuántico detecta desequilibrios energéticos sutiles utilizando algoritmos radiónicos avanzados."
    },
    {
      step: 3,
      title: "Obtén Recomendaciones de Tratamiento",
      description: "Basado en tu diagnóstico, recibe sugerencias de tratamientos de frecuencia personalizados para restaurar el equilibrio."
    }
  ];

  // Determine which cards to show based on the current page
  const isManifestPage = location.pathname.includes('/manifest');
  const infoCards = isManifestPage ? manifestCards : diagnoseCards;
  
  // Get appropriate subtitle based on page
  const getSubtitle = () => {
    if (isManifestPage) {
      return "Nuestra plataforma te permite configurar intenciones específicas y amplificarlas a través del campo cuántico para atraer tus deseos a la realidad.";
    }
    return "Nuestras herramientas de diagnóstico utilizan principios de radiónica y medicina energética para ayudarte a identificar desequilibrios.";
  };

  return (
    <section className="py-12 px-4 bg-quantum-gradient-soft">
      <div className="container mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">Cómo Funciona</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {getSubtitle()}
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {infoCards.map((card, index) => (
            <motion.div 
              key={card.step}
              whileHover={{ scale: 1.03 }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <InfoCard 
                step={card.step} 
                title={card.title} 
                description={card.description} 
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
