import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from '@/context/LanguageContext';

interface ReceptorNameInputProps {
  receptorName: string;
  setReceptorName: (name: string) => void;
  isPlaying: boolean;
  isActive?: boolean;
}

const ReceptorNameInput = ({
  receptorName,
  setReceptorName,
  isPlaying,
  isActive,
}: ReceptorNameInputProps) => {
  const { t, language } = useLanguage();
  const isDisabled = isActive !== undefined ? isActive : isPlaying;
  
  return (
    <div className="space-y-2">
      <Label htmlFor="receptorName" className="text-sm font-medium">
        {t('receptor.nameLabel')}
      </Label>
      <Input
        id="receptorName"
        placeholder={t('receptor.namePlaceholder')}
        value={receptorName}
        onChange={(e) => setReceptorName(e.target.value)}
        maxLength={50}
        className="focus:ring-primary"
        disabled={isDisabled}
      />
      <p className="text-xs text-muted-foreground">
        {receptorName.length}/50 {language === 'en' ? 'characters' : 'caracteres'}
      </p>
    </div>
  );
};

export default ReceptorNameInput;
