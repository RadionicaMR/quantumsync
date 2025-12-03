import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/context/LanguageContext';

interface SettingsTogglesProps {
  useHeadphones: boolean;
  setUseHeadphones: (value: boolean) => void;
  visualFeedback: boolean;
  setVisualFeedback: (value: boolean) => void;
  isPlaying?: boolean;
}

const SettingsToggles = ({
  useHeadphones,
  setUseHeadphones,
  visualFeedback,
  setVisualFeedback,
  isPlaying = false,
}: SettingsTogglesProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col sm:flex-row gap-6 justify-between w-full">
      <div className="flex items-center gap-2">
        <Switch 
          id="custom-headphones" 
          checked={useHeadphones}
          onCheckedChange={setUseHeadphones}
          disabled={isPlaying}
        />
        <Label htmlFor="custom-headphones">{t('settings.useHeadphones')}</Label>
      </div>
      
      <div className="flex items-center gap-2">
        <Switch 
          id="custom-visual" 
          checked={visualFeedback}
          onCheckedChange={setVisualFeedback}
          disabled={isPlaying}
        />
        <Label htmlFor="custom-visual">{t('settings.visualFeedback')}</Label>
      </div>
    </div>
  );
};

export default SettingsToggles;
