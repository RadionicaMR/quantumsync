import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, UserPlus } from 'lucide-react';
import { PaymentMethod } from '@/types/affiliate';

interface CreateAffiliateDialogProps {
  onSuccess: () => void;
}

const CreateAffiliateDialog = ({ onSuccess }: CreateAffiliateDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    country: 'Argentina',
    payment_method: 'mercadopago' as PaymentMethod,
    paypal_email: '',
    mercadopago_alias: '',
    mercadopago_cvu: '',
  });

  const generateAffiliateCode = (name: string) => {
    const cleanName = name.split(' ')[0].toUpperCase().slice(0, 8);
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${cleanName}${randomPart}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create the auth user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/affiliate-login`,
          data: {
            full_name: formData.name,
          }
        }
      });

      if (signUpError) {
        // If user already exists, try to get the user and create affiliate record
        if (signUpError.message.includes('already registered')) {
          toast({
            variant: 'destructive',
            title: 'Usuario ya existe',
            description: 'Este email ya está registrado. Verifica si ya tiene un registro de afiliado.'
          });
          setLoading(false);
          return;
        }
        throw signUpError;
      }

      if (!authData.user) {
        throw new Error('No se pudo crear el usuario');
      }

      // 2. Create the affiliate record directly (as admin)
      const affiliateCode = generateAffiliateCode(formData.name);
      
      const { error: affiliateError } = await supabase
        .from('affiliates')
        .insert({
          user_id: authData.user.id,
          name: formData.name,
          email: formData.email,
          country: formData.country,
          payment_method: formData.payment_method,
          paypal_email: formData.payment_method === 'paypal' ? formData.paypal_email : null,
          mercadopago_alias: formData.payment_method === 'mercadopago' ? formData.mercadopago_alias : null,
          mercadopago_cvu: formData.payment_method === 'mercadopago' ? formData.mercadopago_cvu : null,
          affiliate_code: affiliateCode,
          status: 'active',
        });

      if (affiliateError) throw affiliateError;

      toast({
        title: 'Afiliado creado',
        description: `${formData.name} fue agregado con código: ${affiliateCode}`
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        country: 'Argentina',
        payment_method: 'mercadopago',
        paypal_email: '',
        mercadopago_alias: '',
        mercadopago_cvu: '',
      });
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error('Error creating affiliate:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo crear el afiliado'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-600 to-indigo-500 flex items-center gap-2">
          <UserPlus size={16} />
          Crear Afiliado
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Afiliado</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre completo *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
            />
            <p className="text-xs text-muted-foreground">Mínimo 6 caracteres</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">País *</Label>
            <Select
              value={formData.country}
              onValueChange={(value) => setFormData({ ...formData, country: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Argentina">Argentina</SelectItem>
                <SelectItem value="México">México</SelectItem>
                <SelectItem value="España">España</SelectItem>
                <SelectItem value="Colombia">Colombia</SelectItem>
                <SelectItem value="Chile">Chile</SelectItem>
                <SelectItem value="Perú">Perú</SelectItem>
                <SelectItem value="Estados Unidos">Estados Unidos</SelectItem>
                <SelectItem value="Otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_method">Método de pago *</Label>
            <Select
              value={formData.payment_method}
              onValueChange={(value: PaymentMethod) => setFormData({ ...formData, payment_method: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mercadopago">MercadoPago</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.payment_method === 'paypal' && (
            <div className="space-y-2">
              <Label htmlFor="paypal_email">Email de PayPal</Label>
              <Input
                id="paypal_email"
                type="email"
                value={formData.paypal_email}
                onChange={(e) => setFormData({ ...formData, paypal_email: e.target.value })}
              />
            </div>
          )}

          {formData.payment_method === 'mercadopago' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="mercadopago_alias">Alias MercadoPago</Label>
                <Input
                  id="mercadopago_alias"
                  value={formData.mercadopago_alias}
                  onChange={(e) => setFormData({ ...formData, mercadopago_alias: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mercadopago_cvu">CVU MercadoPago</Label>
                <Input
                  id="mercadopago_cvu"
                  value={formData.mercadopago_cvu}
                  onChange={(e) => setFormData({ ...formData, mercadopago_cvu: e.target.value })}
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                'Crear Afiliado'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAffiliateDialog;
