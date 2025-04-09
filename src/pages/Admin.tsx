
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, User, Mail, Lock, Plus, Trash2, LogOut, UserPlus, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  password: string;
  dateCreated: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    // Comprobar si el usuario está autenticado y es administrador
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser && parsedUser.isAdmin) {
        setUser(parsedUser);
        // Cargar usuarios simulados
        loadUsers();
      } else {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const loadUsers = () => {
    // Simulación de carga de usuarios para propósitos de demostración
    const demoUsers: AdminUser[] = [
      {
        id: '1',
        name: 'Cliente Demo',
        email: 'cliente@example.com',
        password: '********',
        dateCreated: '2023-04-01'
      },
      {
        id: '2',
        name: 'Ana García',
        email: 'ana@example.com',
        password: '********',
        dateCreated: '2023-05-15'
      }
    ];
    setUsers(demoUsers);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleAddUser = () => {
    setError('');
    
    // Validaciones
    if (!newUser.name || !newUser.email || !newUser.password) {
      setError('Todos los campos son obligatorios');
      return;
    }
    
    if (newUser.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    // Simulación de agregar un usuario
    const newId = (users.length + 1).toString();
    const currentDate = new Date().toISOString().split('T')[0];
    
    const addedUser: AdminUser = {
      id: newId,
      name: newUser.name,
      email: newUser.email,
      password: '********', // Ocultamos la contraseña en la interfaz
      dateCreated: currentDate
    };
    
    setUsers([...users, addedUser]);
    setNewUser({
      name: '',
      email: '',
      password: ''
    });
    setShowAddForm(false);
  };

  const handleDeleteUser = (id: string) => {
    // Filtrar el usuario a eliminar
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
            <p className="text-muted-foreground">Bienvenido, {user.name}</p>
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Cerrar sesión
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Gestión de Usuarios</h2>
              <Button 
                className="bg-gradient-to-r from-purple-600 to-blue-500 flex items-center gap-2"
                onClick={() => setShowAddForm(true)}
                disabled={showAddForm}
              >
                <Plus size={16} />
                Añadir Usuario
              </Button>
            </div>

            {showAddForm && (
              <motion.div 
                className="mb-6 p-4 border rounded-lg"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Nuevo Usuario</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={() => setShowAddForm(false)}
                  >
                    <X size={16} />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        type="text"
                        placeholder="Nombre completo"
                        value={newUser.name}
                        onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        type="email"
                        placeholder="Correo electrónico"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        type="password"
                        placeholder="Contraseña"
                        value={newUser.password}
                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg flex items-start mb-4">
                    <AlertCircle className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button 
                    className="flex items-center gap-2"
                    onClick={handleAddUser}
                  >
                    <Save size={16} />
                    Guardar Usuario
                  </Button>
                </div>
              </motion.div>
            )}

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Contraseña</TableHead>
                    <TableHead>Fecha Creación</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.password}</TableCell>
                      <TableCell>{user.dateCreated}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Admin;
