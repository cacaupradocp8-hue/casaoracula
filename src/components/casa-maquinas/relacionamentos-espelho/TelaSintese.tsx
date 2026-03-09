
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EspelhoState, calcEspelhoStats } from './constants';
import { Users, Sun, Moon, Eye, Repeat } from 'lucide-react';

export function TelaSintese({ state }: { state: EspelhoState }) {
  const stats = calcEspelhoStats(state);

  return (
    <div className="space-y-4">
      <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Síntese — Relacionamentos como Espelho
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stats overview */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg bg-background/50 border border-border/20">
              <p className="text-2xl font-bold text-primary">{stats.total}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Vínculos</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50 border border-border/20">
              <p className="text-2xl font-bold text-primary">{stats.comProjecao}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Projeções</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50 border border-border/20">
              <p className="text-2xl font-bold text-primary">{Object.keys(stats.tipos).length}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Tipos</p>
            </div>
          </div>

          {/* Key insights */}
          {stats.tipoMaisFrequente && (
            <div className="p-3 rounded-lg bg-background/30 border border-border/20">
              <p className="text-xs text-muted-foreground mb-1">Tipo de vínculo mais frequente</p>
              <p className="text-sm font-medium text-foreground">{stats.tipoMaisFrequente[0]} ({stats.tipoMaisFrequente[1]}x)</p>
            </div>
          )}

          {stats.qualidadeMaisFrequente && (
            <div className="p-3 rounded-lg bg-background/30 border border-border/20">
              <p className="text-xs text-muted-foreground mb-1">Qualidade relacional mais presente</p>
              <p className="text-sm font-medium text-foreground">{stats.qualidadeMaisFrequente[0]} ({stats.qualidadeMaisFrequente[1]}x)</p>
            </div>
          )}

          {/* Per-person summary */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Espelhos Identificados</p>
            {state.relacionamentos.map((r, i) => (
              <div key={i} className="p-3 rounded-lg border border-border/20 bg-background/20 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{r.nome || `Pessoa ${i + 1}`}</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">{r.tipo}</span>
                </div>
                {r.admiracao && (
                  <p className="text-xs text-muted-foreground flex items-start gap-1">
                    <Sun className="w-3 h-3 mt-0.5 text-amber-400 shrink-0" /> {r.admiracao}
                  </p>
                )}
                {r.irritacao && (
                  <p className="text-xs text-muted-foreground flex items-start gap-1">
                    <Moon className="w-3 h-3 mt-0.5 text-indigo-400 shrink-0" /> {r.irritacao}
                  </p>
                )}
                {r.projecao && (
                  <p className="text-xs text-muted-foreground flex items-start gap-1">
                    <Eye className="w-3 h-3 mt-0.5 text-primary shrink-0" /> {r.projecao}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Central pattern */}
          {state.padraoCentral && (
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Repeat className="w-4 h-4 text-primary" />
                <p className="text-xs font-semibold text-primary uppercase tracking-wider">Padrão Central</p>
              </div>
              <p className="text-sm text-foreground italic">"{state.padraoCentral}"</p>
            </div>
          )}

          {state.reflexaoFinal && (
            <div className="p-3 rounded-lg bg-background/30 border border-border/20">
              <p className="text-xs text-muted-foreground mb-1">Reflexão final</p>
              <p className="text-sm text-foreground">{state.reflexaoFinal}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
