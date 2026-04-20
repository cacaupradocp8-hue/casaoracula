import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Target, MessageSquareQuote, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  getPrioridadeSessao,
  type PrioridadeSessao,
  type NivelRisco,
  type DetectorTipo,
} from '@/lib/cabine/decisaoClinica';

interface Props {
  clientUserId: string | null;
}

const RISCO_STYLE: Record<NivelRisco, { bg: string; border: string; text: string; dot: string; label: string }> = {
  baixo:  { bg: 'bg-emerald-500/5', border: 'border-emerald-500/20', text: 'text-emerald-300', dot: 'bg-emerald-400', label: 'risco baixo' },
  medio:  { bg: 'bg-amber-500/5',   border: 'border-amber-500/25',   text: 'text-amber-300',   dot: 'bg-amber-400',   label: 'risco médio' },
  alto:   { bg: 'bg-red-500/5',     border: 'border-red-500/30',     text: 'text-red-300',     dot: 'bg-red-400',     label: 'risco alto' },
};

const CATEGORIA_LABEL: Record<DetectorTipo | 'nenhuma', string> = {
  estagnacao:   'Estagnação',
  evitacao:     'Evitação',
  dissociacao:  'Dissociação',
  fusao:        'Fusão emocional',
  nenhuma:      'Sem prioridade definida',
};

export function BlocoPrioridadeSessao({ clientUserId }: Props) {
  const [data, setData] = useState<PrioridadeSessao | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!clientUserId) { setData(null); return; }
    let cancelled = false;
    setLoading(true);
    getPrioridadeSessao(clientUserId)
      .then((res) => { if (!cancelled) setData(res); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [clientUserId]);

  if (!clientUserId) return null;

  if (loading && !data) {
    return (
      <Card className="border-border/20 bg-card/40">
        <CardContent className="p-5 space-y-3">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const { score, prioridade, sugestao } = data;
  const risco = RISCO_STYLE[score.nivel_risco];
  const semDados = prioridade.prioridade === 'nenhuma';

  return (
    <Card className={cn('border-2', risco.border, risco.bg)}>
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={cn('w-2 h-2 rounded-full animate-pulse', risco.dot)} />
            <p className="text-[10px] uppercase tracking-[0.25em] text-foreground/60 font-semibold">
              Prioridade da Sessão
            </p>
          </div>
          <span className={cn('text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border', risco.border, risco.text)}>
            {risco.label}
          </span>
        </div>

        {/* Categoria dominante */}
        <div className="flex items-start gap-3">
          <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', risco.bg, 'border', risco.border)}>
            <Target className={cn('w-4 h-4', risco.text)} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] uppercase tracking-wider text-foreground/40 font-semibold mb-0.5">
              Categoria dominante
            </p>
            <h3 className="text-base font-display font-semibold text-foreground">
              {CATEGORIA_LABEL[prioridade.prioridade]}
            </h3>
            <p className="text-xs text-foreground/60 mt-1 leading-snug">{prioridade.motivo}</p>
          </div>
        </div>

        {/* Alertas críticos */}
        {(prioridade.alerta_critico || prioridade.alerta_ciclo) && (
          <div className="flex flex-wrap gap-1.5">
            {prioridade.alerta_critico && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-300 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> alerta crítico
              </span>
            )}
            {prioridade.alerta_ciclo && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold">
                ciclo repetitivo
              </span>
            )}
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-background/40 border border-border/20 text-foreground/60">
              confiança {prioridade.confianca}
            </span>
          </div>
        )}

        {/* Sugestão de intervenção */}
        {!semDados && (
          <div className="p-3 rounded-lg bg-background/40 border border-border/15 space-y-2">
            <div className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-primary/60" />
              <p className="text-[9px] uppercase tracking-wider text-primary/60 font-semibold">
                Sugestão de intervenção
              </p>
            </div>
            <p className="text-sm font-medium text-foreground/90">{sugestao.titulo}</p>
            <div className="flex items-start gap-2 pt-1">
              <MessageSquareQuote className="w-3.5 h-3.5 text-foreground/40 mt-0.5 shrink-0" />
              <p className="text-xs text-foreground/80 italic leading-relaxed">{sugestao.exemplo_fala}</p>
            </div>
            <p className="text-[10px] text-foreground/50 pt-1 border-t border-border/10">
              <span className="uppercase tracking-wider mr-1">Objetivo:</span>{sugestao.objetivo}
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-[9px] text-foreground/40 italic text-center pt-1">
          Apoio à decisão clínica — não substitui sua escuta nem oferece diagnóstico.
        </p>
      </CardContent>
    </Card>
  );
}
