import { Button } from '@/components/ui/button';
import { LogOut, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

interface AdminHeaderProps {
  userName: string;
  userCount: number;
  onLogout: () => void;
  onSync: () => void;
}

const AdminHeader = ({ userName, userCount, onLogout, onSync }: AdminHeaderProps) => {
  const { t } = useLanguage();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8 flex justify-between items-center"
    >
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('admin.title')}</h1>
        <p className="text-muted-foreground">{t('admin.welcome')}, {userName}</p>
        <p className="text-sm text-green-600 mt-1">{t('admin.registeredUsers')}: {userCount}</p>
      </div>
      <div className="flex gap-3">
        <Button 
          onClick={onSync}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
        >
          <RefreshCw size={16} />
          {t('admin.updateList')}
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={onLogout}
        >
          <LogOut size={16} />
          {t('nav.logout')}
        </Button>
      </div>
    </motion.div>
  );
};

export default AdminHeader;
