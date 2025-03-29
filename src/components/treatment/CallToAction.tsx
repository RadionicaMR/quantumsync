
import QuantumButton from '@/components/QuantumButton';

const CallToAction = () => {
  return (
    <section className="py-12 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">¿Listo para Manifestar tus Objetivos?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Después de tratar los desequilibrios energéticos, utiliza nuestras herramientas de manifestación para atraer lo que deseas.
        </p>
        <QuantumButton>Explorar Herramientas de Manifestación</QuantumButton>
      </div>
    </section>
  );
};

export default CallToAction;
