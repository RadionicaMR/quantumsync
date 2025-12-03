import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from '@/context/LanguageContext';

const LanguageToggle = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1.5 px-2 h-8 text-white/80 hover:text-white hover:bg-white/10"
        >
          <Globe size={16} />
          <span className="text-xs font-medium uppercase">{language}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px] bg-background border border-border">
        <DropdownMenuItem 
          onClick={() => setLanguage('es')}
          className={language === 'es' ? 'bg-accent' : ''}
        >
          🇪🇸 {t('language.spanish')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage('en')}
          className={language === 'en' ? 'bg-accent' : ''}
        >
          🇺🇸 {t('language.english')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageToggle;
