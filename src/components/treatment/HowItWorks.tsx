
import { Card } from '@/components/ui/card';

const HowItWorks = () => {
  return (
    <section className="py-12 px-4 bg-quantum-gradient-soft">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Cómo Funciona el Tratamiento con Frecuencias</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            QuantumSync utiliza principios de resonancia y entrenamiento para ayudar a equilibrar tu campo energético.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="quantum-card p-6">
            <div className="w-12 h-12 rounded-full bg-quantum-gradient-soft text-quantum-primary flex items-center justify-center mb-4 mx-auto">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Emisión de Frecuencia</h3>
            <p className="text-muted-foreground text-center">
              Tu dispositivo emite frecuencias vibracionales precisas calibradas para resultados específicos de bienestar.
            </p>
          </Card>
          
          <Card className="quantum-card p-6">
            <div className="w-12 h-12 rounded-full bg-quantum-gradient-soft text-quantum-primary flex items-center justify-center mb-4 mx-auto">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Resonancia Energética</h3>
            <p className="text-muted-foreground text-center">
              Estas frecuencias resuenan con el campo energético de tu cuerpo, fomentando la armonización y el equilibrio.
            </p>
          </Card>
          
          <Card className="quantum-card p-6">
            <div className="w-12 h-12 rounded-full bg-quantum-gradient-soft text-quantum-primary flex items-center justify-center mb-4 mx-auto">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Equilibrio del Campo Energético</h3>
            <p className="text-muted-foreground text-center">
              Con el uso regular, tus sistemas energéticos se ajustan a un funcionamiento óptimo, mejorando el bienestar general.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
