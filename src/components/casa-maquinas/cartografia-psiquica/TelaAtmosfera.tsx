import { DESCRITORES_ATMOSFERA } from './constants';
import { Button } from '@/components/ui/button';

interface Props {
  selected: string[];
  onToggle: (d: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function TelaAtmosfera({ selected, onToggle, onNext, onBack }: Props) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-display text-foreground">Como é a atmosfera dessa cidade agora?</h3>
        <p className="text-xs text-muted-foreground">Selecione até 4 descritores</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {DESCRITORES_ATMOSFERA.map(d => (
          <button
            key={d}
            onClick={() => onToggle(d)}
            disabled={!selected.includes(d) && selected.length >= 4}
            className={`px-4 py-2.5 rounded-lg text-sm transition-all border ${
              selected.includes(d)
                ? 'bg-primary/15 border-primary/40 text-primary font-medium'
                : 'bg-card/40 border-border/30 text-muted-foreground hover:border-primary/20 disabled:opacity-30'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      <p className="text-[10px] text-muted-foreground/50 text-center italic">
        Esses descritores criam a atmosfera da sua cidade
      </p>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">Voltar</Button>
        <Button onClick={onNext} disabled={selected.length === 0} className="flex-1">Próximo</Button>
      </div>
    </div>
  );
}
