import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CircleDot, Sparkles, BookOpen, HelpCircle, Hand, Waves, AlertTriangle, Pause, Loader2 } from 'lucide-react';
import type { CirculoSagrado } from '@/hooks/useCirculosSagrados';
import { calcularLeituraSimbolica, type LeituraSimbolica, type CirculoEncounterInput } from '@/lib/cabine/motorLeituraSimbolica';
import { supabase } from '@/lib/dal/dbClient';
import { cn } from '@/lib/utils';

interface Props {
  circulo: CirculoSagrado | null;
}

const RISCO_STYLES: Record<string, { bg: string; text: string; icon: string }> = {
  baixo: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', icon: '🟢' },
  moderado: { bg: 'bg-amber-500/10', text: 'text-amber-400', icon: '🟡' },
  elevado: { bg: 'bg-red-500/10', text: 'text-red-400', icon: '🔴' },
};

export function CabineCirculoCenterPanel({ circulo }: Props) {
  const [encounters, setEncounters] = useState<CirculoEncounterInput[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch group_encounters if circulo has an associated group
  useEffect(() => {
    if (!circulo) return;
    // Try to find encounters linked to this circulo via group_encounters
    setLoading(true);
    supabase
      .from('group_encounters')
      .select('theme, archetype_worked, notes, date')
      .order('date', { ascending: false })
      .limit(5)
      .then(({ data }) => {
        setEncounters((data || []) as CirculoEncounterInput[]);
        setLoading(false);
      });
  }, [circulo?.id]);

  const leitura = useMemo<LeituraSimbolica | null>(() => {
    if (!circulo) return null;
    return calcularLeituraSimbolica({
      nome_circulo: circulo.nome_circulo,
      ritual_base: circulo.ritual_base,
      distritos_ativados: circulo.distritos_ativados || [],
      participantes_count: circulo.participantes_ids?.length || 0,
      encontros_recentes: encounters,
    });
  }, [circulo, encounters]);

  if (!circulo) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-2">
          <CircleDot className="w-10 h-10 text-muted-foreground/20 mx-auto" />
          <p className="text-sm text-muted-foreground/50 italic">Selecione um círculo</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-primary/40" />
      </div>
    );
  }

  const riscoStyle = leitura ? RISCO_STYLES[leitura.risco_coletivo] : RISCO_STYLES.baixo;

  return (
    <div className="space-y-4">
      {/* Header simbólico */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
              <CircleDot className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-primary/70 font-semibold mb-1">
                Inteligência do Campo Simbólico
              </p>
              <h3 className="text-base font-display font-semibold text-foreground">
                {circulo.nome_circulo}
              </h3>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-background/30 border border-primary/10">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-primary/60 mt-0.5 shrink-0" />
              <div>
                <p className="text-[9px] text-primary/50 uppercase tracking-wider mb-0.5">Ritual base</p>
                <p className="text-sm text-foreground/90">{circulo.ritual_base}</p>
              </div>
            </div>
          </div>

          {circulo.distritos_ativados && circulo.distritos_ativados.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {circulo.distritos_ativados.map((d, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 border border-primary/15 text-primary/80"
                >
                  {d}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Leitura Simbólica */}
      {leitura && (
        <>
          {/* Estado + Direção + Risco */}
          <Card className="border-border/20 bg-card/40">
            <CardContent className="p-4 space-y-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 font-semibold">
                Leitura do Campo Simbólico
              </p>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-background/20 border border-border/10">
                  <p className="text-[9px] text-muted-foreground/50 uppercase tracking-wider mb-0.5">Estado do círculo</p>
                  <p className="text-xs text-foreground/80 font-medium capitalize">
                    {leitura.estado_circulo.replace(/circulo_em_/g, '').replace(/_/g, ' ')}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-background/20 border border-border/10">
                  <p className="text-[9px] text-muted-foreground/50 uppercase tracking-wider mb-0.5">Direção ritual</p>
                  <p className="text-xs text-foreground/80 font-medium capitalize">
                    {leitura.direcao_ritual.replace(/_/g, ' ')}
                  </p>
                </div>

                <div className={cn('p-2.5 rounded-lg border border-border/10 col-span-2', riscoStyle.bg)}>
                  <p className="text-[9px] text-muted-foreground/50 uppercase tracking-wider mb-0.5">Risco</p>
                  <p className={cn('text-xs font-medium capitalize', riscoStyle.text)}>
                    {riscoStyle.icon} {leitura.risco_coletivo}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-background/30 border border-primary/10">
                <div className="flex items-start gap-2">
                  <Waves className="w-4 h-4 text-primary/60 mt-0.5 shrink-0" />
                  <div className="space-y-1.5">
                    <p className="text-sm text-foreground/90">{leitura.mensagem_campo}</p>
                    <p className="text-xs text-muted-foreground/70 italic">{leitura.mensagem_direcao}</p>
                  </div>
                </div>
              </div>

              {leitura.frase_ritual && (
                <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/10 text-center">
                  <p className="text-xs text-foreground/80 italic">"{leitura.frase_ritual}"</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Permanência */}
          {leitura.permanencia && (
            <Card className="border-primary/15 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <Pause className="w-4 h-4 text-primary/60 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[9px] text-primary/50 uppercase tracking-wider mb-0.5 font-semibold">Permanência</p>
                    <p className="text-sm text-foreground/90 italic">{leitura.permanencia}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sugestões de Condução */}
          <Card className="border-border/20 bg-card/40">
            <CardContent className="p-4 space-y-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 font-semibold">
                Sugestões de Condução
              </p>

              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-background/20 border border-border/10">
                  <div className="flex items-start gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-primary/50 mt-0.5" />
                    <div>
                      <p className="text-[9px] text-muted-foreground/50 uppercase tracking-wider mb-0.5">Conto sugerido</p>
                      <p className="text-xs text-foreground/80 italic">{leitura.sugestoes.conto_sugerido}</p>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-background/20 border border-border/10">
                  <div className="flex items-start gap-2">
                    <HelpCircle className="w-3.5 h-3.5 text-primary/50 mt-0.5" />
                    <div>
                      <p className="text-[9px] text-muted-foreground/50 uppercase tracking-wider mb-0.5">Pergunta de abertura</p>
                      <p className="text-xs text-foreground/80">{leitura.sugestoes.pergunta_abertura}</p>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-background/20 border border-border/10">
                  <div className="flex items-start gap-2">
                    <Hand className="w-3.5 h-3.5 text-primary/50 mt-0.5" />
                    <div>
                      <p className="text-[9px] text-muted-foreground/50 uppercase tracking-wider mb-0.5">Gesto ritual</p>
                      <p className="text-xs text-foreground/80">{leitura.sugestoes.gesto_ritual}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
