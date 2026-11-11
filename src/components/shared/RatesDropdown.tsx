import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Check, ChevronDown, Disc, Shuffle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import RateDial from '@/components/shared/RateDial';

export interface RateItem {
  id: number;
  value: string;
  setter: (v: string) => void;
}

const RatesDropdown = ({ rates, disabled = false }: { rates: RateItem[]; disabled?: boolean }) => {
  const { language } = useLanguage();
  const en = language === 'en';
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [dialOpen, setDialOpen] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const current = rates.find((r) => r.id === active);
  const doneCount = rates.filter((r) => r.value?.trim()).length;

  const startRandom = () => {
    if (!current || disabled) return;
    const gen = () => current.setter(Math.floor(Math.random() * 100).toString());
    gen();
    intervalRef.current = setInterval(gen, 150);
    const end = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener('mouseup', end);
      document.removeEventListener('touchend', end);
    };
    document.addEventListener('mouseup', end);
    document.addEventListener('touchend', end);
  };

  const dialInitial = () => {
    const n = parseInt(current?.value || '0', 10);
    return isNaN(n) ? 0 : Math.min(n, 100);
  };

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full justify-between h-9 font-semibold tracking-wide"
      >
        <span>RATES <span className="ml-1 text-xs font-normal text-muted-foreground">({doneCount}/{rates.length})</span></span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </Button>

      {open && (
        <div className="mt-1 grid grid-cols-3 gap-1">
          {rates.map((r) => {
            const done = !!r.value?.trim();
            return (
              <button
                key={r.id}
                type="button"
                disabled={disabled}
                onClick={() => setActive(r.id)}
                className="flex items-center justify-between gap-1 rounded-md border border-border/60 bg-muted/40 px-2 py-1 text-xs hover:bg-muted disabled:opacity-60"
              >
                <span className="truncate">Rate {r.id}{done && <span className="ml-1 font-mono text-muted-foreground">{r.value}</span>}</span>
                {done && <Check className="h-3.5 w-3.5 shrink-0 text-green-500" aria-label="ok" />}
              </button>
            );
          })}
        </div>
      )}

      <Dialog open={active !== null} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle className="text-base">Rate {active}</DialogTitle>
          </DialogHeader>
          {current && (
            <div className="space-y-3">
              <Input
                autoFocus
                value={current.value}
                onChange={(e) => current.setter(e.target.value)}
                placeholder={en ? 'Number or word' : 'Número o palabra'}
                maxLength={50}
                disabled={disabled}
                className="font-mono"
              />
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" disabled={disabled} onClick={() => setDialOpen(true)}>
                  <Disc className="h-4 w-4 mr-1" /> Dial
                </Button>
                <Button
                  variant="outline" size="sm" className="flex-1 touch-manipulation" disabled={disabled}
                  onMouseDown={startRandom}
                  onTouchStart={(e) => { e.preventDefault(); startRandom(); }}
                >
                  <Shuffle className="h-4 w-4 mr-1" /> {en ? 'Random' : 'Azar'}
                </Button>
              </div>
              <Button size="sm" className="w-full" onClick={() => setActive(null)}>
                {en ? 'Done' : 'Listo'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <RateDial
        open={dialOpen}
        onClose={(v) => { setDialOpen(false); if (v !== null && current) current.setter(v.toString()); }}
        initialValue={dialInitial()}
      />
    </div>
  );
};

export default RatesDropdown;
