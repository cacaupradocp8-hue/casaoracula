import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComplexosState, calcComplexoStats, FREQUENCIAS } from './constants';
import { Orbit, Zap, Clock, AlertTriangle } from 'lucide-react';

export function TelaSintese({ state }: { state: ComplexosState }) {
  const stats = calcComplexoStats(state);

  return (
    <div className="space-y-4">
      <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Orbit className="w-5 h-5 text-primary" />
            Síntese — Cartografia de Complexos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg bg-background/50 border border-border/20">
              <p className="text-2xl font-bold text-primary">{stats.total}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Complexos</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50 border border-border/20">
              <p className="text-2xl font-bold text-primary">{stats.mediaIntensidade.toFixed(1)}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Intensidade Média</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50 border border-border/20">
              <p className="text-2xl font-bold text-primary">{stats.emocoesMaisFrequentes.length}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Emoções</p>
            </div>
          </div>

          {stats.dominante && (
            <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-destructive" />
                <p className="text-xs font-semibold text-destructive uppercase tracking-wider">Complexo Dominante</p>
              </div>
              <p className="text-sm font-medium text-foreground">{stats.dominante.nome} — intensidade {stats.dominante.intensidade}/10</p>
              {stats.dominante.gatilho && <p className="text-xs text-muted-foreground mt-1">Gatilho: {stats.dominante.gatilho}</p>}
            </div>
          )}

          {stats.latente && stats.total > 1 && (
            <div className="p-3 rounded-lg bg-background/30 border border-border/20">
              <p className="text-xs text-muted-foreground mb-1">Complexo mais sutil</p>
              <p className="text-sm font-medium text-foreground">{stats.latente.nome} — intensidade {stats.latente.intensidade}/10</p>
            </div>
          )}

          {stats.emocoesMaisFrequentes.length > 0 && (
            <div className="p-3 rounded-lg bg-background/30 border border-border/20">
              <p className="text-xs text-muted-foreground mb-2">Emoções centrais</p>
              <div className="flex flex-wrap gap-1.5">
                {stats.emocoesMaisFrequentes.map(([emocao, count]) => (
                  <span key={emocao} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {emocao} ({count}x)
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Complexos Mapeados</p>
            {state.complexos.map((c, i) => (
              <div key={i} className="p-3 rounded-lg border border-border/20 bg-background/20 space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{c.nome || `Complexo ${i + 1}`}</p>
                  <div className="flex items-center gap-2">
                    {c.emocaoCentral && <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">{c.emocaoCentral}</span>}
                    <span className="text-[10px] text-muted-foreground">{c.intensidade}/10</span>
                  </div>
                </div>
                {c.reacaoAutomatica && <p className="text-xs text-muted-foreground flex items-start gap-1"><Zap className="w-3 h-3 mt-0.5 shrink-0 text-amber-400" /> {c.reacaoAutomatica}</p>}
                {c.origem && <p className="text-xs text-muted-foreground flex items-start gap-1"><Clock className="w-3 h-3 mt-0.5 shrink-0 text-primary" /> {c.origem}</p>}
              </div>
            ))}
          </div>

          {state.padraoCentral && (
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-primary" />
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
