import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { TravessiaItem } from '@/hooks/useClienteJardimCompleto';

interface Props {
  items: TravessiaItem[];
  contadores: { totalEntries: number; praticasConcluidas: number };
  onVerTudo: () => void;
}

export function TravessiaResumoBloco({ items, contadores, onVerTudo }: Props) {
  const recentes = items.slice(0, 4);

  if (recentes.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-xs text-muted-foreground/40 italic">
          Sua travessia começa com o primeiro registro.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50">
          Sua travessia
        </span>
        <span className="text-[10px] text-muted-foreground/40">
          {contadores.totalEntries} registros · {contadores.praticasConcluidas} práticas
        </span>
      </div>

      <Card className="border-border/15 bg-card/50">
        <CardContent className="p-3 space-y-0">
          {recentes.map((item, i) => (
            <div
              key={item.id}
              className={`flex items-start gap-3 py-2.5 ${i < recentes.length - 1 ? 'border-b border-border/10' : ''}`}
            >
              <span className="text-sm mt-0.5">{item.icone}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground/70 truncate">{item.titulo}</p>
                <p className="text-[10px] text-muted-foreground/40">
                  {format(new Date(item.data), "dd MMM · HH:mm", { locale: ptBR })}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {items.length > 4 && (
        <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground/50 gap-1" onClick={onVerTudo}>
          Ver toda a travessia <ArrowRight className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
}
