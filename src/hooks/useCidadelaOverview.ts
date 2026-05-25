import { useMemo } from 'react';
import { useJornadaHabitante } from './useJornadaHabitante';
import { useCidadelaEstado } from './useCidadelaEstado';
import { useTodasRotas } from './useTodasRotas';
import { useFormationProgress } from './useFormationProgress';
import { useTrainingOverview } from './useTrainingOverview';
import { CidadelaOverview } from '@/types/cidadelaOverview';


/**
 * HOOK AGREGADOR useCidadelaOverview V0.3
 * 
 * Camada de composição read-only para reunir dados pessoais, pedagógicos e simbólicos.
 * Foco exclusivo no domínio: CIDADELA_PESSOAL_ALUNA.
 * 
 * Fontes de dados:
 * - Jornada da Habitante (Milestones)
 * - Estado da Cidadela (Distritos, Travessias)
 * - Rotas da Casa (Estações, Progresso)
 * - Formação Orácula (Portais, Rituais)
 * 
 * Fontes PROIBIDAS: Dados clínicos, clientes, IA Syntheia, Atlas Coletivo.
 */
export function useCidadelaOverview(): CidadelaOverview {
  // 1. Carregar hooks permitidos
  const { 
    estagioInfo, 
    progresso: progressoJornada, 
    isLoading: loadingJornada 
  } = useJornadaHabitante();

  const { 
    estado: estadoCidadela, 
    isLoading: loadingCidadela 
  } = useCidadelaEstado();

  const { 
    data: rotasData, 
    isLoading: loadingRotas 
  } = useTodasRotas();

  const { 
    progress: formacaoProgress, 
    isLoading: loadingFormacao 
  } = useFormationProgress();

  const {
    modulosIniciados,
    exerciciosConcluidos,
    proximoTreino,
    loading: loadingTreinamento
  } = useTrainingOverview();

  // Consolidação de loading
  const isLoading = loadingJornada || loadingCidadela || loadingRotas || loadingFormacao || loadingTreinamento;


  // 2. Processar Overview via useMemo
  const overview = useMemo((): Omit<CidadelaOverview, 'isLoading' | 'error'> => {
    // ESTADO ATUAL
    const estadoAtual = {
      titulo: estagioInfo?.label || 'Visitante',
      descricao: `Progresso na jornada: ${progressoJornada}%`,
      distritoAtivo: estadoCidadela?.distrito_atual || null
    };

    // TRAVESSIAS (do histórico da Cidadela)
    const historicoRaw = estadoCidadela?.historico_travessias || [];
    const travessias = {
      total: historicoRaw.length,
      recentes: (Array.isArray(historicoRaw) ? [...historicoRaw] : [])
        .reverse()
        .slice(0, 3)
        .map((t: any, idx) => ({
          id: `trav-${idx}`,
          titulo: t.distrito || 'Travessia',
          contexto: t.contexto || t.tipo,
          data: t.completado_em
        }))
    };

    // ROTAS DA CASA
    const rotas = {
      emAndamento: rotasData?.filter(r => r.status === 'in_progress').length || 0,
      concluidas: rotasData?.filter(r => r.status === 'completed').length || 0,
      proximaRota: rotasData?.find(r => r.status === 'available' || r.status === 'in_progress') 
        ? {
            titulo: rotasData.find(r => r.status === 'available' || r.status === 'in_progress')!.titulo,
            href: `/rotas/${rotasData.find(r => r.status === 'available' || r.status === 'in_progress')!.id}`
          }
        : null
    };

    // TREINAMENTO (Campos neutros na V0.3 inicial por falta de hook de listagem global estável)
    const treinamento = {
      modulosIniciados: 0,
      exerciciosConcluidos: 0,
      proximoTreino: null
    };

    // FORMAÇÃO ORÁCULA
    const formacao = {
      cursosAtivos: formacaoProgress?.active_travessias?.length || 0,
      aulasConcluidas: formacaoProgress?.completed_travessias?.length || 0,
      proximoCurso: formacaoProgress?.active_travessias?.[0]
        ? {
            titulo: formacaoProgress.active_travessias[0].titulo,
            href: '/formacao' // Rota genérica para o painel de formação
          }
        : null
    };

    // PRÓXIMO PASSO SEGURO
    // Lógica de prioridade: Jornada > Formação > Rotas
    let proximoPasso: CidadelaOverview['proximoPasso'] = null;

    if (formacao.proximoCurso) {
      proximoPasso = {
        titulo: formacao.proximoCurso.titulo,
        descricao: 'Continue sua formação oracular.',
        href: formacao.proximoCurso.href,
        tipo: 'formacao'
      };
    } else if (rotas.proximaRota) {
      proximoPasso = {
        titulo: rotas.proximaRota.titulo,
        descricao: 'Avance para a próxima estação da Rota.',
        href: rotas.proximaRota.href,
        tipo: 'rotas'
      };
    } else {
      proximoPasso = {
        titulo: 'Explorar Cidadela',
        descricao: 'Sua jornada continua no coração da Casa.',
        href: '/cidadela',
        tipo: 'jornada'
      };
    }

    return {
      estadoAtual,
      travessias,
      rotas,
      treinamento,
      formacao,
      proximoPasso
    };
  }, [estagioInfo, progressoJornada, estadoCidadela, rotasData, formacaoProgress]);

  return {
    ...overview,
    isLoading,
    error: null // Erros são tratados individualmente nos hooks de origem se necessário
  };
}
