
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { addAffiliate } from '@/utils/affiliateStorage';
import { AffiliateRegistrationForm } from '@/types/affiliate';

export const useAffiliateRegistration = () => {
  const { toast } = useToast();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  const handleSubmit = async (formData: AffiliateRegistrationForm & { confirmPassword: string }) => {
    setLoading(true);
    setError('');

    // Validations
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const newAffiliate = addAffiliate({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      setRegistered(true);
      toast({
        title: "Solicitud enviada",
        description: "Tu solicitud de afiliado ha sido enviada para revisión.",
      });
    } catch (error: any) {
      setError(error.message || 'Error al registrar el afiliado');
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || 'No se pudo completar el registro',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    handleSubmit,
    error,
    loading,
    registered
  };
};
