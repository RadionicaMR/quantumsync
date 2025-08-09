
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { AlertCircle, Mail, Lock, User, UserPlus, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log(`[FORM] Iniciando proceso de registro para: ${name} - ${email}`);

    // Validaciones básicas
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Todos los campos son obligatorios');
      setLoading(false);
      return;
    }

    try {
      console.log(`[FORM] Llamando a la función register del contexto`);
      // Usar la función de registro del contexto de autenticación
      const success = await register(name.trim(), email.trim(), password);
      
      console.log(`[FORM] Resultado del registro: ${success}`);
      
      if (success) {
        console.log(`[FORM] Registro exitoso, mostrando mensaje de éxito`);
        setRegistered(true);
        toast({
          title: "Registro exitoso",
          description: "Tu cuenta ha sido creada correctamente.",
        });
      } else {
        console.log(`[FORM] Registro falló, mostrando error`);
        setError('El correo electrónico ya está registrado o hubo un problema con el registro.');
        toast({
          variant: "destructive",
          title: "Error de registro",
          description: "No se pudo completar el registro. El correo ya puede estar en uso.",
        });
      }
    } catch (error) {
      console.error('[FORM] Error durante el registro:', error);
      setError('Ocurrió un error al registrar la cuenta.');
    } finally {
      setLoading(false);
    }
  };

  if (registered) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[80vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <Card className="p-6 shadow-xl text-center">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">¡Registro exitoso!</h2>
              <p className="text-muted-foreground mb-6">
                Tu cuenta ha sido creada correctamente. Ahora puedes acceder a todas las funcionalidades de QuantumSync.
              </p>
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                onClick={() => navigate('/diagnose')}
              >
                Comenzar a usar QuantumSync
              </Button>
            </Card>
          </motion.div>
        </div>
      </Layout>
    );
  }

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
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">Crear tu cuenta</h1>
              <p className="text-muted-foreground">
                Completa el formulario para acceder a todas las funcionalidades
              </p>
            </div>
            
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Nombre completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
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
              
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    type="password"
                    placeholder="Confirmar contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
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
                    Registrando...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <UserPlus className="mr-2 h-5 w-5" />
                    Crear cuenta
                  </span>
                )}
              </Button>
              
              <div className="text-center text-sm text-muted-foreground mt-4">
                <p>¿Ya tienes una cuenta? <Link to="/login" className="text-primary hover:underline">Iniciar sesión</Link></p>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Register;
