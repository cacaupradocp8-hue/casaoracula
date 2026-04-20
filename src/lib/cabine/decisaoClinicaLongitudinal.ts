/**
 * CAMADA LONGITUDINAL — Evolução Clínica
 *
 * Módulo ADITIVO sobre decisaoClinica.ts. Não altera nada existente.
 *
 * Adiciona:
 *  1. Tendência clínica (comparação 7d atual vs. 7d anteriores)
 *  2. Memória de intervenções aplicadas (co_intervencoes_aplicadas)
 *  3. Ajuste adaptativo da sugestão (rotacionar / sustentar / intensificar)
 *  4. Histórico do co_mapa_vivo
 */

import { supabase } from '@/lib/dal/dbClient';
import {
  calcularScoreClinico,
  calcularPrioridade,
  getSugestaoIntervencao,
  type DetectorTipo,
  type Intensidade,
  type SugestaoIntervencao,
  type PrioridadeSessao,
} from './decisaoClinica';

export type Direcao = 'subindo' | 'descendo' | 'estavel';

export interface TendenciaClinica {
  estagnacao: Direcao;
  evitacao: Direcao;
  dissociacao: Direcao;
  fusao: Direcao;
}

export interface IntervencaoAplicada {
  id: string;
  tipo_intervencao: string;
  categoria_alvo: DetectorTipo | null;
  resposta_cliente: string | null;
  percepcao_terapeuta: 'eficaz' | 'neutra' | 'sem_efeito' | null;
  created_at: string;
}

export type RecomendacaoAdaptativa = 'manter' | 'ajustar' | 'mudar';

export interface DecisaoEvolutiva extends PrioridadeSessao {
  tendencia: TendenciaClinica;
  historico: IntervencaoAplicada[];
  ultima_intervencao: IntervencaoAplicada | null;
  recomendacao: RecomendacaoAdaptativa;
  motivo_recomendacao: string;
  sugestao_adaptada: SugestaoIntervencao;
}

// ─────────────────────────────────────────────
// 1. TENDÊNCIA CLÍNICA
// ─────────────────────────────────────────────
function direcao(atual: number, anterior: number): Direcao {
  const diff = atual - anterior;
  if (Math.abs(diff) <= 1) return 'estavel';
  return diff > 0 ? 'subindo' : 'descendo';
}

export async function getTendenciaClinica(clientUserId: string): Promise<TendenciaClinica> {
  const agora = Date.now();
  const sete = 7 * 24 * 60 * 60 * 1000;
  const ini7 = new Date(agora - sete).toISOString();
  const ini14 = new Date(agora - 2 * sete).toISOString();

  const { data } = await supabase
    .from('co_detectores_eventos')
    .select('detector_tipo, intensidade, created_at')
    .eq('client_user_id', clientUserId)
    .gte('created_at', ini14)
    .order('created_at', { ascending: false })
    .limit(200);

  const recentes = (data || []).filter((d: any) => d.created_at >= ini7) as Array<{
    detector_tipo: DetectorTipo; intensidade: Intensidade;
  }>;
  const anteriores = (data || []).filter((d: any) => d.created_at < ini7) as Array<{
    detector_tipo: DetectorTipo; intensidade: Intensidade;
  }>;

  const sA = calcularScoreClinico(recentes).scores_por_categoria;
  const sB = calcularScoreClinico(anteriores).scores_por_categoria;

  return {
    estagnacao: direcao(sA.estagnacao, sB.estagnacao),
    evitacao: direcao(sA.evitacao, sB.evitacao),
    dissociacao: direcao(sA.dissociacao, sB.dissociacao),
    fusao: direcao(sA.fusao, sB.fusao),
  };
}

// ─────────────────────────────────────────────
// 2. HISTÓRICO DE INTERVENÇÕES
// ─────────────────────────────────────────────
export async function getHistoricoIntervencao(
  clientUserId: string,
  limite = 10
): Promise<IntervencaoAplicada[]> {
  const { data } = await (supabase as any)
    .from('co_intervencoes_aplicadas')
    .select('id, tipo_intervencao, categoria_alvo, resposta_cliente, percepcao_terapeuta, created_at')
    .eq('client_user_id', clientUserId)
    .order('created_at', { ascending: false })
    .limit(limite);
  return (data || []) as unknown as IntervencaoAplicada[];
}

export async function registrarIntervencaoAplicada(input: {
  client_user_id: string;
  therapist_user_id: string;
  session_id?: string | null;
  tipo_intervencao: string;
  categoria_alvo?: DetectorTipo | null;
  resposta_cliente?: string | null;
  percepcao_terapeuta?: 'eficaz' | 'neutra' | 'sem_efeito' | null;
}) {
  return await supabase.from('co_intervencoes_aplicadas' as any).insert(input as any);
}

