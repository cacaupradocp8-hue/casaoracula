import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Sparkles, ArrowRight, Target, TrendingUp } from 'lucide-react';
import { TrainingCase, RespostaAluna } from './types';
import { ScoreBreakdown } from './scoringEngine';
import { FeedbackResult } from './feedbackEngine';

interface Props {
  caso: TrainingCase;
  resposta: RespostaAluna;
  score: ScoreBreakdown;
  result: FeedbackResult;
  proximoCaso: TrainingCase | null;
}

interface DimensaoStatus {
  label: string;
  acerto: boolean;
  parcial: boolean;
  pontos: number;
  max: number;
  refinamento?: string;
}

export function ResumoTreino({ caso, resposta, score, result, proximoCaso }: Props) {
  const dimensoes: DimensaoStatus[] = [
    {
      label: 'Distrito',
      acerto: score.distrito === 3,
      parcial: score.distrito === 2,
      pontos: score.distrito,
      max: 3,
      refinamento: score.distrito < 3
        ? `Referência: ${caso.distrito_esperado || '—'}`
        : undefined,
    },
    {
      label: 'Hipótese clínica',
      acerto: score.hipotese === 3,
      parcial: score.hipotese === 2 || score.hipotese === 1,
      pontos: score.hipotese,
      max: 3,
      refinamento: score.hipotese < 3
        ? 'Aproxime sua leitura dos termos simbólicos da referência.'
        : undefined,
    },
    {
      label: 'Ferramenta',
      acerto: score.ferramenta === 3,
      parcial: score.ferramenta === 2,
      pontos: score.ferramenta,
      max: 3,
      refinamento: score.ferramenta < 3
        ? `Sugerida: ${caso.ferramenta_principal || '—'}`
        : undefined,
    },
  ];

  const acertos = dimensoes.filter(d => d.acerto);
  const refinamentos = dimensoes.filter(d => !d.acerto);
  const pct = Math.round((score.total / 9) * 100);

  // Próximo passo na trilha
  const proximoPasso = (() => {
    if (score.total >= 7 && proximoCaso) {
      return {
        titulo: 'Avance para o próximo caso da trilha',
        descricao: proximoCaso.title,
        nivel: proximoCaso.nivel,
      };
    }
    if (score.total >= 4) {
      return {
        titulo: 'Refaça este caso refinando os pontos abaixo',
        descricao: refinamentos.length > 0
          ? `Foco em: ${refinamentos.map(r => r.label.toLowerCase()).join(', ')}`
          : 'Releia a hipótese de referência antes de avançar.',
        nivel: caso.nivel,
      };
    }
    return {
      titulo: 'Revisite a leitura simbólica antes de seguir',
      descricao: 'Releia o caso com o Modo Mentora ativado e tente novamente.',
      nivel: caso.nivel,
    };
  })();

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent overflow-hidden">
      <CardContent className="p-5 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <p className="text-[10px] font-medium text-primary uppercase tracking-[0.15em]">
                Resumo do Treino
              </p>
            </div>
            <p className="text-sm text-foreground/80 leading-snug max-w-md">
              Você refinou sua escuta hoje. Aqui está a síntese do que ficou claro e o que ainda pede atenção.
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-3xl font-light text-primary tabular-nums leading-none">{pct}%</p>
            <p className="text-[10px] text-muted-foreground mt-1">{score.total}/9 pontos</p>
          </div>
        </div>

        {/* Acertos */}
        {acertos.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <p className="text-[10px] font-medium text-emerald-400 uppercase tracking-wider">
                Seus acertos
              </p>
            </div>
            <div className="grid gap-1.5">
              {acertos.map(d => (
                <div
                  key={d.label}
                  className="flex items-center justify-between rounded-md border border-emerald-500/15 bg-emerald-500/5 px-3 py-2"
                >
                  <span className="text-sm text-foreground/85">{d.label}</span>
                  <span className="text-[10px] text-emerald-400 tabular-nums">
                    {d.pontos}/{d.max}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Refinamentos */}
        {refinamentos.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-amber-400" />
              <p className="text-[10px] font-medium text-amber-400 uppercase tracking-wider">
                Pontos de refinamento
              </p>
            </div>
            <div className="grid gap-1.5">
              {refinamentos.map(d => (
                <div
                  key={d.label}
                  className="rounded-md border border-amber-500/15 bg-amber-500/5 px-3 py-2 space-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground/85">{d.label}</span>
                    <span className="text-[10px] text-amber-400 tabular-nums">
                      {d.pontos}/{d.max}
                    </span>
                  </div>
                  {d.refinamento && (
                    <p className="text-xs text-muted-foreground leading-snug">
                      {d.refinamento}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Próximo passo */}
        <div className="pt-2 border-t border-primary/15">
          <div className="flex items-start gap-2.5">
            <div className="rounded-full bg-primary/15 p-1.5 mt-0.5">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-[10px] font-medium text-primary uppercase tracking-wider">
                Próximo passo na trilha
              </p>
              <p className="text-sm text-foreground/90 font-medium leading-snug">
                {proximoPasso.titulo}
              </p>
              <p className="text-xs text-muted-foreground leading-snug flex items-center gap-1.5">
                <ArrowRight className="w-3 h-3 shrink-0" />
                {proximoPasso.descricao}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
