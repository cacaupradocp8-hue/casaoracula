import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, ShieldAlert, ShieldX, ArrowDown, ArrowUp, Minus, Lock } from 'lucide-react';
import type { DecisaoCampoColetivo } from '@/lib/cabine/decisaoCampoColetivo';
import { cn } from '@/lib/utils';

interface Props {
  decisao: DecisaoCampoColetivo;
}

const NIVEL_STYLES: Record<string, { bg: string; text: string; Icon: typeof ShieldCheck }> = {
  baixo: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', Icon: ShieldCheck },
  medio: { bg: 'bg-amber-500/10', text: 'text-amber-400', Icon: ShieldAlert },
  alto: { bg: 'bg-red-500/10', text: 'text-red-400', Icon: ShieldX },
};

export function BlocoDecisaoCampo({ decisao }: Props) {
  const nivelStyle = NIVEL_STYLES[decisao.nivel_intervencao] || NIVEL_STYLES.baixo;
  const NivelIcon = nivelStyle.Icon;

  const flags = [
    { label: 'Pode aprofundar', value: decisao.pode_aprofundar, positive: true },
    { label: 'Deve conter', value: decisao.deve_conter, positive: false },
    { label: 'Deve recentrar', value: decisao.deve_recentrar, positive: false },
    { label: 'Deve fechar', value: decisao.deve_fechar, positive: false },
    { label: 'Sustentar silêncio', value: decisao.deve_sustentar_silencio, positive: false },
  ].filter(f => f.value);

  return (
    <Card className="border-border/20 bg-card/40">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 font-semibold">
            Decisão do Campo
          </p>
          <div className={cn('flex items-center gap-1.5 px-2 py-0.5 rounded-full', nivelStyle.bg)}>
            <NivelIcon className={cn('w-3 h-3', nivelStyle.text)} />
            <span className={cn('text-[10px] font-semibold uppercase', nivelStyle.text)}>
              {decisao.nivel_intervencao}
            </span>
          </div>
        </div>

        {/* Flags ativas */}
        {flags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {flags.map(f => (
              <span
                key={f.label}
                className={cn(
                  'text-[10px] px-2 py-0.5 rounded-full border font-medium',
                  f.positive
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                )}
              >
                {f.positive ? '✓' : '⚠'} {f.label}
              </span>
            ))}
          </div>
        )}

        {/* Recomendação direta */}
        <div className="p-3 rounded-lg bg-background/30 border border-primary/10">
          <p className="text-[9px] text-primary/50 uppercase tracking-wider mb-1 font-semibold">Ação recomendada</p>
          <p className="text-sm text-foreground/90">{decisao.recomendacao_direta}</p>
        </div>

        {/* Bloqueio */}
        {decisao.bloqueio_acao && (
          <div className="p-2.5 rounded-lg bg-red-500/5 border border-red-500/15 flex items-start gap-2">
            <Lock className="w-3.5 h-3.5 text-red-400/70 mt-0.5 shrink-0" />
            <p className="text-xs text-red-300/80 italic">{decisao.bloqueio_acao}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
