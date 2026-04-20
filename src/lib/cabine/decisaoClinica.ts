/**
 * CAMADA DE DECISÃO CLÍNICA — sobre co_mapa_vivo
 *
 * Módulo aditivo: NÃO altera nem substitui a lógica existente
 * (motorMapaVivo, decisaoCampoColetivo, refreshMapaVivo).
 * Apenas calcula score, prioridade e sugestão de intervenção
 * a partir dos detectores recentes (últimos 7 dias).
 *
 * Princípios de segurança:
 * - Não diagnostica. Não substitui a terapeuta.
 * - Linguagem é sempre de apoio à decisão.
 */

import { supabase } from '@/lib/dal/dbClient';

export type DetectorTipo = 'estagnacao' | 'evitacao' | 'dissociacao' | 'fusao';
export type Intensidade = 'baixa' | 'media' | 'alta';
export type NivelRisco = 'baixo' | 'medio' | 'alto';

export interface ScoreClinico {
  categoria_dominante: DetectorTipo | null;
  scores_por_categoria: Record<DetectorTipo, number>;
  score_total: number;
  nivel_risco: NivelRisco;
  total_eventos: number;
}

export interface PrioridadeClinica {
  prioridade: DetectorTipo | 'nenhuma';
  motivo: string;
  confianca: 'baixa' | 'media' | 'alta';
  alerta_critico: boolean;
  alerta_ciclo: boolean;
}

export interface SugestaoIntervencao {
  tipo_intervencao:
    | 'pergunta_ruptura'
    | 'confronto_leve'
    | 'grounding_corpo'
    | 'separacao_simbolica'
    | 'sustentar_presenca';
  titulo: string;
  exemplo_fala: string;
  objetivo: string;
}

export interface PrioridadeSessao {
  score: ScoreClinico;
  prioridade: PrioridadeClinica;
  sugestao: SugestaoIntervencao;
}

// ─────────────────────────────────────────────
// 1. PESOS
// ─────────────────────────────────────────────
const PESOS: Record<DetectorTipo, Record<Intensidade, number>> = {
  estagnacao:   { baixa: 1, media: 2, alta: 4 },
  evitacao:     { baixa: 1, media: 2, alta: 3 },
  dissociacao:  { baixa: 1, media: 2, alta: 3 },
  fusao:        { baixa: 1, media: 2, alta: 4 },
};

// ─────────────────────────────────────────────
// 2. SCORE CLÍNICO
// ─────────────────────────────────────────────
export function calcularScoreClinico(
  detectores: Array<{ detector_tipo: DetectorTipo; intensidade: Intensidade }>
): ScoreClinico {
  const scores: Record<DetectorTipo, number> = {
    estagnacao: 0, evitacao: 0, dissociacao: 0, fusao: 0,
  };

  for (const d of detectores) {
    const peso = PESOS[d.detector_tipo]?.[d.intensidade] ?? 0;
    scores[d.detector_tipo] += peso;
  }

  const total = scores.estagnacao + scores.evitacao + scores.dissociacao + scores.fusao;

  let dominante: DetectorTipo | null = null;
  let maior = 0;
  (Object.keys(scores) as DetectorTipo[]).forEach((k) => {
    if (scores[k] > maior) { maior = scores[k]; dominante = k; }
  });

  let nivel_risco: NivelRisco = 'baixo';
  if (total >= 10 || maior >= 6) nivel_risco = 'alto';
  else if (total >= 5 || maior >= 3) nivel_risco = 'medio';

  return {
    categoria_dominante: dominante,
    scores_por_categoria: scores,
    score_total: total,
    nivel_risco,
    total_eventos: detectores.length,
  };
}

