
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, User, Mail, Lock, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { NewUserForm } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';

interface AddUserFormProps {
  onAddUser: (user: NewUserForm) => void;
  onCancel: () => void;
}

const AddUserForm = ({ onAddUser, onCancel }: AddUserFormProps) => {
  const { toast } = useToast();
  const [newUser, setNewUser] = useState<NewUserForm>({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleAddUser = () => {
    setError('');
    
    // Validations
    if (!newUser.name || !newUser.email || !newUser.password) {
      setError('Todos los campos son obligatorios');
      return;
    }
    
    if (newUser.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    onAddUser(newUser);
  };

  return (
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
          onClick={onCancel}
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
  );
};

export default AddUserForm;
