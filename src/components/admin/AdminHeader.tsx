
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminHeaderProps {
  userName: string;
  onLogout: () => void;
  onSync: () => void;
}

const AdminHeader = ({ userName, onLogout, onSync }: AdminHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8 flex justify-between items-center"
    >
      <div>
        <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
        <p className="text-muted-foreground">Bienvenido, {userName}</p>
      </div>
      <div className="flex gap-3">
        <Button 
          onClick={onSync}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
        >
          Actualizar Lista
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={onLogout}
        >
          <LogOut size={16} />
          Cerrar sesión
        </Button>
      </div>
    </motion.div>
  );
};

export default AdminHeader;
