import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Affiliate, PaymentMethod } from '@/types/affiliate';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

interface EditAffiliateDialogProps {
  affiliate: Affiliate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const affiliateSchema = z.object({
  payment_method: z.enum(['paypal', 'mercadopago']),
  paypal_email: z.string().trim().email({ message: "Email de PayPal inválido" }).max(255, { message: "Email debe tener menos de 255 caracteres" }).optional().or(z.literal('')),
  mercadopago_alias: z.string().trim().max(100, { message: "Alias debe tener menos de 100 caracteres" }).optional().or(z.literal('')),
  mercadopago_cvu: z.string().trim().max(50, { message: "CVU debe tener menos de 50 caracteres" }).optional().or(z.literal('')),
});

const EditAffiliateDialog = ({ affiliate, open, onOpenChange, onSuccess }: EditAffiliateDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    payment_method: PaymentMethod;
    paypal_email: string;
    mercadopago_alias: string;
    mercadopago_cvu: string;
  }>({
    payment_method: 'paypal',
    paypal_email: '',
    mercadopago_alias: '',
    mercadopago_cvu: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (affiliate) {
      setFormData({
        payment_method: affiliate.payment_method,
        paypal_email: affiliate.paypal_email || '',
        mercadopago_alias: affiliate.mercadopago_alias || '',
        mercadopago_cvu: affiliate.mercadopago_cvu || '',
      });
      setErrors({});
    }
  }, [affiliate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!affiliate) return;

    setErrors({});

    // Validación
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
        title: "Afiliado actualizado",
        description: "Los datos de pago han sido actualizados exitosamente.",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        console.error('Error updating affiliate:', error);
        toast({
          title: "Error",
          description: "No se pudo actualizar el afiliado. Intenta nuevamente.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!affiliate) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Datos de Pago</DialogTitle>
          <DialogDescription>
            Actualizar información de pago para {affiliate.name}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="payment_method">Método de Pago</Label>
              <Select
                value={formData.payment_method}
                onValueChange={(value: PaymentMethod) => 
                  setFormData({ ...formData, payment_method: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="mercadopago">Mercado Pago</SelectItem>
                </SelectContent>
              </Select>
              {errors.payment_method && (
                <p className="text-sm text-destructive">{errors.payment_method}</p>
              )}
            </div>

            {formData.payment_method === 'paypal' && (
              <div className="grid gap-2">
                <Label htmlFor="paypal_email">Email de PayPal</Label>
                <Input
                  id="paypal_email"
                  type="email"
                  value={formData.paypal_email}
                  onChange={(e) => setFormData({ ...formData, paypal_email: e.target.value })}
                  placeholder="ejemplo@paypal.com"
                  maxLength={255}
                />
                {errors.paypal_email && (
                  <p className="text-sm text-destructive">{errors.paypal_email}</p>
                )}
              </div>
            )}

            {formData.payment_method === 'mercadopago' && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="mercadopago_alias">Alias de Mercado Pago</Label>
                  <Input
                    id="mercadopago_alias"
                    value={formData.mercadopago_alias}
                    onChange={(e) => setFormData({ ...formData, mercadopago_alias: e.target.value })}
                    placeholder="mi.alias.mp"
                    maxLength={100}
                  />
                  {errors.mercadopago_alias && (
                    <p className="text-sm text-destructive">{errors.mercadopago_alias}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="mercadopago_cvu">CVU de Mercado Pago</Label>
                  <Input
                    id="mercadopago_cvu"
                    value={formData.mercadopago_cvu}
                    onChange={(e) => setFormData({ ...formData, mercadopago_cvu: e.target.value })}
                    placeholder="0000003100000000000000"
                    maxLength={50}
                  />
                  {errors.mercadopago_cvu && (
                    <p className="text-sm text-destructive">{errors.mercadopago_cvu}</p>
                  )}
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAffiliateDialog;