// ─────────────────────────────────────────────
// 3. PRIORIDADE CLÍNICA
// ─────────────────────────────────────────────
export function calcularPrioridade(
  score: ScoreClinico,
  detectores: Array<{ detector_tipo: DetectorTipo; intensidade: Intensidade }>
): PrioridadeClinica {
  if (!score.categoria_dominante || score.total_eventos === 0) {
    return {
      prioridade: 'nenhuma',
      motivo: 'Sem sinais recentes suficientes para definir prioridade.',
      confianca: 'baixa',
      alerta_critico: false,
      alerta_ciclo: false,
    };
  }

  const fusaoAlta = detectores.some(d => d.detector_tipo === 'fusao' && d.intensidade === 'alta');
  const dissocAlta = detectores.some(d => d.detector_tipo === 'dissociacao' && d.intensidade === 'alta');
  const estagnAlta = detectores.some(d => d.detector_tipo === 'estagnacao' && d.intensidade === 'alta');
  const estagnFreq = detectores.filter(d => d.detector_tipo === 'estagnacao').length;

  const alerta_critico = fusaoAlta || dissocAlta;
  const alerta_ciclo = estagnAlta && estagnFreq >= 3;

  let prioridade: DetectorTipo = score.categoria_dominante;
  let motivo = `Categoria com maior peso recente (${score.scores_por_categoria[prioridade]} pts em 7 dias).`;

  if (alerta_critico) {
    prioridade = fusaoAlta ? 'fusao' : 'dissociacao';
    motivo = fusaoAlta
      ? 'Sinais de fusão em alta intensidade — campo emocional pode estar transbordando.'
      : 'Sinais de dissociação em alta intensidade — presença pode estar reduzida.';
  } else if (alerta_ciclo) {
    prioridade = 'estagnacao';
    motivo = `Estagnação repetida (${estagnFreq} marcações) sugere ciclo travado.`;
  }

  let confianca: 'baixa' | 'media' | 'alta' = 'baixa';
  if (score.total_eventos >= 6) confianca = 'alta';
  else if (score.total_eventos >= 3) confianca = 'media';

  return { prioridade, motivo, confianca, alerta_critico, alerta_ciclo };
}

// ─────────────────────────────────────────────
// 4. SUGESTÃO DE INTERVENÇÃO
// ─────────────────────────────────────────────
const MAPA_INTERVENCAO: Record<DetectorTipo, SugestaoIntervencao> = {
  estagnacao: {
    tipo_intervencao: 'pergunta_ruptura',
    titulo: 'Pergunta de ruptura',
    exemplo_fala:
      '"Se essa história não fosse mais verdade, o que sobraria de você aí dentro?"',
    objetivo: 'Quebrar a repetição narrativa e abrir espaço para um novo eixo.',
  },
  evitacao: {
    tipo_intervencao: 'confronto_leve',
    titulo: 'Confronto leve + nomeação',
    exemplo_fala:
      '"Percebo que toda vez que chegamos perto disso, você muda de assunto. Posso nomear o que vejo?"',
    objetivo: 'Trazer ao campo o que está sendo contornado, sem invadir.',
  },
  dissociacao: {
    tipo_intervencao: 'grounding_corpo',
    titulo: 'Grounding e retorno ao corpo',
    exemplo_fala:
      '"Antes de continuarmos, quero que você sinta os pés no chão. Onde no corpo isso vive agora?"',
    objetivo: 'Reconectar presença e sensação corporal antes de qualquer aprofundamento.',
  },
  fusao: {
    tipo_intervencao: 'separacao_simbolica',
    titulo: 'Separação simbólica',
    exemplo_fala:
      '"Vamos colocar isso à sua frente por um momento. Se essa dor tivesse forma, como ela apareceria?"',
    objetivo: 'Criar distância simbólica entre a cliente e o conteúdo emocional fundido.',
  },
};

const INTERVENCAO_NEUTRA: SugestaoIntervencao = {
  tipo_intervencao: 'sustentar_presenca',
  titulo: 'Sustentar presença',
  exemplo_fala: '"Estou aqui. Pode levar o tempo que precisar."',
  objetivo: 'Manter campo aberto, sem forçar direção. Apenas acompanhar.',
};

export function getSugestaoIntervencao(prioridade: PrioridadeClinica): SugestaoIntervencao {
  if (prioridade.prioridade === 'nenhuma') return INTERVENCAO_NEUTRA;
  return MAPA_INTERVENCAO[prioridade.prioridade];
}

// ─────────────────────────────────────────────
// 5. ORQUESTRADOR — busca detectores e devolve pacote completo
// ─────────────────────────────────────────────
export async function getPrioridadeSessao(clientUserId: string): Promise<PrioridadeSessao> {
  const seteDiasAtras = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data } = await supabase
    .from('co_detectores_eventos')
    .select('detector_tipo, intensidade')
    .eq('client_user_id', clientUserId)
    .gte('created_at', seteDiasAtras)
    .order('created_at', { ascending: false })
    .limit(50);

  const detectores = (data || []) as Array<{
    detector_tipo: DetectorTipo;
    intensidade: Intensidade;
  }>;

  const score = calcularScoreClinico(detectores);
  const prioridade = calcularPrioridade(score, detectores);
  const sugestao = getSugestaoIntervencao(prioridade);

  return { score, prioridade, sugestao };
}
