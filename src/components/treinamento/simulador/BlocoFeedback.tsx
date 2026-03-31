import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, ArrowRight, CheckCircle2, AlertTriangle, MapPin, Activity, Compass, Wrench } from 'lucide-react';
import { TrainingCase, RespostaAluna } from './types';

interface Props {
  caso: TrainingCase;
  resposta: RespostaAluna;
  onReset: () => void;
  onNextCaso: () => void;
  isLast: boolean;
}

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
  const distritoMatch = resposta.distrito_escolhido === caso.distrito_esperado;
  const estadoMatch = resposta.estado_escolhido === caso.estado_esperado;
  const ferramentaMatch = resposta.ferramenta_escolhida === caso.ferramenta_principal;

  // Get feedbacks by type
  const feedbackCoerente = caso.feedbacks?.filter(f => f.tipo === 'coerente') || [];
  const feedbackAjuste = caso.feedbacks?.filter(f => f.tipo === 'ajuste') || [];
  const feedbackErro = caso.feedbacks?.filter(f => f.tipo === 'erro') || [];

  // Get readings by type
  const leituraEsperada = caso.readings?.filter(r => r.tipo === 'esperada') || [];
  const leituraErroComum = caso.readings?.filter(r => r.tipo === 'erro_comum') || [];

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground italic">
        Este retorno não indica certo ou errado. Indica coerência de leitura clínica.
      </p>

      {/* Comparação */}
      <Card className="border-border/30">
        <CardContent className="p-4 space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Sua leitura</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" /> Distrito
              </div>
              <p className="text-sm text-foreground">{resposta.distrito_escolhido}</p>
              <CoerenciaIndicator match={distritoMatch} label={distritoMatch ? 'Alinhado com a referência' : `Referência: ${caso.distrito_esperado || '—'}`} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Activity className="w-3 h-3" /> Estado
              </div>
              <p className="text-sm text-foreground capitalize">{resposta.estado_escolhido}</p>
              <CoerenciaIndicator match={estadoMatch} label={estadoMatch ? 'Alinhado com a referência' : `Referência: ${caso.estado_esperado || '—'}`} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Wrench className="w-3 h-3" /> Ferramenta
              </div>
              <p className="text-sm text-foreground">{resposta.ferramenta_escolhida}</p>
              <CoerenciaIndicator match={ferramentaMatch} label={ferramentaMatch ? 'Alinhado com a referência' : `Referência: ${caso.ferramenta_principal || '—'}`} />
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

      {/* Leituras esperadas */}
      {leituraEsperada.length > 0 && (
        <Card className="border-border/30">
          <CardContent className="p-4 space-y-2">
            <p className="text-xs font-medium text-emerald-400">Leituras de referência:</p>
            {leituraEsperada.map(r => (
              <div key={r.id} className="space-y-0.5">
                <p className="text-sm text-foreground/70">{r.leitura}</p>
                {r.observacao && <p className="text-xs text-muted-foreground italic">{r.observacao}</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Feedback qualitativo */}
      {(feedbackCoerente.length > 0 || feedbackAjuste.length > 0 || feedbackErro.length > 0) && (
        <Card className="border-border/30">
          <CardContent className="p-4 space-y-3">
            {feedbackCoerente.map(f => (
              <div key={f.id} className="space-y-1">
                <p className="text-xs font-medium text-emerald-400">Leitura coerente:</p>
                <p className="text-sm text-foreground/70">{f.feedback_texto}</p>
              </div>
            ))}
            {feedbackAjuste.map(f => (
              <div key={f.id} className="space-y-1">
                <p className="text-xs font-medium text-amber-400">Ponto de atenção:</p>
                <p className="text-sm text-foreground/70">{f.feedback_texto}</p>
              </div>
            ))}
            {feedbackErro.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-red-400/80">Riscos de interpretação:</p>
                <ul className="space-y-1">
                  {feedbackErro.map(f => (
                    <li key={f.id} className="text-sm text-foreground/60 flex items-start gap-1.5">
                      <AlertTriangle className="w-3 h-3 text-red-400/60 shrink-0 mt-0.5" />
                      {f.feedback_texto}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Erros comuns */}
      {leituraErroComum.length > 0 && (
        <Card className="border-red-500/10">
          <CardContent className="p-4 space-y-2">
            <p className="text-xs font-medium text-red-400/80">Erros comuns neste caso:</p>
            {leituraErroComum.map(r => (
              <div key={r.id} className="space-y-0.5">
                <p className="text-sm text-foreground/60">{r.leitura}</p>
                {r.observacao && <p className="text-xs text-muted-foreground italic">{r.observacao}</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2">
        <Button onClick={onReset} variant="outline" className="flex-1 border-border/30">
          <RotateCcw className="w-4 h-4 mr-1" /> Refazer
        </Button>
        <Button onClick={onNextCaso} disabled={isLast} className="flex-1">
          {isLast ? 'Último caso' : <>Próximo caso <ArrowRight className="w-4 h-4 ml-1" /></>}
        </Button>
      </div>
    </div>
  );
}
