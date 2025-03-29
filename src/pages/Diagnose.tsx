
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Volume, Volume2 } from 'lucide-react';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import QuantumButton from '@/components/QuantumButton';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useDeviceMotion } from '@/hooks/useDeviceMotion';
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const Diagnose = () => {
  const [pendulumAngle, setPendulumAngle] = useState(0);
  const [isPendulumSwinging, setIsPendulumSwinging] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<string | null>(null);
  const [diagnosisPercentage, setDiagnosisPercentage] = useState(0);
  const [sensitivity, setSensitivity] = useState([50]);
  const [useCameraMode, setUseCameraMode] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraResult, setCameraResult] = useState<'SI' | 'NO' | null>(null);
  const [processingCamera, setProcessingCamera] = useState(false);
  const [pendulumSound, setPendulumSound] = useState(true);
  const [askingMental, setAskingMental] = useState(false);
  const [mentalQuestionMode, setMentalQuestionMode] = useState(false);

  const { detectMotion, requestPermission, motion } = useDeviceMotion();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const areas = [
    "Energía Física", 
    "Claridad Mental", 
    "Equilibrio Emocional", 
    "Niveles de Estrés", 
    "Calidad del Sueño", 
    "Conexión Espiritual"
  ];

  const startMentalQuestion = async () => {
    setMentalQuestionMode(true);
    setAskingMental(true);
    setCameraResult(null);
    setProcessingCamera(true);
    setIsPendulumSwinging(true);
    
    // Begin pendulum swing animation
    let angle = 0;
    const swingInterval = setInterval(() => {
      angle = Math.sin(Date.now() / 500) * 30;
      setPendulumAngle(angle);
    }, 16);
    
    try {
      // Request permission for device motion
      const hasPermission = await requestPermission();
      
      if (!hasPermission) {
        toast({
          title: "Permiso denegado",
          description: "Necesitamos acceso al sensor de movimiento para esta funcionalidad.",
          variant: "destructive"
        });
        clearInterval(swingInterval);
        setProcessingCamera(false);
        setIsPendulumSwinging(false);
        setAskingMental(false);
        return;
      }
      
      // Play sound if enabled
      if (pendulumSound) {
        startPendulumSound();
      }

      // Show toast with instructions
      toast({
        title: "Formulando pregunta",
        description: "Piensa en tu pregunta mientras sostienes el dispositivo...",
      });
      
      // Detect significant motion over 5 seconds with threshold of 5 degrees
      const hasSignificantMotion = await detectMotion(5000, 5);
      
      // Stop swing animation
      clearInterval(swingInterval);
      setPendulumAngle(0);
      setIsPendulumSwinging(false);
      
      // Generate result based on motion
      if (hasSignificantMotion) {
        setCameraResult("SI");
      } else {
        setCameraResult("NO");
      }

      // Stop sound
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current = null;
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    } catch (error) {
      console.error("Error durante la pregunta mental:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error durante el análisis de movimiento.",
        variant: "destructive"
      });
      clearInterval(swingInterval);
    } finally {
      setProcessingCamera(false);
      setAskingMental(false);
    }
  };

  // Function to start/stop camera
  const toggleCamera = async () => {
    if (isCameraActive && streamRef.current) {
      // Stop camera
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsCameraActive(false);
      return;
    }

    try {
      // Request camera permissions
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: { ideal: 'environment' } } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast({
        title: "Error de cámara",
        description: "No pudimos acceder a la cámara de tu dispositivo.",
        variant: "destructive"
      });
    }
  };

  const startMotionDiagnosis = async (area: string) => {
    if (!useCameraMode) {
      startPendulum(area);
      return;
    }

    setSelectedArea(area);
    setCameraResult(null);
    setProcessingCamera(true);
    setIsPendulumSwinging(true);
    
    // Let's mimic pendulum swinging during motion detection
    let angle = 0;
    const swingInterval = setInterval(() => {
      angle = Math.sin(Date.now() / 500) * 30;
      setPendulumAngle(angle);
    }, 16);
    
    try {
      // Request permission for device motion
      const hasPermission = await requestPermission();
      
      if (!hasPermission) {
        toast({
          title: "Permiso denegado",
          description: "Necesitamos acceso al sensor de movimiento para esta funcionalidad.",
          variant: "destructive"
        });
        clearInterval(swingInterval);
        setProcessingCamera(false);
        setIsPendulumSwinging(false);
        return;
      }
      
      // Play sound if enabled
      if (pendulumSound) {
        startPendulumSound();
      }

      // Wait 1 second to prepare
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Análisis en curso",
        description: "Mantenga el dispositivo estable durante 5 segundos...",
      });
      
      // Detect significant motion over 5 seconds with threshold of 5 degrees
      const hasSignificantMotion = await detectMotion(5000, 5);
      
      // Stop swing animation
      clearInterval(swingInterval);
      setPendulumAngle(0);
      
      // Generate diagnosis result based on motion
      const percentage = hasSignificantMotion 
        ? Math.floor(Math.random() * 31) + 70 // Between 70-100 for YES (SI)
        : Math.floor(Math.random() * 31) + 10; // Between 10-40 for NO
      
      setDiagnosisPercentage(percentage);
      
      if (hasSignificantMotion) {
        setDiagnosisResult("Alto");
        setCameraResult("SI");
      } else {
        setDiagnosisResult("Bajo");
        setCameraResult("NO");
      }

      // Stop sound
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current = null;
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    } catch (error) {
      console.error("Error durante el diagnóstico con movimiento:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error durante el análisis de movimiento.",
        variant: "destructive"
      });
      clearInterval(swingInterval);
    } finally {
      setProcessingCamera(false);
      setIsPendulumSwinging(false);
    }
  };

  const startPendulum = (area: string) => {
    setSelectedArea(area);
    setIsPendulumSwinging(true);
    setDiagnosisResult(null);
    setCameraResult(null);
    
    // Play sound if enabled
    if (pendulumSound) {
      startPendulumSound();
    }
    
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
        setDiagnosisResult("Bajo");
      } else if (percentage < 70) {
        setDiagnosisResult("Medio");
      } else {
        setDiagnosisResult("Alto");
      }

      // Stop sound
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current = null;
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    }, duration);
  };

  const startPendulumSound = () => {
    try {
      // Inicializar contexto de audio
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
      
      // Crear oscilador
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 174; // Frecuencia relacionada con el péndulo
      
      // Configurar volumen
      gainNode.gain.value = 0.1; // volumen muy bajo
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.start();
      oscillatorRef.current = oscillator;
    } catch (error) {
      console.error("Error al iniciar el audio del péndulo:", error);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup camera on component unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Cleanup audio
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <Layout>
      <HeroSection
        title="Diagnóstico Energético"
        subtitle="Identifica desequilibrios energéticos y áreas que necesitan atención con nuestras herramientas de diagnóstico radiónico intuitivas."
      />

      <section className="py-12 px-4">
        <div className="container mx-auto">
          <Tabs defaultValue="pendulum" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="pendulum">Péndulo Virtual</TabsTrigger>
              <TabsTrigger value="dowsing">Escáner Energético</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pendulum" className="w-full">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="quantum-card p-6 lg:col-span-1">
                  <h3 className="text-xl font-semibold mb-4">Selecciona Área a Diagnosticar</h3>
                  
                  <div className="mb-6">
                    <QuantumButton
                      onClick={() => setMentalQuestionMode(!mentalQuestionMode)}
                      className="w-full mb-4"
                    >
                      {mentalQuestionMode 
                        ? "Modo Diagnóstico por Área" 
                        : "Modo Pregunta Mental (SI/NO)"}
                    </QuantumButton>
                    
                    {mentalQuestionMode && (
                      <div className="bg-quantum-gradient-soft p-4 rounded-lg mb-4">
                        <h4 className="font-medium mb-2">Pregunta Mental</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Piensa en una pregunta que se pueda responder con SÍ o NO. Mantén el dispositivo estable y presiona el botón.
                        </p>
                        <QuantumButton
                          onClick={startMentalQuestion}
                          disabled={askingMental || processingCamera}
                          className="w-full"
                        >
                          {askingMental ? "Analizando..." : "Iniciar Pregunta Mental"}
                        </QuantumButton>
                        
                        {useCameraMode && (
                          <div className="mt-4 p-2 bg-blue-100 border border-blue-200 rounded-md">
                            <p className="text-sm text-blue-800 text-center font-medium">
                              Solo disponible en el Móvil
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {!mentalQuestionMode && (
                    <div className="space-y-2">
                      {areas.map((area) => (
                        <button
                          key={area}
                          className={`w-full p-3 rounded-lg text-left transition-all ${
                            selectedArea === area 
                              ? 'bg-quantum-primary text-white' 
                              : 'bg-muted hover:bg-muted/80'
                          }`}
                          onClick={() => startMotionDiagnosis(area)}
                          disabled={isPendulumSwinging || processingCamera}
                        >
                          {area}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Modo de Diagnóstico</h4>
                      <div className="flex items-center">
                        <Switch
                          checked={pendulumSound}
                          onCheckedChange={setPendulumSound}
                          disabled={isPendulumSwinging || processingCamera}
                          id="sound-toggle"
                          className="mr-2"
                        />
                        <Label htmlFor="sound-toggle" className="cursor-pointer">
                          {pendulumSound ? <Volume size={18} /> : <Volume2 size={18} />}
                        </Label>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-4">
                      <Switch
                        checked={useCameraMode}
                        onCheckedChange={setUseCameraMode}
                        disabled={isPendulumSwinging || processingCamera}
                        id="camera-mode"
                      />
                      <Label htmlFor="camera-mode" className="cursor-pointer flex items-center gap-2">
                        <Camera size={18} className="text-quantum-primary" />
                        Usar sensor de movimiento
                      </Label>
                    </div>
                    
                    <h4 className="font-medium mb-2">Sensibilidad del Péndulo</h4>
                    <Slider
                      defaultValue={[50]}
                      max={100}
                      step={1}
                      value={sensitivity}
                      onValueChange={setSensitivity}
                      disabled={isPendulumSwinging || processingCamera}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>Baja</span>
                      <span>Media</span>
                      <span>Alta</span>
                    </div>
                  </div>
                </Card>
                
                <div className="lg:col-span-2">
                  <Card className="quantum-card p-6 h-full">
                    <h3 className="text-xl font-semibold mb-4">
                      {mentalQuestionMode ? "Respuesta a tu Pregunta Mental" : "Diagnóstico Energético"}
                    </h3>
                    
                    <div className="flex flex-col items-center justify-center min-h-[400px]">
                      {mentalQuestionMode ? (
                        // Pregunta mental UI
                        <>
                          <div className="relative w-full h-[200px] flex items-center justify-center">
                            {/* Círculo de energía de fondo */}
                            <div className="absolute w-48 h-48 rounded-full bg-quantum-gradient-soft opacity-30 animate-pulse-soft"></div>
                            
                            {/* Línea central */}
                            <div className="absolute h-[150px] w-[2px] bg-quantum-gradient opacity-40"></div>
                            
                            {/* Video de la cámara (oculto) */}
                            {useCameraMode && (
                              <video 
                                ref={videoRef}
                                autoPlay 
                                playsInline
                                className="hidden"
                              />
                            )}
                            
                            {/* Péndulo holográfico */}
                            <motion.div
                              className="absolute top-0 w-1 h-[150px]"
                              style={{ 
                                transformOrigin: 'top center',
                                rotate: `${pendulumAngle}deg` 
                              }}
                              animate={{ 
                                rotate: isPendulumSwinging ? ['-30deg', '30deg', '-30deg'] : '0deg' 
                              }}
                              transition={{
                                duration: 2,
                                ease: "easeInOut",
                                repeat: isPendulumSwinging ? Infinity : 0
                              }}
                            >
                              <div className="w-1 h-[150px] bg-gradient-to-b from-quantum-primary/50 to-quantum-primary/10 relative">
                                {/* Hilo del péndulo */}
                                <div className="absolute inset-0 w-full h-full bg-white/10"></div>
                                
                                {/* Orbe del péndulo */}
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-16 h-16">
                                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 animate-pulse"></div>
                                  <div className="absolute inset-1 rounded-full bg-gradient-to-br from-purple-600/30 to-blue-600/30 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                                  <div className="absolute inset-2 rounded-full bg-gradient-to-br from-purple-700/40 to-blue-700/40 animate-pulse" style={{animationDelay: '0.4s'}}></div>
                                  <div className="absolute inset-3 rounded-full bg-gradient-to-br from-quantum-vividpurple/70 to-blue-400/70 backdrop-blur-sm border border-white/20 shadow-[0_0_15px_rgba(138,43,226,0.7)]"></div>
                                  <div className="absolute inset-0 flex items-center justify-center text-white text-lg font-bold holographic-gradient">Q</div>
                                  <div className="absolute top-1/4 left-1/4 w-1 h-1 rounded-full bg-white animate-pulse"></div>
                                  <div className="absolute top-3/4 right-1/4 w-2 h-2 rounded-full bg-white animate-pulse" style={{animationDelay: '0.6s'}}></div>
                                </div>
                              </div>
                            </motion.div>
                          </div>
                          
                          {askingMental && (
                            <div className="text-center mt-8 animate-pulse">
                              <p className="text-lg">Formulando tu pregunta...</p>
                              <p className="text-sm text-muted-foreground mt-2">
                                Mantén el dispositivo estable mientras piensas en tu pregunta
                              </p>
                            </div>
                          )}
                          
                          {cameraResult && !askingMental && (
                            <motion.div 
                              className="text-center mt-8"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.5 }}
                            >
                              <div className="text-4xl font-bold mb-6">
                                <span className={`px-8 py-4 rounded-full ${
                                  cameraResult === 'SI' 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-red-500 text-white'
                                }`}>
                                  {cameraResult}
                                </span>
                              </div>
                              
                              <div className="mt-8">
                                <QuantumButton onClick={startMentalQuestion} className="px-8">
                                  Volver a preguntar
                                </QuantumButton>
                              </div>
                            </motion.div>
                          )}
                          
                          {!askingMental && !cameraResult && (
                            <div className="text-center">
                              <p className="text-lg mb-6">Piensa en una pregunta que pueda responderse con SÍ o NO</p>
                              <QuantumButton onClick={startMentalQuestion} disabled={askingMental}>
                                Iniciar Pregunta Mental
                              </QuantumButton>
                            </div>
                          )}
                        </>
                      ) : (
                        // Diagnóstico por área UI
                        <>
                          {selectedArea ? (
                            <>
                              <div className="text-lg mb-6">
                                Diagnosticando: <span className="font-semibold">{selectedArea}</span>
                              </div>
                              
                              <div className="relative w-full h-[200px] flex items-center justify-center">
                                {/* Círculo de energía de fondo */}
                                <div className="absolute w-48 h-48 rounded-full bg-quantum-gradient-soft opacity-30 animate-pulse-soft"></div>
                                
                                {/* Línea central */}
                                <div className="absolute h-[150px] w-[2px] bg-quantum-gradient opacity-40"></div>
                                
                                {/* Video de la cámara (oculto) */}
                                {useCameraMode && (
                                  <video 
                                    ref={videoRef}
                                    autoPlay 
                                    playsInline
                                    className="hidden"
                                  />
                                )}
                                
                                {/* Péndulo holográfico */}
                                <motion.div
                                  className="absolute top-0 w-1 h-[150px]"
                                  style={{ 
                                    transformOrigin: 'top center',
                                    rotate: `${pendulumAngle}deg` 
                                  }}
                                  animate={{ 
                                    rotate: isPendulumSwinging ? ['-30deg', '30deg', '-30deg'] : '0deg' 
                                  }}
                                  transition={{
                                    duration: 2,
                                    ease: "easeInOut",
                                    repeat: isPendulumSwinging ? Infinity : 0
                                  }}
                                >
                                  <div className="w-1 h-[150px] bg-gradient-to-b from-quantum-primary/50 to-quantum-primary/10 relative">
                                    {/* Hilo del péndulo */}
                                    <div className="absolute inset-0 w-full h-full bg-white/10"></div>
                                    
                                    {/* Orbe del péndulo */}
                                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-16 h-16">
                                      {/* Capas del orbe para efecto holográfico */}
                                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 animate-pulse"></div>
                                      <div className="absolute inset-1 rounded-full bg-gradient-to-br from-purple-600/30 to-blue-600/30 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                                      <div className="absolute inset-2 rounded-full bg-gradient-to-br from-purple-700/40 to-blue-700/40 animate-pulse" style={{animationDelay: '0.4s'}}></div>
                                      <div className="absolute inset-3 rounded-full bg-gradient-to-br from-quantum-vividpurple/70 to-blue-400/70 backdrop-blur-sm border border-white/20 shadow-[0_0_15px_rgba(138,43,226,0.7)]"></div>
                                      
                                      {/* Símbolo en el centro del orbe */}
                                      <div className="absolute inset-0 flex items-center justify-center text-white text-lg font-bold holographic-gradient">
                                        Q
                                      </div>
                                      
                                      {/* Destellos de luz */}
                                      <div className="absolute top-1/4 left-1/4 w-1 h-1 rounded-full bg-white animate-pulse"></div>
                                      <div className="absolute top-3/4 right-1/4 w-2 h-2 rounded-full bg-white animate-pulse" style={{animationDelay: '0.6s'}}></div>
                                    </div>
                                  </div>
                                </motion.div>
                              </div>
                              
                              {diagnosisResult && (
                                <motion.div 
                                  className="text-center mt-8"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.5 }}
                                >
                                  <div className="text-2xl font-semibold mb-2">
                                    Resultado del Diagnóstico: {diagnosisResult}
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
                                    Tu {selectedArea} está al {diagnosisPercentage}% del nivel óptimo
                                  </div>
                                  
                                  {cameraResult && (
                                    <div className="mt-4 text-xl font-bold">
                                      <span className={`px-4 py-2 rounded-full ${cameraResult === 'SI' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                                        {cameraResult}
                                      </span>
                                    </div>
                                  )}
                                  
                                  <div className="mt-6">
                                    <QuantumButton onClick={() => startMotionDiagnosis(selectedArea)}>
                                      Diagnosticar de Nuevo
                                    </QuantumButton>
                                  </div>
                                </motion.div>
                              )}
                              
                              {(isPendulumSwinging || processingCamera) && (
                                <div className="text-muted-foreground animate-pulse mt-8">
                                  {useCameraMode ? "Analizando movimiento del dispositivo..." : "Analizando patrones energéticos..."}
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
                              <p className="mb-4">Selecciona un área para comenzar tu diagnóstico energético</p>
                              <p className="text-sm">El péndulo virtual te ayudará a identificar desequilibrios en tu campo energético</p>
                              
                              {useCameraMode && (
                                <div className="mt-6">
                                  <QuantumButton onClick={toggleCamera} variant="outline">
                                    {isCameraActive ? "Detener Cámara" : "Probar Cámara"}
                                  </QuantumButton>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="dowsing" className="w-full">
              <Card className="quantum-card p-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Escáner Completo de Campo Energético</h3>
                  <p className="text-muted-foreground mb-8">
                    El escáner energético avanzado utiliza principios radiónicos para proporcionar una evaluación integral de todo tu campo energético.
                  </p>
                  
                  <div className="relative w-64 h-64 mx-auto mb-8">
                    <div className="absolute inset-0 rounded-full border-4 border-dashed border-quantum-primary/20 animate-spin-slow"></div>
                    <div className="absolute inset-4 rounded-full border-4 border-dashed border-quantum-primary/30 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '6s' }}></div>
                    <div className="absolute inset-8 rounded-full border-4 border-dashed border-quantum-primary/40 animate-spin-slow"></div>
                    <div className="absolute inset-12 rounded-full border-4 border-dashed border-quantum-primary/50 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '4s' }}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-quantum-primary font-bold text-lg">Próximamente</div>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">
                    Nuestro escáner avanzado está actualmente en desarrollo y estará disponible en la próxima actualización.
                  </p>
                  
                  <QuantumButton disabled>Recibir Notificación cuando esté Disponible</QuantumButton>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

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

      <section className="py-12 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para Profundizar?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Después del diagnóstico, pasa a nuestro módulo de tratamiento para abordar cualquier desequilibrio con terapia de frecuencia dirigida.
          </p>
          <QuantumButton>Explorar Tratamientos</QuantumButton>
        </div>
      </section>
    </Layout>
  );
};

// Missing Label component
const Label = ({ children, htmlFor, className, ...props }: { 
  children: React.ReactNode; 
  htmlFor?: string;
  className?: string;
  [key: string]: any;
}) => (
  <label htmlFor={htmlFor} className={`text-sm font-medium ${className || ''}`} {...props}>
    {children}
  </label>
);

export default Diagnose;
