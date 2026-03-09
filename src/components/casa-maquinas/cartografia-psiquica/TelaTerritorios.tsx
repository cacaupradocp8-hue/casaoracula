import { TERRITORIOS } from './constants';
import { Button } from '@/components/ui/button';

interface Props {
  selected: string[];
  onToggle: (t: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function TelaTerritorios({ selected, onToggle, onNext, onBack }: Props) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-display text-foreground">Quais territórios estão mais presentes em você agora?</h3>
        <p className="text-xs text-muted-foreground">Selecione até 5 distritos da sua CidaDELA</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {TERRITORIOS.map(t => (
          <button
            key={t.key}
            onClick={() => onToggle(t.key)}
            disabled={!selected.includes(t.key) && selected.length >= 5}
            className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
              selected.includes(t.key)
                ? 'bg-primary/10 border-primary/40 ring-1 ring-primary/20'
                : 'bg-card/40 border-border/30 hover:border-primary/20 disabled:opacity-30'
            }`}
          >
            <span className="text-xl">{t.icon}</span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{t.nome}</p>
              <p className="text-[9px] text-muted-foreground">{t.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">Voltar</Button>
        <Button onClick={onNext} disabled={selected.length === 0} className="flex-1">Próximo</Button>
      </div>
    </div>
  );
}
