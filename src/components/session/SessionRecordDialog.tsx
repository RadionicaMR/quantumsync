import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown, Trash2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { archivePatient } from './patientArchive';

interface SessionRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (patientId: string | null) => void;
  sessionType: 'diagnosis' | 'treatment' | 'manifestation' | 'balance_chakras';
}

interface Patient {
  id: string;
  name: string;
}

export const SessionRecordDialog = ({
  open,
  onOpenChange,
  onConfirm,
  sessionType,
}: SessionRecordDialogProps) => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [patientToRemove, setPatientToRemove] = useState<Patient | null>(null);
  const [removing, setRemoving] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [newPatientName, setNewPatientName] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadPatients();
    }
  }, [open]);

  const loadPatients = async () => {
    if (!isAuthenticated || !user?.email) return;

    const { data, error } = await supabase
      .from('patients')
      .select('id, name')
      .eq('therapist_id', user.email)
      .eq('archived', false)
      .order('name');

    if (error) {
      console.error('Error loading patients:', error);
      toast({
        title: 'Error al cargar pacientes',
        description: 'Verifica tu sesión e inténtalo nuevamente.',
        variant: 'destructive',
      });
      return;
    }

    setPatients(data || []);
  };

  const handleCreatePatient = async () => {
    if (!newPatientName.trim()) {
      toast({
        title: 'Error',
        description: 'Por favor ingresa el nombre del paciente',
        variant: 'destructive',
      });
      return;
    }

    if (!isAuthenticated || !user?.email) {
      toast({
        title: 'Error',
        description: 'Debes iniciar sesión',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from('patients')
      .insert({
        therapist_id: user.email,
        name: newPatientName.trim(),
      })
      .select()
      .single();

    setLoading(false);

    if (error) {
      console.error('Error creating patient:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo crear el paciente',
        variant: 'destructive',
      });
      return;
    }

    setPatients([...patients, data]);
    setSelectedPatient(data.id);
    setNewPatientName('');
    setIsCreatingNew(false);
    toast({
      title: 'Éxito',
      description: 'Paciente creado correctamente',
    });
  };

  const handleRemovePatient = async () => {
    if (!patientToRemove || !user?.email || removing) return;
    setRemoving(true);
    const { error } = await archivePatient(patientToRemove.id, user.email);
    setRemoving(false);
    if (error) {
      toast({ title: t('session.removeError'), variant: 'destructive' });
      return;
    }
    setPatients(current => current.filter(patient => patient.id !== patientToRemove.id));
    if (selectedPatient === patientToRemove.id) setSelectedPatient('');
    setPatientToRemove(null);
    toast({ title: t('session.removed') });
  };

  const handleConfirm = () => {
    if (selectedPatient) {
      onConfirm(selectedPatient);
    } else {
      onConfirm(null);
    }
    onOpenChange(false);
  };

  const handleSkip = () => {
    onConfirm(null);
    onOpenChange(false);
  };

  const getSessionTypeLabel = () => {
    switch (sessionType) {
      case 'diagnosis':
        return 'Diagnóstico';
      case 'treatment':
        return 'Tratamiento';
      case 'manifestation':
        return 'Manifestación';
      case 'balance_chakras':
        return 'Balance de Chakras';
      default:
        return 'Sesión';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] z-50">
        <DialogHeader>
          <DialogTitle>Registrar Sesión</DialogTitle>
          <DialogDescription>
            ¿Deseas registrar esta sesión de {getSessionTypeLabel().toLowerCase()}?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!isCreatingNew ? (
            <>
              <div className="space-y-2">
                <Label>Seleccionar Paciente</Label>
                <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between" aria-label={t('session.selectPatient')}>
                      <span className="truncate">{patients.find(patient => patient.id === selectedPatient)?.name || t('session.selectPatient')}</span>
                      <ChevronDown className="h-4 w-4 shrink-0" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="z-[60] w-[var(--radix-popover-trigger-width)] p-1 max-h-64 overflow-y-auto">
                    {patients.length === 0 ? (
                      <p className="p-2 text-sm text-muted-foreground">{t('session.noPatients')}</p>
                    ) : (
                      patients.map((patient) => (
                        <div key={patient.id} className="flex items-center gap-1">
                          <Button variant="ghost" className="flex-1 min-w-0 justify-start" onClick={() => { setSelectedPatient(patient.id); setPickerOpen(false); }}>
                            <span className="truncate">{patient.name}</span>
                          </Button>
                          <Button variant="ghost" size="icon" className="shrink-0 text-destructive" aria-label={`${t('session.removePatient')}: ${patient.name}`} title={t('session.removePatient')} onClick={() => { setPatientToRemove(patient); setPickerOpen(false); }}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </PopoverContent>
                </Popover>
                {patientToRemove && (
                  <div className="space-y-2 border-t pt-2">
                    <p className="text-sm">{t('session.removeConfirmation').replace('{name}', patientToRemove.name)}</p>
                    <p className="text-xs text-muted-foreground">{t('session.keepHistory')}</p>
                    <div className="flex gap-2">
                      <Button variant="destructive" size="sm" onClick={handleRemovePatient} disabled={removing}>{t('common.delete')}</Button>
                      <Button variant="outline" size="sm" onClick={() => setPatientToRemove(null)} disabled={removing}>{t('common.cancel')}</Button>
                    </div>
                  </div>
                )}
              </div>

              <Button
                variant="outline"
                onClick={() => setIsCreatingNew(true)}
                className="w-full"
              >
                + Crear Nuevo Paciente
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="newPatient">Nombre del Paciente</Label>
                <Input
                  id="newPatient"
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  placeholder="Ingresa el nombre"
                  maxLength={100}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleCreatePatient}
                  disabled={loading}
                  className="flex-1"
                >
                  Crear
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setNewPatientName('');
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </>
          )}
        </div>

        {!isCreatingNew && (
          <div className="flex gap-2">
            <Button
              onClick={handleConfirm}
              disabled={!selectedPatient || removing || !!patientToRemove}
              className="flex-1"
            >
              Registrar Sesión
            </Button>
            <Button variant="outline" onClick={handleSkip} className="flex-1">
              Omitir
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
