// ============================================
// MAPA DO EGO FEMININO - STATE HOOK
// ============================================

import { useState, useCallback } from 'react';
import { MapaEgoState, MapaEgoEtapa, RespostaCamada, CAMADAS_EGO } from './types';

const ETAPAS_ORDEM: MapaEgoEtapa[] = ['exploracao', 'integracao', 'visualizacao', 'sintese', 'jardim'];

export function useMapaEgoState() {
  const [state, setState] = useState<MapaEgoState>(() => ({
    etapaAtual: 'exploracao',
    respostas: {},
    dataInicio: new Date().toISOString(),
  }));

  const atualizarResposta = useCallback((camadaId: string, respostas: string[], intensidade?: 'baixa' | 'media' | 'alta') => {
    setState((prev) => ({
      ...prev,
      respostas: {
        ...prev.respostas,
        [camadaId]: {
          camadaId,
          respostas,
          intensidade,
        },
      },
    }));
  }, []);

  const irParaEtapa = useCallback((etapa: MapaEgoEtapa) => {
    setState((prev) => ({
      ...prev,
      etapaAtual: etapa,
    }));
  }, []);

  const proximaEtapa = useCallback(() => {
    setState((prev) => {
      const indexAtual = ETAPAS_ORDEM.indexOf(prev.etapaAtual);
      if (indexAtual < ETAPAS_ORDEM.length - 1) {
        return {
          ...prev,
          etapaAtual: ETAPAS_ORDEM[indexAtual + 1],
        };
      }
      return prev;
    });
  }, []);

  const etapaAnterior = useCallback(() => {
    setState((prev) => {
      const indexAtual = ETAPAS_ORDEM.indexOf(prev.etapaAtual);
      if (indexAtual > 0) {
        return {
          ...prev,
          etapaAtual: ETAPAS_ORDEM[indexAtual - 1],
        };
      }
      return prev;
    });
  }, []);

  const setSinteseNarrativa = useCallback((sintese: string) => {
    setState((prev) => ({
      ...prev,
      sinteseNarrativa: sintese,
    }));
  }, []);

  const setReflexaoFinal = useCallback((reflexao: string) => {
    setState((prev) => ({
      ...prev,
      reflexaoFinal: reflexao,
    }));
  }, []);

  const finalizarMapa = useCallback(() => {
    setState((prev) => ({
      ...prev,
      dataConclusao: new Date().toISOString(),
    }));
  }, []);

  // Calcular progresso
  const progressoExploracao = Object.keys(state.respostas).length / CAMADAS_EGO.length;

  const podeAvancar = () => {
    switch (state.etapaAtual) {
      case 'exploracao':
        return progressoExploracao >= 0.6; // Mínimo 3 de 5 camadas
      case 'integracao':
        return true;
      case 'visualizacao':
        return true;
      case 'sintese':
        return true;
      case 'jardim':
        return false; // Última etapa
      default:
        return false;
    }
  };

  return {
    state,
    atualizarResposta,
    irParaEtapa,
    proximaEtapa,
    etapaAnterior,
    setSinteseNarrativa,
    setReflexaoFinal,
    finalizarMapa,
    progressoExploracao,
    podeAvancar: podeAvancar(),
    etapaIndex: ETAPAS_ORDEM.indexOf(state.etapaAtual),
    totalEtapas: ETAPAS_ORDEM.length,
  };
}
