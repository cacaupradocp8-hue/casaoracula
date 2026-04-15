import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CircleDot, ChevronRight, Loader2 } from 'lucide-react';
import { useCirculosSagrados, type CirculoSagrado } from '@/hooks/useCirculosSagrados';

interface Props {
  selectedCirculoId: string | null;
  onSelectCirculo: (id: string) => void;
}

export function CabineCirculoLeftPanel({ selectedCirculoId, onSelectCirculo }: Props) {
  const { fetchCirculos, loading } = useCirculosSagrados();
  const [circulos, setCirculos] = useState<CirculoSagrado[]>([]);

  useEffect(() => {
    fetchCirculos().then(setCirculos);
  }, []);

  if (loading) {
    return (
      <Card className="border-border/15 bg-card/30">
        <CardContent className="p-5 flex justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground/40" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/15 bg-card/30">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 font-semibold">
            Círculos de Mulheres
          </p>
          <Badge variant="outline" className="text-[9px] px-1.5 text-muted-foreground/40">
            {circulos.length}
          </Badge>
        </div>

        {circulos.length === 0 ? (
          <div className="text-center py-4">
            <CircleDot className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground/40 italic">Nenhum círculo registrado</p>
          </div>
        ) : (
          <div className="space-y-1.5 max-h-[50vh] overflow-y-auto">
            {circulos.map(c => (
              <button
                key={c.id}
                onClick={() => onSelectCirculo(c.id)}
                className={`w-full text-left p-2.5 rounded-lg border transition-all duration-200 ${
                  selectedCirculoId === c.id
                    ? 'border-primary/30 bg-primary/10'
                    : 'border-border/10 bg-background/20 hover:bg-background/30'
                }`}
              >
                <p className="text-xs font-medium text-foreground/90 truncate">{c.nome_circulo}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] text-muted-foreground/40 capitalize">
                    {c.status_circulo}
                  </span>
                  <span className="text-[9px] text-muted-foreground/30">
                    {c.participantes_ids?.length || 0} participantes
                  </span>
                  {selectedCirculoId === c.id && (
                    <ChevronRight className="w-3 h-3 text-primary/60 ml-auto" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
