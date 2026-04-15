import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { MapaVivoState } from '@/lib/cabine/motorMapaVivo';
import { RITMO_LABELS } from '@/lib/cabine/motorMapaVivo';

const ESTADO_LABELS: Record<string, string> = {
  excesso_de_mente: 'Excesso de mente',
  repeticao_de_padrao: 'Repetição de padrão',
  divisao_interna: 'Divisão interna',
  desorganizacao_leve: 'Desorganização leve',
  integracao_emergente: 'Integração emergente',
  ciclo_em_fechamento: 'Ciclo em fechamento',
  inicio_de_processo: 'Início de processo',
  campo_estavel: 'Campo estável',
};

const RISCO_COLORS: Record<string, string> = {
  baixo: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  moderado: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  elevado: 'bg-red-500/20 text-red-300 border-red-500/30',
};

interface Props {
  state: MapaVivoState;
}

export function MapaVivoEstadoAtual({ state }: Props) {
  const ritmo = RITMO_LABELS[state.ritmo_atual] || RITMO_LABELS.adequado;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado Atual do Campo</h3>
          <Badge variant="outline" className={`text-[10px] ${RISCO_COLORS[state.risco_atual || 'baixo'] || ''}`}>
            Risco {state.risco_atual || 'baixo'}
          </Badge>
        </div>

        <div className="text-center py-2">
          <p className="text-lg font-display font-semibold text-foreground">
            {ESTADO_LABELS[state.estado_atual || ''] || 'Sem dados'}
          </p>
          {state.direcao_atual && (
            <p className="text-xs text-muted-foreground mt-1">
              Direção: {state.direcao_atual.replace(/_/g, ' ')}
            </p>
          )}
        </div>

        {state.tensao_principal && (
          <p className="text-xs text-muted-foreground/80 text-center italic">
            Tensão ativa: {state.tensao_principal}
          </p>
        )}

        <div className="flex items-center justify-center gap-2 pt-1">
          <span className="text-[10px] text-muted-foreground">Ritmo:</span>
          <span className={`text-xs font-medium ${ritmo.cor}`}>{ritmo.label}</span>
        </div>
      </CardContent>
    </Card>
  );
}
