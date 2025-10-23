import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { addUserDirectly } from '@/utils/addUserDirectly';
import { CheckCircle } from 'lucide-react';

/**
 * Página administrativa temporal para agregar usuarios directamente
 * Solo accesible para el administrador
 */
const AddUserAdmin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Verificar que sea el admin
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (!user.isAdmin) {
        navigate('/');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleAddMariana = async () => {
    setLoading(true);
    try {
      const result = await addUserDirectly(
        'marianasalvatore@hotmail.com',
        'mariana2025',
        'Mariana'
      );

      if (result.success) {
        setAdded(true);
        toast({
          title: "Usuario agregado",
          description: "Mariana ha sido agregada al sistema correctamente.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Hubo un problema al agregar el usuario. Puede que ya exista.",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al agregar el usuario.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (added) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        <Card className="p-8 max-w-md text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Usuario Agregado</h2>
          <p className="text-muted-foreground mb-6">
            Mariana ha sido agregada exitosamente al sistema.
          </p>
          <div className="space-y-2 text-sm text-left mb-6">
            <p><strong>Email:</strong> marianasalvatore@hotmail.com</p>
            <p><strong>Contraseña:</strong> mariana2025</p>
            <p><strong>Nombre:</strong> Mariana</p>
          </div>
          <Button onClick={() => navigate('/admin')}>
            Volver al Panel de Administración
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
      <Card className="p-8 max-w-md">
        <h1 className="text-2xl font-bold mb-4">Agregar Usuario</h1>
        <p className="text-muted-foreground mb-6">
          Esta es una página administrativa para agregar el usuario de Mariana Salvatore al sistema.
        </p>
        <div className="space-y-2 text-sm mb-6 p-4 bg-muted rounded-lg">
          <p><strong>Email:</strong> marianasalvatore@hotmail.com</p>
          <p><strong>Contraseña:</strong> mariana2025</p>
          <p><strong>Nombre:</strong> Mariana</p>
        </div>
        <Button 
          onClick={handleAddMariana}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Agregando...' : 'Agregar Usuario'}
        </Button>
        <Button 
          variant="outline"
          onClick={() => navigate('/admin')}
          className="w-full mt-2"
        >
          Cancelar
        </Button>
      </Card>
    </div>
  );
};

export default AddUserAdmin;