// ─────────────────────────────────────────────
// 3. SUGESTÃO ALTERNATIVA (rotação)
// ─────────────────────────────────────────────
const ALTERNATIVAS: Record<DetectorTipo, SugestaoIntervencao> = {
  estagnacao: {
    tipo_intervencao: 'sustentar_presenca',
    titulo: 'Pausa silenciosa antes da pergunta',
    exemplo_fala: '"Antes de falar, vamos respirar juntas. O que muda quando o silêncio fica?"',
    objetivo: 'Romper o ciclo sem repetir a mesma chave de ruptura.',
  },
  evitacao: {
    tipo_intervencao: 'grounding_corpo',
    titulo: 'Ancorar no corpo antes de nomear',
    exemplo_fala: '"Onde no corpo você sente isso que estamos contornando? Vamos ali primeiro."',
    objetivo: 'Reduzir defesa cognitiva trazendo o tema pela via somática.',
  },
  dissociacao: {
    tipo_intervencao: 'separacao_simbolica',
    titulo: 'Recolher o campo antes de avançar',
    exemplo_fala: '"Vamos guardar isso por hoje. O que é seguro levar com você?"',
    objetivo: 'Conter, não aprofundar — restaurar perímetro de presença.',
  },
  fusao: {
    tipo_intervencao: 'pergunta_ruptura',
    titulo: 'Pergunta de diferenciação',
    exemplo_fala: '"Se essa dor não fosse sua, de quem ela seria primeiro?"',
    objetivo: 'Abrir distância simbólica por outra via, sem exposição direta.',
  },
};

// ─────────────────────────────────────────────
// 4. RECOMENDAÇÃO ADAPTATIVA
// ─────────────────────────────────────────────
function decidirRecomendacao(
  prioridadeCat: DetectorTipo | 'nenhuma',
  tendencia: TendenciaClinica,
  historico: IntervencaoAplicada[],
  sugestaoBase: SugestaoIntervencao
): { recomendacao: RecomendacaoAdaptativa; motivo: string; sugestao: SugestaoIntervencao } {
  if (prioridadeCat === 'nenhuma') {
    return {
      recomendacao: 'manter',
      motivo: 'Sem prioridade ativa — sustentar presença.',
      sugestao: sugestaoBase,
    };
  }

  const direcaoCat = tendencia[prioridadeCat];

  // Quantas vezes a mesma intervenção foi aplicada nas últimas 4
  const ultimas = historico.slice(0, 4);
  const mesmasSeguidas = ultimas.filter(
    (h) => h.tipo_intervencao === sugestaoBase.tipo_intervencao
  ).length;

  // Sem efeito percebido nas últimas 2?
  const ultimas2 = historico.slice(0, 2);
  const semEfeito =
    ultimas2.length >= 2 &&
    ultimas2.every(
      (h) =>
        h.tipo_intervencao === sugestaoBase.tipo_intervencao &&
        h.percepcao_terapeuta &&
        h.percepcao_terapeuta !== 'eficaz'
    );

  if (semEfeito || mesmasSeguidas >= 2) {
    return {
      recomendacao: 'mudar',
      motivo: 'Mesma intervenção repetida sem deslocamento — propor alternativa.',
      sugestao: ALTERNATIVAS[prioridadeCat],
    };
  }

  if (direcaoCat === 'subindo') {
    return {
      recomendacao: 'ajustar',
      motivo: `${prioridadeCat} em alta — intensificar com a intervenção atual de forma mais firme.`,
      sugestao: sugestaoBase,
    };
  }

  if (direcaoCat === 'descendo') {
    return {
      recomendacao: 'manter',
      motivo: `${prioridadeCat} em queda — sustentar o que vem funcionando.`,
      sugestao: sugestaoBase,
    };
  }

  return {
    recomendacao: 'manter',
    motivo: 'Campo estável — manter a direção atual.',
    sugestao: sugestaoBase,
  };
}

// ─────────────────────────────────────────────
// 5. ORQUESTRADOR EVOLUTIVO
// ─────────────────────────────────────────────
export async function getDecisaoEvolutiva(clientUserId: string): Promise<DecisaoEvolutiva> {
  const seteDiasAtras = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [{ data: detectores }, tendencia, historico] = await Promise.all([
    supabase
      .from('co_detectores_eventos')
      .select('detector_tipo, intensidade')
      .eq('client_user_id', clientUserId)
      .gte('created_at', seteDiasAtras)
      .order('created_at', { ascending: false })
      .limit(50),
    getTendenciaClinica(clientUserId),
    getHistoricoIntervencao(clientUserId, 10),
  ]);

  const dets = (detectores || []) as Array<{
    detector_tipo: DetectorTipo; intensidade: Intensidade;
  }>;

  const score = calcularScoreClinico(dets);
  const prioridade = calcularPrioridade(score, dets);
  const sugestaoBase = getSugestaoIntervencao(prioridade);

  const { recomendacao, motivo, sugestao } = decidirRecomendacao(
    prioridade.prioridade,
    tendencia,
    historico,
    sugestaoBase
  );

  return {
    score,
    prioridade,
    sugestao: sugestaoBase,
    tendencia,
    historico,
    ultima_intervencao: historico[0] || null,
    recomendacao,
    motivo_recomendacao: motivo,
    sugestao_adaptada: sugestao,
  };
}
