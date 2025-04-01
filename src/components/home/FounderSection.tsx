
const FounderSection = () => {
  return (
    <section className="py-16 px-4 bg-quantum-gradient-soft">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="absolute inset-0 bg-quantum-primary/10 rounded-full animate-pulse-soft"></div>
            <div className="relative z-10 bg-white dark:bg-card p-4 rounded-xl shadow-xl">
              <img 
                src="/lovable-uploads/49ba3964-8fe6-41e9-a562-c21136264cfa.png" 
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
  );
};

export default FounderSection;
