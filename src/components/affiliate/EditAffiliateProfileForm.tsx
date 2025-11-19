import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Affiliate, PaymentMethod } from '@/types/affiliate';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';
import { Save } from 'lucide-react';

interface EditAffiliateProfileFormProps {
  affiliate: Affiliate;
  onSuccess: () => void;
}

const affiliateSchema = z.object({
  name: z.string().trim().min(1, { message: "Nombre es requerido" }).max(100, { message: "Nombre debe tener menos de 100 caracteres" }),
  country: z.string().trim().min(1, { message: "País es requerido" }).max(100, { message: "País debe tener menos de 100 caracteres" }),
  payment_method: z.enum(['paypal', 'mercadopago']),
  paypal_email: z.string().trim().email({ message: "Email de PayPal inválido" }).max(255, { message: "Email debe tener menos de 255 caracteres" }).optional().or(z.literal('')),
  mercadopago_alias: z.string().trim().max(100, { message: "Alias debe tener menos de 100 caracteres" }).optional().or(z.literal('')),
  mercadopago_cvu: z.string().trim().max(50, { message: "CVU debe tener menos de 50 caracteres" }).optional().or(z.literal('')),
});

const EditAffiliateProfileForm = ({ affiliate, onSuccess }: EditAffiliateProfileFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    country: string;
    payment_method: PaymentMethod;
    paypal_email: string;
    mercadopago_alias: string;
    mercadopago_cvu: string;
  }>({
    name: affiliate.name,
    country: affiliate.country,
    payment_method: affiliate.payment_method,
    paypal_email: affiliate.paypal_email || '',
    mercadopago_alias: affiliate.mercadopago_alias || '',
    mercadopago_cvu: affiliate.mercadopago_cvu || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData({
      name: affiliate.name,
      country: affiliate.country,
      payment_method: affiliate.payment_method,
      paypal_email: affiliate.paypal_email || '',
      mercadopago_alias: affiliate.mercadopago_alias || '',
      mercadopago_cvu: affiliate.mercadopago_cvu || '',
    });
    setErrors({});
  }, [affiliate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validatedData = affiliateSchema.parse(formData);

      // Validación adicional según método de pago
      if (validatedData.payment_method === 'paypal' && !validatedData.paypal_email) {
        setErrors({ paypal_email: 'Email de PayPal es requerido' });
        return;
      }
      if (validatedData.payment_method === 'mercadopago' && (!validatedData.mercadopago_alias || !validatedData.mercadopago_cvu)) {
        setErrors({ 
          mercadopago_alias: !validatedData.mercadopago_alias ? 'Alias es requerido' : '',
          mercadopago_cvu: !validatedData.mercadopago_cvu ? 'CVU es requerido' : '',
        });
        return;
      }

      setLoading(true);

      const updateData: any = {
        name: validatedData.name,
        country: validatedData.country,
        payment_method: validatedData.payment_method,
      };

      if (validatedData.payment_method === 'paypal') {
        updateData.paypal_email = validatedData.paypal_email;
        updateData.mercadopago_alias = null;
        updateData.mercadopago_cvu = null;
      } else {
        updateData.mercadopago_alias = validatedData.mercadopago_alias;
        updateData.mercadopago_cvu = validatedData.mercadopago_cvu;
        updateData.paypal_email = null;
      }

      const { error } = await supabase
        .from('affiliates')
        .update(updateData)
        .eq('id', affiliate.id);

      if (error) throw error;

      toast({
        title: "Perfil actualizado",
        description: "Tus datos han sido actualizados exitosamente.",
      });

      onSuccess();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        console.error('Error al actualizar perfil:', error);
        toast({
          variant: 'destructive',
          title: "Error",
          description: "No se pudo actualizar el perfil.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="country">País</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className={errors.country ? 'border-destructive' : ''}
            />
            {errors.country && <p className="text-sm text-destructive mt-1">{errors.country}</p>}
          </div>

          <div>
            <Label htmlFor="payment_method">Método de Pago</Label>
            <Select
              value={formData.payment_method}
              onValueChange={(value) => setFormData({ ...formData, payment_method: value as PaymentMethod })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="mercadopago">Mercado Pago</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.payment_method === 'paypal' && (
            <div>
              <Label htmlFor="paypal_email">Email de PayPal</Label>
              <Input
                id="paypal_email"
                type="email"
                value={formData.paypal_email}
                onChange={(e) => setFormData({ ...formData, paypal_email: e.target.value })}
                placeholder="tu@email.com"
                className={errors.paypal_email ? 'border-destructive' : ''}
              />
              {errors.paypal_email && <p className="text-sm text-destructive mt-1">{errors.paypal_email}</p>}
            </div>
          )}

          {formData.payment_method === 'mercadopago' && (
            <>
              <div>
                <Label htmlFor="mercadopago_alias">Alias de Mercado Pago</Label>
                <Input
                  id="mercadopago_alias"
                  value={formData.mercadopago_alias}
                  onChange={(e) => setFormData({ ...formData, mercadopago_alias: e.target.value })}
                  placeholder="tu.alias.mp"
                  className={errors.mercadopago_alias ? 'border-destructive' : ''}
                />
                {errors.mercadopago_alias && <p className="text-sm text-destructive mt-1">{errors.mercadopago_alias}</p>}
              </div>
              <div>
                <Label htmlFor="mercadopago_cvu">CVU de Mercado Pago</Label>
                <Input
                  id="mercadopago_cvu"
                  value={formData.mercadopago_cvu}
                  onChange={(e) => setFormData({ ...formData, mercadopago_cvu: e.target.value })}
                  placeholder="0000003100000000000000"
                  className={errors.mercadopago_cvu ? 'border-destructive' : ''}
                />
                {errors.mercadopago_cvu && <p className="text-sm text-destructive mt-1">{errors.mercadopago_cvu}</p>}
              </div>
            </>
          )}
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Guardando...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Guardar Cambios
            </span>
          )}
        </Button>
      </form>
    </Card>
  );
};

export default EditAffiliateProfileForm;
