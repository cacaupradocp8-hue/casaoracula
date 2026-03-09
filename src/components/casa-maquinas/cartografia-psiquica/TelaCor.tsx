import { CORES_SIMBOLICAS } from './constants';
import { Button } from '@/components/ui/button';

interface Props {
  selected: string;
  onSelect: (cor: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function TelaCor({ selected, onSelect, onNext, onBack }: Props) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-display text-foreground">Se sua cidade interior fosse uma cor, qual seria?</h3>
        <p className="text-xs text-muted-foreground">Escolha a cor que mais ressoa com seu momento</p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {CORES_SIMBOLICAS.map(c => (
          <button
            key={c.nome}
            onClick={() => onSelect(c.nome)}
            className={`group flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
              selected === c.nome
                ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                : 'border-border/30 hover:border-primary/30 bg-card/40'
            }`}
          >
            <div
              className="w-10 h-10 rounded-full border-2 transition-transform group-hover:scale-110"
              style={{
                backgroundColor: c.hex,
                borderColor: selected === c.nome ? 'hsl(var(--primary))' : 'transparent',
              }}
            />
            <span className="text-xs font-medium text-foreground">{c.nome}</span>
            <span className="text-[9px] text-muted-foreground leading-tight">{c.significado}</span>
          </button>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={onBack} className="flex-1">Voltar</Button>
        <Button onClick={onNext} disabled={!selected} className="flex-1">Próximo</Button>
      </div>
    </div>
  );
}
