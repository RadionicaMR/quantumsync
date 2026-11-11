import { useRef } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

interface CompactPersonPhotoUploaderProps {
  photo: string | null;
  onChange: (photo: string | null) => void;
  disabled?: boolean;
}

const CompactPersonPhotoUploader = ({ photo, onChange, disabled = false }: CompactPersonPhotoUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  return (
    <div className="mt-2 flex items-center gap-2 rounded-md border border-dashed border-quantum-primary/30 bg-quantum-dark/20 p-2 text-left">
      {photo ? (
        <img
          src={photo}
          alt={t('diagnosis.personPhoto')}
          className="h-10 w-10 shrink-0 rounded-md object-cover"
        />
      ) : (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted/40">
          <ImagePlus className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        </div>
      )}

      <span className="min-w-0 flex-1 text-xs font-medium leading-tight">
        {t('diagnosis.personPhoto')}
      </span>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-7 shrink-0 px-2 text-xs"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
      >
        {photo ? t('diagnosis.changePhoto') : t('diagnosis.uploadPhoto')}
      </Button>

      {photo && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0"
          onClick={() => onChange(null)}
          disabled={disabled}
          aria-label={t('diagnosis.removePhoto')}
          title={t('diagnosis.removePhoto')}
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />
    </div>
  );
};

export default CompactPersonPhotoUploader;
