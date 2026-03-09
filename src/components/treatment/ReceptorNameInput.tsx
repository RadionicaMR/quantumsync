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
    <div className="space-y-2 p-4 rounded-lg border-2 border-primary/40 bg-primary/5">
      <Label htmlFor="receptorName" className="text-sm font-semibold text-primary">
        {t('receptor.nameLabel')}
      </Label>
      <Input
        id="receptorName"
        placeholder={t('receptor.namePlaceholder')}
        value={receptorName}
        onChange={(e) => setReceptorName(e.target.value)}
        maxLength={100}
        className="focus:ring-primary border-primary/30"
        disabled={isDisabled}
      />
      <p className="text-xs text-muted-foreground">
        {receptorName.length}/100 {language === 'en' ? 'characters' : 'caracteres'}
      </p>
    </div>
  );
};

export default ReceptorNameInput;
