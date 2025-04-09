
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, User, Mail, Lock, Plus, Trash2, LogOut, Save, X, Eye, EyeOff, Edit } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  password: string;
  dateCreated: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  // Cargar usuarios desde localStorage - mejorado para detectar cambios
  const loadUsers = () => {
    const storedUsersList = localStorage.getItem('usersList');
    if (storedUsersList) {
      try {
        const parsedUsers = JSON.parse(storedUsersList);
        
        // Verificar que los datos sean válidos y tengan la estructura esperada
        if (Array.isArray(parsedUsers)) {
          // Asegurar que cada usuario tenga los campos requeridos
          const validUsers = parsedUsers.map((user, index) => {
            // Si el usuario no tiene un ID, le asignamos uno
            if (!user.id) {
              user.id = (index + 1).toString();
            }
            
            // Si el usuario no tiene fecha de creación, le asignamos la fecha actual
            if (!user.dateCreated) {
              user.dateCreated = new Date().toISOString().split('T')[0];
            }
            
            return user;
          });
          
          // Guardar la lista validada
          setUsers(validUsers);
          localStorage.setItem('usersList', JSON.stringify(validUsers));
        } else {
          console.error('El formato de los usuarios almacenados no es válido (no es un array).');
          initializeDefaultUsers();
        }
      } catch (error) {
        console.error('Error parsing users from localStorage:', error);
        // Si hay un error, inicializamos con usuarios por defecto
        initializeDefaultUsers();
      }
    } else {
      // Si no hay usuarios guardados, inicializar con valores por defecto
      initializeDefaultUsers();
    }
  };

  // Inicializar con usuarios por defecto
  const initializeDefaultUsers = () => {
    const defaultUsers: AdminUser[] = [
      {
        id: '1',
        name: 'Cliente Demo',
        email: 'cliente@example.com',
        password: 'password123', // En producción real, esto estaría hasheado
        dateCreated: '2023-04-01'
      },
      {
        id: '2',
        name: 'Ana García',
        email: 'ana@example.com',
        password: 'ana12345',
        dateCreated: '2023-05-15'
      }
    ];
    setUsers(defaultUsers);
    localStorage.setItem('usersList', JSON.stringify(defaultUsers));
  };

  // Guardar usuarios en localStorage
  const saveUsers = (updatedUsers: AdminUser[]) => {
    localStorage.setItem('usersList', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  // Función para sincronizar cualquier usuario nuevo que se haya registrado
  const syncRegisteredUsers = () => {
    const storedUsersList = localStorage.getItem('usersList');
    if (!storedUsersList) return;
    
    try {
      const currentUsers = JSON.parse(storedUsersList);
      
      // Asegurar que el listado esté actualizado
      saveUsers(currentUsers);
      
      toast({
        title: "Lista de usuarios actualizada",
        description: `Se han actualizado los usuarios. Total: ${currentUsers.length}`,
      });
    } catch (error) {
      console.error('Error syncing registered users:', error);
    }
  };

  useEffect(() => {
    // Comprobar si el usuario está autenticado y es administrador
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser && parsedUser.isAdmin) {
        setUser(parsedUser);
        // Cargar usuarios
        loadUsers();
        
        // Configurar un intervalo para refrescar los usuarios periódicamente
        const interval = setInterval(() => {
          loadUsers();
        }, 30000); // Recargar cada 30 segundos
        
        return () => clearInterval(interval);
      } else {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

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

    // Verificar si el email ya existe
    if (users.some(user => user.email === newUser.email)) {
      setError('Este correo electrónico ya está registrado');
      return;
    }
    
    // Determinar el próximo ID disponible
    const maxId = users.length > 0 
      ? Math.max(...users.map(user => parseInt(user.id)))
      : 0;
    const newId = (maxId + 1).toString();
    
    const currentDate = new Date().toISOString().split('T')[0];
    
    const addedUser: AdminUser = {
      id: newId,
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      dateCreated: currentDate
    };
    
    const updatedUsers = [...users, addedUser];
    saveUsers(updatedUsers);
    
    toast({
      title: "Usuario agregado",
      description: `El usuario ${newUser.name} ha sido creado exitosamente`,
    });
    
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
    saveUsers(updatedUsers);
    
    toast({
      title: "Usuario eliminado",
      description: "El usuario ha sido eliminado exitosamente",
    });
  };

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const startPasswordEdit = (userId: string) => {
    setEditingUser(userId);
    const user = users.find(u => u.id === userId);
    if (user) {
      setNewPassword(user.password);
    }
  };

  const saveNewPassword = (userId: string) => {
    if (newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
      });
      return;
    }

    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return { ...user, password: newPassword };
      }
      return user;
    });

    saveUsers(updatedUsers);
    setEditingUser(null);
    setNewPassword('');

    toast({
      title: "Contraseña actualizada",
      description: "La contraseña ha sido actualizada exitosamente",
    });
  };

  const cancelPasswordEdit = () => {
    setEditingUser(null);
    setNewPassword('');
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
          <div className="flex gap-3">
            <Button 
              onClick={syncRegisteredUsers}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              Actualizar Lista
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Cerrar sesión
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold">Gestión de Usuarios</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Total de usuarios: {users.length}
                </p>
              </div>
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
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No hay usuarios registrados
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {editingUser === user.id ? (
                            <div className="flex items-center gap-2">
                              <Input
                                type="text"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="max-w-[150px]"
                              />
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 w-8 p-0 text-green-500"
                                onClick={() => saveNewPassword(user.id)}
                              >
                                <Save size={16} />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 w-8 p-0 text-red-500"
                                onClick={cancelPasswordEdit}
                              >
                                <X size={16} />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span>{showPasswords[user.id] ? user.password : '********'}</span>
                              <Button 
                                size="sm"
                                variant="ghost" 
                                className="h-8 w-8 p-0 text-muted-foreground"
                                onClick={() => togglePasswordVisibility(user.id)}
                              >
                                {showPasswords[user.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                              </Button>
                              <Button 
                                size="sm"
                                variant="ghost" 
                                className="h-8 w-8 p-0 text-blue-500"
                                onClick={() => startPasswordEdit(user.id)}
                              >
                                <Edit size={16} />
                              </Button>
                            </div>
                          )}
                        </TableCell>
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
                    ))
                  )}
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
