
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState('');

  // Redirigir si ya está autenticado
  if (isAuthenticated) {
    // Redirigir a admin si es administrador, de lo contrario al diagnóstico
    if (user?.isAdmin) {
      navigate('/admin');
    } else {
      navigate('/diagnose');
    }
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      
      if (success) {
        toast({
          title: "Inicio de sesión exitoso",
          description: "Bienvenido a QuantumSync",
        });
        
        // No necesitamos redireccionar aquí porque el componente se volverá a renderizar
        // y la redirección se hará por el bloque condicional al inicio
      } else {
        setError('Usuario o contraseña incorrectos');
        toast({
          variant: "destructive",
          title: "Error de inicio de sesión",
          description: "Usuario o contraseña incorrectos",
        });
      }
    } catch (err) {
      console.error("Error durante el inicio de sesión:", err);
      setError('Ocurrió un error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleRecoveryRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setRecoveryMessage('');
    
    if (!recoveryEmail) {
      setRecoveryMessage('Por favor ingresa tu correo electrónico');
      setLoading(false);
      return;
    }
    
    // Verificar si el correo existe en la lista de usuarios
    const storedUsersList = localStorage.getItem('usersList');
    if (storedUsersList) {
      const usersList = JSON.parse(storedUsersList);
      const user = usersList.find((u: any) => u.email.toLowerCase() === recoveryEmail.toLowerCase());
      
      if (user) {
        // En un caso real, aquí enviaríamos un correo con un enlace de recuperación
        // Como es una simulación, mostraremos la contraseña directamente
        setRecoveryMessage(`Tu contraseña es: ${user.password}`);
        toast({
          title: "Recuperación exitosa",
          description: `Se ha encontrado una cuenta con el correo ${recoveryEmail}. La contraseña se muestra a continuación.`,
        });
      } else {
        setRecoveryMessage('No se encontró ninguna cuenta con este correo electrónico');
        toast({
          variant: "destructive",
          title: "Error de recuperación",
          description: "No se encontró ninguna cuenta con este correo electrónico",
        });
      }
    } else {
      setRecoveryMessage('No hay usuarios registrados en el sistema');
    }
    
    setLoading(false);
  };

  const toggleRecoveryMode = () => {
    setShowRecovery(!showRecovery);
    setError('');
    setRecoveryMessage('');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="p-6 shadow-xl">
            {showRecovery ? (
              <div>
                <div className="flex items-center mb-6">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mr-2 p-0 h-8 w-8"
                    onClick={toggleRecoveryMode}
                  >
                    <ArrowLeft size={16} />
                  </Button>
                  <h2 className="text-xl font-bold">Recuperar Contraseña</h2>
                </div>
                
                <form onSubmit={handleRecoveryRequest} className="space-y-4">
                  <div>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <Input
                        type="email"
                        placeholder="Correo electrónico"
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  {recoveryMessage && (
                    <div className={`p-3 rounded-lg flex items-start ${
                      recoveryMessage.includes('Tu contraseña es') 
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                        : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    }`}>
                      <AlertCircle className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
                      <p className="text-sm">{recoveryMessage}</p>
                    </div>
                  )}
                  
                  <Button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Cargando...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Recuperar Contraseña
                      </span>
                    )}
                  </Button>
                </form>
              </div>
            ) : (
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-1 mb-6">
                  <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <Input
                          type="email"
                          placeholder="Correo electrónico"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <Input
                          type="password"
                          placeholder="Contraseña"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={toggleRecoveryMode}
                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                    </div>
                    
                    {error && (
                      <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg flex items-start">
                        <AlertCircle className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
                        <p className="text-sm">{error}</p>
                      </div>
                    )}
                    
                    <Button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Cargando...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <LogIn className="mr-2 h-5 w-5" />
                          Iniciar Sesión
                        </span>
                      )}
                    </Button>
                    
                    <div className="text-center text-sm text-muted-foreground mt-4">
                      <p>¿No tienes una cuenta? Contacta con el administrador después de realizar tu pago.</p>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            )}
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Login;
