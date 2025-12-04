
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Mail, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';

interface PasswordRecoveryFormProps {
  onBack: () => void;
}

const PasswordRecoveryForm = ({ onBack }: PasswordRecoveryFormProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRecoveryRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setRecoveryMessage('');
    
    if (!recoveryEmail) {
      setRecoveryMessage(t('auth.enterEmail'));
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
        setRecoveryMessage(`${t('auth.yourPassword')}: ${user.password}`);
        toast({
          title: t('auth.recoverySuccess'),
          description: `${t('auth.recoverySuccessDesc')} ${recoveryEmail}.`,
        });
      } else {
        setRecoveryMessage(t('auth.noUserFound'));
        toast({
          variant: "destructive",
          title: t('auth.recoveryError'),
          description: t('auth.noUserFound'),
        });
      }
    } else {
      setRecoveryMessage(t('auth.noUsersRegistered'));
    }
    
    setLoading(false);
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2 p-0 h-8 w-8"
          onClick={onBack}
        >
          <ArrowLeft size={16} />
        </Button>
        <h2 className="text-xl font-bold">{t('auth.recoverPassword')}</h2>
      </div>
      
      <form onSubmit={handleRecoveryRequest} className="space-y-4">
        <div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="email"
              placeholder={t('auth.email')}
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>
        
        {recoveryMessage && (
          <div className={`p-3 rounded-lg flex items-start ${
            recoveryMessage.includes(t('auth.yourPassword')) 
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
              {t('common.loading')}
            </span>
          ) : (
            <span className="flex items-center">
              {t('auth.recoverPassword')}
            </span>
          )}
        </Button>
      </form>
    </div>
  );
};

export default PasswordRecoveryForm;
