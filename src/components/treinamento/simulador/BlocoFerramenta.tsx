import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Wrench } from 'lucide-react';
import { FERRAMENTAS_METODO, TrainingCase } from './types';

interface Props {
  caso: TrainingCase;
  ferramenta: string;
  onChange: (v: string) => void;
  onNext: () => void;
}

export function BlocoFerramenta({ caso, ferramenta, onChange, onNext }: Props) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Escolha a ferramenta mais adequada para esta cliente neste momento.
      </p>

      {caso.nivel === 'guiado' && (
        <p className="text-xs text-primary/60 italic px-1">
          Considere o distrito, o estado e o que a cliente trouxe. Qual ferramenta abriria o campo sem forçar?
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {FERRAMENTAS_METODO.map(f => (
          <button
            key={f}
            onClick={() => onChange(f)}
            className={`flex items-center gap-2 p-3 rounded-lg border text-left text-sm transition-all ${
              ferramenta === f
                ? 'bg-primary/15 border-primary/50 text-primary font-medium'
                : 'border-border/30 text-muted-foreground hover:border-border hover:text-foreground'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 shrink-0" />
            {f}
          </button>
        ))}
      </div>

      <Button onClick={onNext} disabled={!ferramenta} className="w-full">
        Ver retorno <ArrowRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}
