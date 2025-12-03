import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/LanguageContext';

interface PersonNameInputProps {
  personName: string;
  setPersonName: (name: string) => void;
  isPlaying: boolean;
}

const PersonNameInput = ({ personName, setPersonName, isPlaying }: PersonNameInputProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="mb-6">
      <Label htmlFor="personName" className="block mb-2">
        {t('chakras.personNameLabel')}
      </Label>
      <Input
        id="personName"
        value={personName}
        onChange={(e) => setPersonName(e.target.value)}
        placeholder={t('chakras.personNamePlaceholder')}
        maxLength={100}
        className="bg-quantum-dark/30 border-quantum-primary/30"
        disabled={isPlaying}
      />
    </div>
  );
};

export default PersonNameInput;
