import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ARQUETIPOS } from './constants';
import { Check } from 'lucide-react';

interface Props {
  selecionados: string[];
  onUpdate: (v: string[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function AtlasSelecao({ selecionados, onUpdate, onNext, onPrev }: Props) {
  const toggle = (nome: string) => {
    if (selecionados.includes(nome)) {
      onUpdate(selecionados.filter(s => s !== nome));
    } else if (selecionados.length < 6) {
      onUpdate([...selecionados, nome]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <h3 className="text-lg font-semibold text-foreground">Quais arquétipos você reconhece em si?</h3>
        <p className="text-sm text-muted-foreground">Selecione até 6 arquétipos · {selecionados.length}/6</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {ARQUETIPOS.map(a => {
          const sel = selecionados.includes(a.nome);
          return (
            <button
              key={a.nome}
              onClick={() => toggle(a.nome)}
              disabled={!sel && selecionados.length >= 6}
              className={`relative p-3 rounded-xl border text-center transition-all ${
                sel
                  ? 'border-primary bg-primary/10 ring-1 ring-primary/30'
                  : selecionados.length >= 6
                  ? 'border-border/10 opacity-40 cursor-not-allowed'
                  : 'border-border/20 bg-card/60 hover:border-border/40'
              }`}
            >
              {sel && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-primary-foreground" />
                </div>
              )}
              <div className="text-xl mb-1">{a.icone}</div>
              <div className="text-xs font-semibold text-foreground">{a.nome}</div>
              <div className="text-[9px] text-muted-foreground">{a.keywords}</div>
            </button>
          );
        })}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onPrev} className="flex-1">Voltar</Button>
        <Button
          onClick={onNext}
          disabled={selecionados.length === 0}
          className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground"
        >
          Caracterizar ({selecionados.length})
        </Button>
      </div>
    </div>
  );
}
