import { User, Users, CircleDot } from 'lucide-react';
import { cn } from '@/lib/utils';

export type CabineOperationMode = 'individual' | 'grupo' | 'circulo';

interface Props {
  mode: CabineOperationMode;
  onChange: (mode: CabineOperationMode) => void;
  disabled: boolean;
}

const MODES: { key: CabineOperationMode; label: string; icon: typeof User }[] = [
  { key: 'individual', label: 'Individual', icon: User },
  { key: 'grupo', label: 'Grupo', icon: Users },
  { key: 'circulo', label: 'Círculo', icon: CircleDot },
];

export function CabineModeSelector({ mode, onChange, disabled }: Props) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-card/40 border border-border/15 w-fit">
      {MODES.map(({ key, label, icon: Icon }) => {
        const active = mode === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            disabled={disabled}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
              active
                ? 'bg-primary/15 text-primary border border-primary/20'
                : 'text-muted-foreground/50 hover:text-muted-foreground/80 hover:bg-background/30 border border-transparent',
              disabled && !active && 'opacity-30 cursor-not-allowed',
              disabled && active && 'opacity-70 cursor-not-allowed',
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        );
      })}
      {disabled && (
        <span className="text-[9px] text-muted-foreground/30 px-2 italic">
          sessão ativa
        </span>
      )}
    </div>
  );
}
