import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RitualState } from './constants';
import { Flame, ArrowLeftRight, Sparkles, Calendar } from 'lucide-react';

export function TelaSintese({ state }: { state: RitualState }) {
  const topAprendizados = [...state.aprendizados].sort((a, b) => b.importancia - a.importancia).slice(0, 5);

  return (
    <div className="space-y-4">
      <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Flame className="w-5 h-5 text-primary" />
            Síntese — Ritual de Integração
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 rounded-lg bg-background/50 border border-border/20">
              <p className="text-2xl font-bold text-primary">{state.aprendizados.length}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Aprendizados</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50 border border-border/20">
              <p className="text-2xl font-bold text-primary">{state.elementos.length}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Elementos</p>
            </div>
          </div>

          {topAprendizados.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Principais Aprendizados</p>
              {topAprendizados.map((a, i) => (
                <div key={i} className="p-2 rounded-lg bg-background/20 border border-border/10 flex items-start gap-2">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary shrink-0">{a.area}</span>
                  <p className="text-xs text-foreground">{a.descricao}</p>
                </div>
              ))}
            </div>
          )}

          {(state.oQueDeixo || state.oQueLevo) && (
            <div className="grid grid-cols-2 gap-3">
              {state.oQueDeixo && (
                <div className="p-3 rounded-lg bg-background/30 border border-border/20">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><ArrowLeftRight className="w-3 h-3" /> Deixo para trás</p>
                  <p className="text-xs text-foreground">{state.oQueDeixo}</p>
                </div>
              )}
              {state.oQueLevo && (
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-xs text-primary mb-1 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Levo comigo</p>
                  <p className="text-xs text-foreground">{state.oQueLevo}</p>
                </div>
              )}
            </div>
          )}

          {state.simboloTransicao && (
            <div className="p-3 rounded-lg bg-background/30 border border-border/20 text-center">
              <p className="text-xs text-muted-foreground mb-1">Símbolo de Transição</p>
              <p className="text-sm font-medium text-foreground">"{state.simboloTransicao}"</p>
            </div>
          )}

          {state.elementos.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Elementos do Ritual</p>
              <div className="flex flex-wrap gap-1.5">
                {state.elementos.map((el, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary" title={el.significado}>
                    {el.nome}
                  </span>
                ))}
              </div>
            </div>
          )}

          {state.intencao && (
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Intenção</p>
              <p className="text-sm text-foreground italic">"{state.intencao}"</p>
            </div>
          )}

          {state.compromisso && (
            <div className="p-3 rounded-lg bg-background/30 border border-border/20">
              <p className="text-xs text-muted-foreground mb-1">Compromisso</p>
              <p className="text-sm text-foreground">{state.compromisso}</p>
            </div>
          )}

          {state.dataRitual && (
            <div className="p-3 rounded-lg bg-background/30 border border-border/20 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <p className="text-sm text-foreground">Ritual marcado para: <span className="font-medium">{new Date(state.dataRitual).toLocaleDateString('pt-BR')}</span></p>
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
