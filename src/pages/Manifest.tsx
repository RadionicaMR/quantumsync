
import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import QuantumButton from '@/components/QuantumButton';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from "@/components/ui/use-toast";

const Manifest = () => {
  const { toast } = useToast();
  const [goal, setGoal] = useState('');
  const [description, setDescription] = useState('');
  const [intentionStrength, setIntentionStrength] = useState([50]);
  const [selectedPattern, setSelectedPattern] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [useReminder, setUseReminder] = useState(false);
  const [useVisualization, setUseVisualization] = useState(true);

  const patterns = [
    { id: 1, name: 'Cuadrícula de Abundancia', description: 'Atrae prosperidad y abundancia' },
    { id: 2, name: 'Matriz de Salud', description: 'Mejora la vitalidad y el bienestar' },
    { id: 3, name: 'Armonía en Relaciones', description: 'Mejora las conexiones con otros' },
    { id: 4, name: 'Éxito Profesional', description: 'Acelera el crecimiento profesional' },
    { id: 5, name: 'Flujo Creativo', description: 'Potencia la expresión artística' },
    { id: 6, name: 'Paz Interior', description: 'Desarrolla armonía espiritual' },
  ];

  const activateManifest = () => {
    if (!goal.trim()) {
      toast({
        title: "El objetivo es obligatorio",
        description: "Por favor, ingresa una intención clara para tu manifestación.",
        variant: "destructive",
      });
      return;
    }

    if (selectedPattern === null) {
      toast({
        title: "Selecciona un patrón",
        description: "Por favor, selecciona un patrón radiónico para tu manifestación.",
        variant: "destructive",
      });
      return;
    }

    setIsActive(true);
    toast({
      title: "Manifestación Activada",
      description: "Tu intención ahora está siendo amplificada a través de patrones radiónicos cuánticos.",
    });
  };

  const deactivateManifest = () => {
    setIsActive(false);
    toast({
      title: "Manifestación Desactivada",
      description: "Tu intención ha sido guardada pero ya no está activa.",
    });
  };

  return (
    <Layout>
      <HeroSection
        title="Manifiesta tus Intenciones"
        subtitle="Usa patrones radiónicos cuánticos para amplificar tus intenciones y atraer lo que deseas."
      />

      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card className="quantum-card p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">Establece tu Intención</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="goal">Tu Objetivo</Label>
                    <Input 
                      id="goal" 
                      className="quantum-input mt-1" 
                      placeholder="¿Qué quieres manifestar?"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      disabled={isActive}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Descripción (Opcional)</Label>
                    <Textarea 
                      id="description" 
                      className="quantum-input mt-1" 
                      placeholder="Describe tu intención en detalle..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      disabled={isActive}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="strength">Fuerza de Intención: {intentionStrength[0]}%</Label>
                    <Slider
                      id="strength"
                      defaultValue={intentionStrength}
                      max={100}
                      step={1}
                      value={intentionStrength}
                      onValueChange={setIntentionStrength}
                      disabled={isActive}
                      className="mt-2"
                    />
                  </div>
                </div>
              </Card>
              
              <Card className="quantum-card p-6">
                <h3 className="text-xl font-semibold mb-4">Configuración</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="reminder">Recordatorio Diario</Label>
                    <Switch 
                      id="reminder" 
                      checked={useReminder}
                      onCheckedChange={setUseReminder}
                      disabled={isActive}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="visualization">Entrenamiento Visual</Label>
                    <Switch 
                      id="visualization" 
                      checked={useVisualization}
                      onCheckedChange={setUseVisualization}
                    />
                  </div>
                  
                  <div className="pt-4">
                    {!isActive ? (
                      <QuantumButton 
                        onClick={activateManifest}
                        className="w-full"
                      >
                        Activar Manifestación
                      </QuantumButton>
                    ) : (
                      <QuantumButton 
                        variant="outline"
                        onClick={deactivateManifest}
                        className="w-full"
                      >
                        Desactivar
                      </QuantumButton>
                    )}
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <Card className="quantum-card p-6 h-full">
                <h3 className="text-xl font-semibold mb-4">Seleccionar Patrón Radiónico</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {patterns.map((pattern) => (
                    <motion.div
                      key={pattern.id}
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    >
                      <button
                        className={`w-full h-full p-4 rounded-lg border-2 transition-all text-left ${
                          selectedPattern === pattern.id 
                            ? 'border-quantum-primary bg-quantum-gradient-soft' 
                            : 'border-border bg-card hover:bg-muted/50'
                        } ${isActive ? 'cursor-not-allowed opacity-60' : ''}`}
                        onClick={() => !isActive && setSelectedPattern(pattern.id)}
                        disabled={isActive}
                      >
                        <h4 className="font-semibold mb-1">{pattern.name}</h4>
                        <p className="text-sm text-muted-foreground">{pattern.description}</p>
                      </button>
                    </motion.div>
                  ))}
                </div>
                
                {selectedPattern && (
                  <div className="relative bg-muted dark:bg-card rounded-lg overflow-hidden p-4">
                    <div className="text-center mb-4">
                      <h3 className="font-semibold">
                        {patterns.find(p => p.id === selectedPattern)?.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {patterns.find(p => p.id === selectedPattern)?.description}
                      </p>
                    </div>
                    
                    <div className="aspect-square max-w-md mx-auto relative">
                      {/* Radionic pattern visualization */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        {/* Base grid */}
                        <div className="w-full h-full border-2 border-quantum-primary/20 rounded-lg"></div>
                        
                        {/* Pattern specific to selection */}
                        {selectedPattern === 1 && (
                          <div className="absolute inset-0">
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" className="text-quantum-primary/30" strokeWidth="1" />
                              <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" className="text-quantum-primary/40" strokeWidth="1" />
                              <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" className="text-quantum-primary/50" strokeWidth="1" />
                              <path d="M10,50 L90,50" stroke="currentColor" className="text-quantum-primary/60" strokeWidth="1" />
                              <path d="M50,10 L50,90" stroke="currentColor" className="text-quantum-primary/60" strokeWidth="1" />
                              <path d="M20,20 L80,80" stroke="currentColor" className="text-quantum-primary/60" strokeWidth="1" />
                              <path d="M20,80 L80,20" stroke="currentColor" className="text-quantum-primary/60" strokeWidth="1" />
                            </svg>
                          </div>
                        )}
                        
                        {selectedPattern === 2 && (
                          <div className="absolute inset-0">
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                              <rect x="20" y="20" width="60" height="60" fill="none" stroke="currentColor" className="text-quantum-primary/30" strokeWidth="1" />
                              <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" className="text-quantum-primary/50" strokeWidth="1" />
                              <path d="M20,50 L80,50" stroke="currentColor" className="text-quantum-primary/60" strokeWidth="1" />
                              <path d="M50,20 L50,80" stroke="currentColor" className="text-quantum-primary/60" strokeWidth="1" />
                            </svg>
                          </div>
                        )}
                        
                        {selectedPattern === 3 && (
                          <div className="absolute inset-0">
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                              <circle cx="35" cy="35" r="20" fill="none" stroke="currentColor" className="text-quantum-primary/40" strokeWidth="1" />
                              <circle cx="65" cy="65" r="20" fill="none" stroke="currentColor" className="text-quantum-primary/40" strokeWidth="1" />
                              <path d="M35,35 L65,65" stroke="currentColor" className="text-quantum-primary/60" strokeWidth="1" />
                              <path d="M20,50 L80,50" stroke="currentColor" className="text-quantum-primary/30" strokeWidth="1" />
                              <path d="M50,20 L50,80" stroke="currentColor" className="text-quantum-primary/30" strokeWidth="1" />
                            </svg>
                          </div>
                        )}
                        
                        {selectedPattern === 4 && (
                          <div className="absolute inset-0">
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                              <path d="M20,20 L80,20 L80,80 L20,80 Z" fill="none" stroke="currentColor" className="text-quantum-primary/30" strokeWidth="1" />
                              <path d="M35,35 L65,35 L65,65 L35,65 Z" fill="none" stroke="currentColor" className="text-quantum-primary/50" strokeWidth="1" />
                              <path d="M20,20 L80,80" stroke="currentColor" className="text-quantum-primary/60" strokeWidth="1" />
                              <path d="M20,80 L80,20" stroke="currentColor" className="text-quantum-primary/60" strokeWidth="1" />
                            </svg>
                          </div>
                        )}
                        
                        {selectedPattern === 5 && (
                          <div className="absolute inset-0">
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                              <path d="M50,20 L80,50 L50,80 L20,50 Z" fill="none" stroke="currentColor" className="text-quantum-primary/40" strokeWidth="1" />
                              <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" className="text-quantum-primary/60" strokeWidth="1" />
                              <path d="M20,20 L80,80" stroke="currentColor" className="text-quantum-primary/30" strokeWidth="1" />
                              <path d="M20,80 L80,20" stroke="currentColor" className="text-quantum-primary/30" strokeWidth="1" />
                            </svg>
                          </div>
                        )}
                        
                        {selectedPattern === 6 && (
                          <div className="absolute inset-0">
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" className="text-quantum-primary/30" strokeWidth="1" />
                              <path d="M30,30 L70,70" stroke="currentColor" className="text-quantum-primary/60" strokeWidth="1" />
                              <path d="M30,70 L70,30" stroke="currentColor" className="text-quantum-primary/60" strokeWidth="1" />
                              <path d="M50,10 L50,90" stroke="currentColor" className="text-quantum-primary/40" strokeWidth="1" />
                              <path d="M10,50 L90,50" stroke="currentColor" className="text-quantum-primary/40" strokeWidth="1" />
                              <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" className="text-quantum-primary/70" strokeWidth="1" />
                            </svg>
                          </div>
                        )}
                        
                        {/* Active energy visualization */}
                        {isActive && useVisualization && (
                          <>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-1/2 h-1/2 rounded-full bg-quantum-primary/5 animate-pulse-soft"></div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-1/3 h-1/3 rounded-full bg-quantum-primary/10 animate-pulse-soft" style={{ animationDelay: '0.5s' }}></div>
                            </div>
                            <div className="absolute inset-0 bg-quantum-gradient-soft opacity-20 animate-pulse-soft"></div>
                          </>
                        )}
                        
                        {/* Goal text overlay */}
                        {isActive && goal && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white/80 dark:bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm max-w-[80%]">
                              <p className="text-sm font-medium text-center">{goal}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {isActive && (
                      <div className="mt-4 text-center">
                        <div className="text-sm text-quantum-primary">
                          Intención Activa • Fuerza: {intentionStrength[0]}%
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Tu manifestación está siendo amplificada actualmente a través de campos cuánticos
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {!selectedPattern && (
                  <div className="flex items-center justify-center h-[300px] text-center text-muted-foreground">
                    <div>
                      <div className="text-quantum-primary text-5xl mb-4">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <p className="mb-2">Selecciona un patrón radiónico</p>
                      <p className="text-sm">Elige el patrón que mejor se alinee con tu objetivo de manifestación</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-quantum-gradient-soft">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Cómo Funciona la Manifestación</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              QuantumSync combina el establecimiento de intenciones con amplificación radiónica para ayudar a manifestar tus deseos.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="quantum-card p-6">
              <div className="w-12 h-12 rounded-full bg-quantum-gradient-soft text-quantum-primary flex items-center justify-center mb-4 mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">Establece una Intención Clara</h3>
              <p className="text-muted-foreground text-center">
                Define exactamente lo que quieres manifestar con claridad y formulación positiva.
              </p>
            </Card>
            
            <Card className="quantum-card p-6">
              <div className="w-12 h-12 rounded-full bg-quantum-gradient-soft text-quantum-primary flex items-center justify-center mb-4 mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">Amplificación Energética</h3>
              <p className="text-muted-foreground text-center">
                Nuestros patrones radiónicos amplifican tu intención a través de campos de resonancia cuántica.
              </p>
            </Card>
            
            <Card className="quantum-card p-6">
              <div className="w-12 h-12 rounded-full bg-quantum-gradient-soft text-quantum-primary flex items-center justify-center mb-4 mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">Alineación con la Atracción</h3>
              <p className="text-muted-foreground text-center">
                A medida que te alineas energéticamente con tu objetivo, naturalmente atraes experiencias correspondientes.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Únete a Nuestra Comunidad</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Conéctate con otros en su viaje de manifestación y comparte experiencias.
          </p>
          <QuantumButton>Únete a Nuestra Comunidad</QuantumButton>
        </div>
      </section>
    </Layout>
  );
};

export default Manifest;
