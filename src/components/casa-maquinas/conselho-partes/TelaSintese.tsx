import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConselhoState } from './constants';
import { Crown, MessageCircle, Lightbulb } from 'lucide-react';

export function TelaSintese({ state }: { state: ConselhoState }) {
  return (
    <div className="space-y-4">
      <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary" />
            Síntese — Conselho das Partes Internas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Conselho visual */}
          <div className="flex flex-wrap justify-center gap-3 py-4">
            {state.partes.map((p, i) => (
              <div key={i} className="text-center space-y-1">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg border-2 mx-auto" style={{ borderColor: p.cor, backgroundColor: `${p.cor}20` }}>
                  {p.nome?.charAt(0) || '?'}
                </div>
                <p className="text-[10px] font-medium text-foreground max-w-[60px] truncate">{p.nome}</p>
                <p className="text-[9px] text-muted-foreground">{p.tipo}</p>
              </div>
            ))}
          </div>

          {state.temaConselho && (
            <div className="p-3 rounded-lg bg-background/30 border border-border/20 text-center">
              <p className="text-xs text-muted-foreground mb-1">Tema do Conselho</p>
              <p className="text-sm font-medium text-foreground">"{state.temaConselho}"</p>
            </div>
          )}

          {/* Partes detail */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Vozes do Conselho</p>
            {state.partes.map((p, i) => (
              <div key={i} className="p-3 rounded-lg border border-border/20 bg-background/20 space-y-1" style={{ borderLeftColor: p.cor, borderLeftWidth: 3 }}>
                <p className="text-sm font-medium text-foreground">{p.nome}</p>
                {p.voz && <p className="text-xs text-muted-foreground italic">"{p.voz}"</p>}
                {p.desejo && <p className="text-xs text-muted-foreground">💛 Deseja: {p.desejo}</p>}
                {p.medo && <p className="text-xs text-muted-foreground">🔒 Teme: {p.medo}</p>}
              </div>
            ))}
          </div>

          {/* Dialogos */}
          {state.dialogos.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <MessageCircle className="w-3 h-3" /> Diálogos
              </p>
              {state.dialogos.map((d, i) => (
                <div key={i} className="p-2 rounded-lg bg-background/20 border border-border/10">
                  <p className="text-[10px] text-muted-foreground">
                    <span className="font-medium text-primary">{d.deParte}</span> → {d.paraParte === '__todos__' ? 'Todo o Conselho' : d.paraParte}
                  </p>
                  <p className="text-xs text-foreground mt-0.5">"{d.mensagem}"</p>
                </div>
              ))}
            </div>
          )}

          {/* Sabedoria */}
          {state.sabedoriaIntegrada && (
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-primary" />
                <p className="text-xs font-semibold text-primary uppercase tracking-wider">Sabedoria Integrada</p>
              </div>
              <p className="text-sm text-foreground">{state.sabedoriaIntegrada}</p>
            </div>
          )}

          {state.decisaoConselho && (
            <div className="p-3 rounded-lg bg-background/30 border border-border/20">
              <p className="text-xs text-muted-foreground mb-1">Decisão do Conselho</p>
              <p className="text-sm text-foreground italic">"{state.decisaoConselho}"</p>
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
