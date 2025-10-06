-- Add trigger for patients table to update updated_at timestamp
CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
