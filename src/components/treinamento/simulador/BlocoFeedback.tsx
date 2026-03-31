import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, ArrowRight, CheckCircle2, AlertTriangle, MapPin, Activity, Compass, Wrench } from 'lucide-react';
import { CasoSimulado, RespostaAluna } from './types';

interface Props {
  caso: CasoSimulado;
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
  const distritoMatch = resposta.distrito_escolhido === caso.distrito_referencia;
  const estadoMatch = resposta.estado_escolhido === caso.estado_referencia;
  const ferramentaMatch = resposta.ferramenta_escolhida === caso.ferramenta_referencia;
  const fb = caso.feedback_json;

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
              <CoerenciaIndicator match={distritoMatch} label={distritoMatch ? 'Alinhado com a referência' : `Referência: ${caso.distrito_referencia}`} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Activity className="w-3 h-3" /> Estado
              </div>
              <p className="text-sm text-foreground capitalize">{resposta.estado_escolhido}</p>
              <CoerenciaIndicator match={estadoMatch} label={estadoMatch ? 'Alinhado com a referência' : `Referência: ${caso.estado_referencia}`} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Wrench className="w-3 h-3" /> Ferramenta
              </div>
              <p className="text-sm text-foreground">{resposta.ferramenta_escolhida}</p>
              <CoerenciaIndicator match={ferramentaMatch} label={ferramentaMatch ? 'Alinhado com a referência' : `Referência: ${caso.ferramenta_referencia}`} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hipótese de referência */}
      {caso.hipotese_referencia && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-primary" />
              <p className="text-xs font-medium text-primary/80 uppercase tracking-wider">Hipótese de referência</p>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">{caso.hipotese_referencia}</p>
            {caso.vetor_referencia && (
              <p className="text-xs text-muted-foreground italic mt-1">
                Vetor: {caso.vetor_referencia}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Feedback qualitativo */}
      <Card className="border-border/30">
        <CardContent className="p-4 space-y-3">
          {fb.coerencia_alta && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-emerald-400">Leitura coerente quando:</p>
              <p className="text-sm text-foreground/70">{fb.coerencia_alta}</p>
            </div>
          )}
          {fb.coerencia_media && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-amber-400">Ponto de atenção:</p>
              <p className="text-sm text-foreground/70">{fb.coerencia_media}</p>
            </div>
          )}
          {fb.riscos && fb.riscos.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-red-400/80">Riscos de interpretação:</p>
              <ul className="space-y-1">
                {fb.riscos.map((r, i) => (
                  <li key={i} className="text-sm text-foreground/60 flex items-start gap-1.5">
                    <AlertTriangle className="w-3 h-3 text-red-400/60 shrink-0 mt-0.5" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

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
