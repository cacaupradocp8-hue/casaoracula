import { SIMBOLOS } from './constants';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface Props {
  selected: string;
  onSelect: (s: string) => void;
  motivo: string;
  onMotivo: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function TelaSimbolo({ selected, onSelect, motivo, onMotivo, onNext, onBack }: Props) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-display text-foreground">Há um símbolo que representa sua jornada agora?</h3>
        <p className="text-xs text-muted-foreground">Escolha o símbolo que mais ressoa</p>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
        {SIMBOLOS.map(s => (
          <button
            key={s.key}
            onClick={() => onSelect(s.nome)}
            className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border transition-all ${
              selected === s.nome
                ? 'bg-primary/10 border-primary/40 ring-1 ring-primary/20'
                : 'bg-card/40 border-border/30 hover:border-primary/20'
            }`}
          >
            <span className="text-xl">{s.icon}</span>
            <span className="text-[9px] text-muted-foreground">{s.nome}</span>
          </button>
        ))}
      </div>

      {selected && (
        <div className="space-y-2 animate-fade-in">
          <p className="text-xs text-muted-foreground">Por que esse símbolo?</p>
          <Textarea
            value={motivo}
            onChange={e => onMotivo(e.target.value)}
            placeholder="Esse símbolo me representa porque..."
            className="min-h-[80px] bg-card/60 border-border/30 text-foreground"
          />
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">Voltar</Button>
        <Button onClick={onNext} disabled={!selected} className="flex-1">Próximo</Button>
      </div>
    </div>
  );
}
