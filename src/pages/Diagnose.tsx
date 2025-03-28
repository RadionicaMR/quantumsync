
import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import QuantumButton from '@/components/QuantumButton';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';

const Diagnose = () => {
  const [pendulumAngle, setPendulumAngle] = useState(0);
  const [isPendulumSwinging, setIsPendulumSwinging] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<string | null>(null);
  const [diagnosisPercentage, setDiagnosisPercentage] = useState(0);
  const [sensitivity, setSensitivity] = useState([50]);

  const areas = [
    "Physical Energy", 
    "Mental Clarity", 
    "Emotional Balance", 
    "Stress Levels", 
    "Sleep Quality", 
    "Spiritual Connection"
  ];

  const startPendulum = (area: string) => {
    setSelectedArea(area);
    setIsPendulumSwinging(true);
    setDiagnosisResult(null);
    
    // Simulate pendulum swing
    let angle = 0;
    const swingInterval = setInterval(() => {
      angle = Math.sin(Date.now() / 500) * 30;
      setPendulumAngle(angle);
    }, 16);
    
    // Stop after random time between 3-6 seconds
    const duration = Math.random() * 3000 + 3000;
    setTimeout(() => {
      clearInterval(swingInterval);
      setIsPendulumSwinging(false);
      setPendulumAngle(0);
      
      // Generate diagnosis result
      const percentage = Math.floor(Math.random() * 101);
      setDiagnosisPercentage(percentage);
      
      if (percentage < 30) {
        setDiagnosisResult("Low");
      } else if (percentage < 70) {
        setDiagnosisResult("Medium");
      } else {
        setDiagnosisResult("High");
      }
    }, duration);
  };

  return (
    <Layout>
      <HeroSection
        title="Energy Diagnosis"
        subtitle="Identify energy imbalances and areas that need attention with our intuitive radionic diagnostic tools."
      />

      <section className="py-12 px-4">
        <div className="container mx-auto">
          <Tabs defaultValue="pendulum" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="pendulum">Virtual Pendulum</TabsTrigger>
              <TabsTrigger value="dowsing">Energy Scanner</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pendulum" className="w-full">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="quantum-card p-6 lg:col-span-1">
                  <h3 className="text-xl font-semibold mb-4">Select Area to Diagnose</h3>
                  <div className="space-y-2">
                    {areas.map((area) => (
                      <button
                        key={area}
                        className={`w-full p-3 rounded-lg text-left transition-all ${
                          selectedArea === area 
                            ? 'bg-quantum-primary text-white' 
                            : 'bg-muted hover:bg-muted/80'
                        }`}
                        onClick={() => startPendulum(area)}
                        disabled={isPendulumSwinging}
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-medium mb-2">Pendulum Sensitivity</h4>
                    <Slider
                      defaultValue={[50]}
                      max={100}
                      step={1}
                      value={sensitivity}
                      onValueChange={setSensitivity}
                      disabled={isPendulumSwinging}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>Low</span>
                      <span>Medium</span>
                      <span>High</span>
                    </div>
                  </div>
                </Card>
                
                <div className="lg:col-span-2">
                  <Card className="quantum-card p-6 h-full">
                    <h3 className="text-xl font-semibold mb-4">Energy Diagnosis</h3>
                    
                    <div className="flex flex-col items-center justify-center min-h-[400px]">
                      {selectedArea ? (
                        <>
                          <div className="text-lg mb-6">
                            Diagnosing: <span className="font-semibold">{selectedArea}</span>
                          </div>
                          
                          <div className="relative w-2 h-[200px] bg-quantum-gradient-soft rounded-full mb-8">
                            <div 
                              className="absolute top-0 left-1/2 -translate-x-1/2 w-[150px] h-[2px] bg-quantum-primary origin-left"
                              style={{ 
                                transform: `translateX(-50%) rotate(${pendulumAngle}deg)`,
                                transformOrigin: 'left center'
                              }}
                            >
                              <div className="absolute right-0 w-8 h-8 rounded-full bg-quantum-gradient flex items-center justify-center text-white">
                                <span className="sr-only">Pendulum</span>
                                Q
                              </div>
                            </div>
                          </div>
                          
                          {diagnosisResult && (
                            <motion.div 
                              className="text-center"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5 }}
                            >
                              <div className="text-2xl font-semibold mb-2">
                                Diagnosis Result: {diagnosisResult}
                              </div>
                              <div className="w-full max-w-md h-4 bg-muted rounded-full mb-2 overflow-hidden">
                                <motion.div 
                                  className="h-full bg-quantum-gradient"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${diagnosisPercentage}%` }}
                                  transition={{ duration: 1 }}
                                />
                              </div>
                              <div className="text-muted-foreground">
                                Your {selectedArea} is at {diagnosisPercentage}% of optimal level
                              </div>
                              
                              <div className="mt-6">
                                <QuantumButton onClick={() => startPendulum(selectedArea)}>
                                  Diagnose Again
                                </QuantumButton>
                              </div>
                            </motion.div>
                          )}
                          
                          {isPendulumSwinging && (
                            <div className="text-muted-foreground animate-pulse">
                              Analyzing energy patterns...
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center text-muted-foreground">
                          <div className="text-quantum-primary text-5xl mb-4">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <p className="mb-4">Select an area to begin your energy diagnosis</p>
                          <p className="text-sm">The virtual pendulum will help identify imbalances in your energy field</p>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="dowsing" className="w-full">
              <Card className="quantum-card p-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Full Energy Field Scanner</h3>
                  <p className="text-muted-foreground mb-8">
                    The advanced energy scanner uses radionic principles to provide a comprehensive assessment of your entire energy field.
                  </p>
                  
                  <div className="relative w-64 h-64 mx-auto mb-8">
                    <div className="absolute inset-0 rounded-full border-4 border-quantum-primary/20 animate-spin-slow"></div>
                    <div className="absolute inset-4 rounded-full border-4 border-quantum-primary/30 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '6s' }}></div>
                    <div className="absolute inset-8 rounded-full border-4 border-quantum-primary/40 animate-spin-slow"></div>
                    <div className="absolute inset-12 rounded-full border-4 border-quantum-primary/50 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '4s' }}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-quantum-primary font-bold text-lg">Coming Soon</div>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">
                    Our advanced scanner feature is currently in development and will be available in the next update.
                  </p>
                  
                  <QuantumButton disabled>Get Notified When Available</QuantumButton>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section className="py-12 px-4 bg-quantum-gradient-soft">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our diagnostic tools use principles of radionics and energy medicine to help you identify imbalances.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="quantum-card p-6">
              <div className="w-12 h-12 rounded-full bg-quantum-gradient-soft text-quantum-primary flex items-center justify-center mb-4 mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">Select Focus Area</h3>
              <p className="text-muted-foreground text-center">
                Choose which aspect of your energy field you want to diagnose, from physical vitality to emotional balance.
              </p>
            </Card>
            
            <Card className="quantum-card p-6">
              <div className="w-12 h-12 rounded-full bg-quantum-gradient-soft text-quantum-primary flex items-center justify-center mb-4 mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">Analyze Energy Patterns</h3>
              <p className="text-muted-foreground text-center">
                Our virtual pendulum detects subtle energetic imbalances using advanced radionic algorithms.
              </p>
            </Card>
            
            <Card className="quantum-card p-6">
              <div className="w-12 h-12 rounded-full bg-quantum-gradient-soft text-quantum-primary flex items-center justify-center mb-4 mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">Get Treatment Recommendations</h3>
              <p className="text-muted-foreground text-center">
                Based on your diagnosis, receive customized frequency treatment suggestions to restore balance.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Go Deeper?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            After diagnosis, move on to our treatment module to address any imbalances with targeted frequency therapy.
          </p>
          <QuantumButton>Explore Treatments</QuantumButton>
        </div>
      </section>
    </Layout>
  );
};

export default Diagnose;
