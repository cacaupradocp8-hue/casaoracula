// ============================================
// MAPA DO EGO FEMININO - COMPONENTE PRINCIPAL
// ============================================

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Layers } from 'lucide-react';
import { useMapaEgoState } from './useMapaEgoState';
import { ETAPAS_INFO } from './types';
import { EtapaExploracao } from './EtapaExploracao';
import { EtapaIntegracao } from './EtapaIntegracao';
import { EtapaVisualizacao } from './EtapaVisualizacao';
import { EtapaSintese } from './EtapaSintese';
import { EtapaJardim } from './EtapaJardim';
import { cn } from '@/lib/utils';

interface MapaEgoFemininoProps {
  onComplete?: () => void;
}

export function MapaEgoFeminino({ onComplete }: MapaEgoFemininoProps) {
  const {
    state,
    atualizarResposta,
    proximaEtapa,
    etapaAnterior,
    setSinteseNarrativa,
    setReflexaoFinal,
    finalizarMapa,
    podeAvancar,
    etapaIndex,
    totalEtapas,
  } = useMapaEgoState();

  const etapaInfo = ETAPAS_INFO[state.etapaAtual];
  const progressoGeral = ((etapaIndex + 1) / totalEtapas) * 100;

  const handleComplete = () => {
    finalizarMapa();
    onComplete?.();
  };

  const renderEtapa = () => {
    switch (state.etapaAtual) {
      case 'exploracao':
        return (
          <EtapaExploracao
            respostas={state.respostas}
            onAtualizarResposta={atualizarResposta}
          />
        );
      case 'integracao':
        return <EtapaIntegracao respostas={state.respostas} />;
      case 'visualizacao':
        return <EtapaVisualizacao respostas={state.respostas} />;
      case 'sintese':
        return (
          <EtapaSintese
            respostas={state.respostas}
            sinteseNarrativa={state.sinteseNarrativa}
            onSinteseChange={setSinteseNarrativa}
          />
        );
      case 'jardim':
        return (
          <EtapaJardim
            respostas={state.respostas}
            sinteseNarrativa={state.sinteseNarrativa}
            reflexaoFinal={state.reflexaoFinal}
            onReflexaoChange={setReflexaoFinal}
            onSalvo={handleComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header da etapa */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-gold">
          <Layers className="w-5 h-5" />
          <span className="text-sm font-medium">
            Etapa {etapaIndex + 1} de {totalEtapas}
          </span>
        </div>
        <h2 className="text-xl font-semibold">{etapaInfo.titulo}</h2>
        <p className="text-sm text-muted-foreground">{etapaInfo.subtitulo}</p>
      </div>

      {/* Barra de progresso */}
      <Progress value={progressoGeral} className="h-1" />

      {/* Conteúdo da etapa */}
      <div className="min-h-[400px]">{renderEtapa()}</div>

      {/* Navegação */}
      <div className="flex justify-between pt-4 border-t border-border/50">
        <Button
          variant="ghost"
          onClick={etapaAnterior}
          disabled={etapaIndex === 0}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>

        {state.etapaAtual !== 'jardim' && (
          <Button
            onClick={proximaEtapa}
            disabled={!podeAvancar}
            className={cn(
              'gap-2',
              podeAvancar
                ? 'bg-gold hover:bg-gold/90 text-background'
                : 'bg-muted text-muted-foreground'
            )}
          >
            Continuar
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
