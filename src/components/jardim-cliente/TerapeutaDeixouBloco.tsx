import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { JardimEntry, Pratica } from '@/hooks/useClienteJardimCompleto';
import type { Orientacao } from '@/hooks/useOrientacoes';
import { OrientacaoCard } from '@/components/jardim/OrientacaoCard';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Props {
  orientacoesPendentes: Orientacao[];
  entriesTerapeuta: JardimEntry[];
  praticasPendentes: Pratica[];
  onVerTudo: () => void;
  onCompletarOrientacao: (id: string, resposta?: string) => Promise<boolean>;
  onResponderOrientacao: (id: string, resposta: string) => Promise<boolean>;
  onMarcarVistaOrientacao: (id: string) => void;
}

export function TerapeutaDeixouBloco({
  orientacoesPendentes,
  entriesTerapeuta,
  praticasPendentes,
  onVerTudo,
  onCompletarOrientacao,
  onResponderOrientacao,
  onMarcarVistaOrientacao,
}: Props) {
  const total = orientacoesPendentes.length + entriesTerapeuta.length + praticasPendentes.length;

  if (total === 0) {
    return (
      <Card className="border-emerald-500/10 bg-emerald-500/5">
        <CardContent className="py-6 text-center">
          <Leaf className="w-5 h-5 text-emerald-500/40 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground/60">
            Nenhuma orientação nova no momento.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Leaf className="w-4 h-4 text-emerald-500/70" />
          <span className="text-xs font-medium text-foreground/70">
            O que sua terapeuta deixou
          </span>
        </div>
        <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400">
          {total} {total === 1 ? 'novo' : 'novos'}
        </Badge>
      </div>

      <Card className="border-emerald-500/20 bg-gradient-to-b from-emerald-500/5 to-transparent">
        <CardContent className="p-4 space-y-3">
          {/* Orientações pendentes (max 2) */}
          {orientacoesPendentes.slice(0, 2).map((o) => (
            <OrientacaoCard
              key={o.id}
              orientacao={o}
              onComplete={onCompletarOrientacao}
              onRespond={onResponderOrientacao}
              onView={onMarcarVistaOrientacao}
            />
          ))}

          {/* Entries da terapeuta (max 2) */}
          {entriesTerapeuta.slice(0, 2).map((e) => (
            <div key={e.id} className="rounded-lg p-3 bg-emerald-950/20 border border-emerald-500/15">
              <div className="flex items-center gap-2 mb-1.5">
                <Badge variant="outline" className="text-[10px] border-emerald-500/20 text-emerald-400">
                  <Leaf className="w-3 h-3 mr-1" />
                  Mensagem
                </Badge>
                <span className="text-[10px] text-muted-foreground">
                  {format(new Date(e.created_at), "dd MMM", { locale: ptBR })}
                </span>
              </div>
              <p className="text-sm text-foreground/70 leading-relaxed">{e.content}</p>
            </div>
          ))}

          {/* Práticas pendentes (max 2) */}
          {praticasPendentes.slice(0, 2).map((p) => (
            <div key={p.id} className="rounded-lg p-3 bg-card/50 border border-border/20">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">🌱</span>
                <span className="text-xs font-medium text-foreground/80">{p.titulo}</span>
              </div>
              {p.descricao && (
                <p className="text-xs text-muted-foreground ml-6">{p.descricao.slice(0, 100)}</p>
              )}
            </div>
          ))}

          {total > 4 && (
            <Button variant="ghost" size="sm" className="w-full text-xs text-emerald-500 gap-1" onClick={onVerTudo}>
              Ver tudo <ArrowRight className="w-3 h-3" />
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
