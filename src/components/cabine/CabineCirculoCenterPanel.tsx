import { Card, CardContent } from '@/components/ui/card';
import { CircleDot, Sparkles, BookOpen, HelpCircle } from 'lucide-react';
import type { CirculoSagrado } from '@/hooks/useCirculosSagrados';

interface Props {
  circulo: CirculoSagrado | null;
}

export function CabineCirculoCenterPanel({ circulo }: Props) {
  if (!circulo) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-2">
          <CircleDot className="w-10 h-10 text-muted-foreground/20 mx-auto" />
          <p className="text-sm text-muted-foreground/50 italic">Selecione um círculo</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header simbólico */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
              <CircleDot className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-primary/70 font-semibold mb-1">
                Campo Simbólico
              </p>
              <h3 className="text-base font-display font-semibold text-foreground">
                {circulo.nome_circulo}
              </h3>
            </div>
          </div>

          {/* Ritual base */}
          <div className="p-3 rounded-lg bg-background/30 border border-primary/10">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-primary/60 mt-0.5 shrink-0" />
              <div>
                <p className="text-[9px] text-primary/50 uppercase tracking-wider mb-0.5">Ritual base</p>
                <p className="text-sm text-foreground/90">{circulo.ritual_base}</p>
              </div>
            </div>
          </div>

          {/* Distritos ativados */}
          {circulo.distritos_ativados && circulo.distritos_ativados.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {circulo.distritos_ativados.map((d, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 border border-primary/15 text-primary/80"
                >
                  {d}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sugestões de condução */}
      <Card className="border-border/20 bg-card/40">
        <CardContent className="p-4 space-y-3">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 font-semibold">
            Sugestões de Condução
          </p>

          <div className="space-y-2">
            <div className="p-2.5 rounded-lg bg-background/20 border border-border/10">
              <div className="flex items-start gap-2">
                <BookOpen className="w-3.5 h-3.5 text-muted-foreground/40 mt-0.5" />
                <div>
                  <p className="text-[9px] text-muted-foreground/50 uppercase tracking-wider mb-0.5">Conto sugerido</p>
                  <p className="text-xs text-foreground/70 italic">Baseado no ritual e distritos — disponível após primeiro encontro</p>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-background/20 border border-border/10">
              <div className="flex items-start gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/40 mt-0.5" />
                <div>
                  <p className="text-[9px] text-muted-foreground/50 uppercase tracking-wider mb-0.5">Pergunta de abertura</p>
                  <p className="text-xs text-foreground/70 italic">Será gerada com base no campo simbólico do grupo</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
