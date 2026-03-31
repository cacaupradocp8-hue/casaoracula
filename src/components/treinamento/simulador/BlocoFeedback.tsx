import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, ArrowRight, CheckCircle2, AlertTriangle, Info, MapPin, Activity, Compass, Wrench, BarChart3 } from 'lucide-react';
import { TrainingCase, RespostaAluna } from './types';
import { calcularFeedback, FeedbackResult } from './feedbackEngine';
import { useMemo } from 'react';

interface Props {
  caso: TrainingCase;
  resposta: RespostaAluna;
  onReset: () => void;
  onNextCaso: () => void;
  isLast: boolean;
}

const NIVEL_CONFIG = {
  coerente: {
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    icon: CheckCircle2,
    label: 'Leitura coerente',
  },
  ajuste: {
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
    badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    icon: Info,
    label: 'Precisa de refinamento',
  },
  erro: {
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
    badge: 'bg-red-500/15 text-red-400 border-red-500/30',
    icon: AlertTriangle,
    label: 'Ponto de atenção',
  },
};

function CoerenciaIndicator({ match, label }: { match: boolean; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      {match ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
      ) : (
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
      )}
      <span className={match ? 'text-emerald-400' : 'text-amber-400'}>{label}</span>
    </div>
  );
}

export function BlocoFeedback({ caso, resposta, onReset, onNextCaso, isLast }: Props) {
  const result: FeedbackResult = useMemo(
    () => calcularFeedback(caso, resposta),
    [caso, resposta]
  );

  const config = NIVEL_CONFIG[result.nivel];
  const NivelIcon = config.icon;

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground italic">
        Este retorno não indica certo ou errado. Indica coerência de leitura clínica.
      </p>

      {/* Resultado geral */}
      <Card className={`border ${config.bg}`}>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <NivelIcon className={`w-5 h-5 ${config.color}`} />
              <div>
                <p className={`text-sm font-medium ${config.color}`}>{config.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{result.resumo}</p>
              </div>
            </div>
            <Badge className={config.badge}>
              <BarChart3 className="w-3 h-3 mr-1" />
              {result.score}%
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Comparação estrutural */}
      <Card className="border-border/30">
        <CardContent className="p-4 space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Sua leitura</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" /> Distrito
              </div>
              <p className="text-sm text-foreground">{resposta.distrito_escolhido}</p>
              <CoerenciaIndicator
                match={result.distritoMatch}
                label={result.distritoMatch ? 'Alinhado com a referência' : `Referência: ${caso.distrito_esperado || '—'}`}
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Activity className="w-3 h-3" /> Estado
              </div>
              <p className="text-sm text-foreground capitalize">{resposta.estado_escolhido}</p>
              <CoerenciaIndicator
                match={result.estadoMatch}
                label={result.estadoMatch ? 'Alinhado com a referência' : `Referência: ${caso.estado_esperado || '—'}`}
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Wrench className="w-3 h-3" /> Ferramenta
              </div>
              <p className="text-sm text-foreground">{resposta.ferramenta_escolhida}</p>
              <CoerenciaIndicator
                match={result.ferramentaMatch}
                label={result.ferramentaMatch ? 'Alinhado com a referência' : `Referência: ${caso.ferramenta_principal || '—'}`}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hipótese de referência */}
      {caso.hipotese_esperada && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-primary" />
              <p className="text-xs font-medium text-primary/80 uppercase tracking-wider">Hipótese de referência</p>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">{caso.hipotese_esperada}</p>
            {caso.vetor_esperado && (
              <p className="text-xs text-muted-foreground italic mt-1">
                Vetor: {caso.vetor_esperado}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Feedbacks pedagógicos ativos */}
      {result.feedbacksAtivos.length > 0 && (
        <Card className="border-border/30">
          <CardContent className="p-4 space-y-3">
            {result.feedbacksAtivos.map(f => {
              const fConfig = NIVEL_CONFIG[f.tipo as keyof typeof NIVEL_CONFIG] || NIVEL_CONFIG.ajuste;
              return (
                <div key={f.id} className="space-y-1">
                  <p className={`text-xs font-medium ${fConfig.color}`}>
                    {f.tipo === 'coerente' ? 'Leitura coerente:' : f.tipo === 'ajuste' ? 'Ponto de refinamento:' : 'Risco de interpretação:'}
                  </p>
                  <p className="text-sm text-foreground/70 leading-relaxed">{f.feedback_texto}</p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Leituras de referência */}
      {result.leiturasRelevantes.length > 0 && (
        <Card className="border-border/30">
          <CardContent className="p-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Leituras de referência</p>
            {result.leiturasRelevantes.map(r => {
              const isErro = r.tipo === 'erro_comum';
              return (
                <div key={r.id} className="flex items-start gap-2">
                  {isErro ? (
                    <AlertTriangle className="w-3 h-3 text-red-400/60 shrink-0 mt-1" />
                  ) : (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400/60 shrink-0 mt-1" />
                  )}
                  <div>
                    <p className={`text-sm ${isErro ? 'text-foreground/50' : 'text-foreground/70'}`}>
                      {r.leitura}
                      {r.tipo === 'aceitavel' && <span className="text-xs text-muted-foreground ml-1">(aceitável)</span>}
                      {isErro && <span className="text-xs text-red-400/60 ml-1">(erro comum)</span>}
                    </p>
                    {r.observacao && <p className="text-xs text-muted-foreground italic">{r.observacao}</p>}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2">
        <Button onClick={onReset} variant="outline" className="flex-1 border-border/30">
          <RotateCcw className="w-4 h-4 mr-1" /> Rever leitura
        </Button>
        <Button onClick={onNextCaso} disabled={isLast} className="flex-1">
          {isLast ? 'Último caso' : <>Próximo caso <ArrowRight className="w-4 h-4 ml-1" /></>}
        </Button>
      </div>
    </div>
  );
}
