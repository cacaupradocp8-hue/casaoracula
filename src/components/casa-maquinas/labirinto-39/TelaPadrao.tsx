import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface GrupoStat {
  nome: string;
  cor: string;
  abertas: number;
  fechadas: number;
  trancadas: number;
  total: number;
}

interface Props {
  stats: {
    abertas: number;
    fechadas: number;
    trancadas: number;
    byGrupo: GrupoStat[];
  };
  onNext: () => void;
  onPrev: () => void;
}

function pct(n: number) {
  return Math.round((n / 39) * 100);
}

export function TelaPadrao({ stats, onNext, onPrev }: Props) {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <h3 className="text-lg font-semibold text-foreground">Padrão Emocional</h3>
        <p className="text-sm text-muted-foreground">Distribuição geral do repertório</p>
      </div>

      {/* Big numbers */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Abertas', n: stats.abertas, color: 'text-green-400', bg: 'bg-green-400/10' },
          { label: 'Fechadas', n: stats.fechadas, color: 'text-muted-foreground', bg: 'bg-muted/20' },
          { label: 'Trancadas', n: stats.trancadas, color: 'text-red-400', bg: 'bg-red-400/10' },
        ].map(item => (
          <Card key={item.label} className={`border-border/20 ${item.bg}`}>
            <CardContent className="pt-4 pb-3 text-center">
              <div className={`text-2xl font-bold ${item.color}`}>{item.n}</div>
              <div className="text-[10px] text-muted-foreground">{pct(item.n)}%</div>
              <div className="text-xs text-muted-foreground mt-0.5">{item.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Per-group bar chart */}
      <Card className="border-border/20 bg-card/60">
        <CardContent className="pt-4 space-y-2.5">
          {stats.byGrupo.map(g => (
            <div key={g.nome} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: g.cor }} />
                  <span className="text-xs font-medium text-foreground">{g.nome}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {g.abertas}A · {g.fechadas}F · {g.trancadas}T
                </span>
              </div>
              <div className="flex h-2 rounded-full overflow-hidden bg-muted/20">
                {g.abertas > 0 && (
                  <div className="bg-green-400 transition-all" style={{ width: `${(g.abertas / g.total) * 100}%` }} />
                )}
                {g.fechadas > 0 && (
                  <div className="bg-muted-foreground/30 transition-all" style={{ width: `${(g.fechadas / g.total) * 100}%` }} />
                )}
                {g.trancadas > 0 && (
                  <div className="bg-red-400 transition-all" style={{ width: `${(g.trancadas / g.total) * 100}%` }} />
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onPrev} className="flex-1">Voltar</Button>
        <Button onClick={onNext} className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground">Próxima</Button>
      </div>
    </div>
  );
}
