
import { Card } from '@/components/ui/card';

const InfoSection = () => {
  return (
    <section className="py-12 px-4 bg-quantum-gradient-soft">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Cómo Funciona</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Nuestras herramientas de diagnóstico utilizan principios de radiónica y medicina energética para ayudarte a identificar desequilibrios.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="quantum-card p-6">
            <div className="w-12 h-12 rounded-full bg-quantum-gradient-soft text-quantum-primary flex items-center justify-center mb-4 mx-auto">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Selecciona Área de Enfoque</h3>
            <p className="text-muted-foreground text-center">
              Elige qué aspecto de tu campo energético quieres diagnosticar, desde vitalidad física hasta equilibrio emocional.
            </p>
          </Card>
          
          <Card className="quantum-card p-6">
            <div className="w-12 h-12 rounded-full bg-quantum-gradient-soft text-quantum-primary flex items-center justify-center mb-4 mx-auto">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Analiza Patrones Energéticos</h3>
            <p className="text-muted-foreground text-center">
              Nuestro péndulo virtual detecta desequilibrios energéticos sutiles utilizando algoritmos radiónicos avanzados.
            </p>
          </Card>
          
          <Card className="quantum-card p-6">
            <div className="w-12 h-12 rounded-full bg-quantum-gradient-soft text-quantum-primary flex items-center justify-center mb-4 mx-auto">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Obtén Recomendaciones de Tratamiento</h3>
            <p className="text-muted-foreground text-center">
              Basado en tu diagnóstico, recibe sugerencias de tratamientos de frecuencia personalizados para restaurar el equilibrio.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
