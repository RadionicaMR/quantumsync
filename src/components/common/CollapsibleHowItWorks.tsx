import { ReactNode, useState } from 'react';
import { ChevronDown, Info } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const CollapsibleHowItWorks = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  return (
    <div className="px-2 sm:px-4 pt-2">
      <div className="container mx-auto">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="mx-auto flex items-center gap-1.5 rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Info className="h-3.5 w-3.5" />
          {t('common.howItWorksToggle')}
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {open && <div className="mt-2">{children}</div>}
    </div>
  );
};

export default CollapsibleHowItWorks;
