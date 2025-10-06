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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('patients')
      .select('id, name')
      .eq('therapist_id', user.id)
      .order('name');

    if (error) {
      console.error('Error loading patients:', error);
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

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: 'Error',
        description: 'Debes iniciar sesión',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('patients')
      .insert({
        therapist_id: user.id,
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
      <DialogContent className="sm:max-w-[425px]">
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
                <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              disabled={!selectedPatient}
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
