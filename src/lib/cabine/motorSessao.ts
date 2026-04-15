/**
 * MOTOR DE COREOGRAFIA DA SESSÃO
 * 
 * Define os 5 estágios da sessão e a lógica de transição:
 * abertura → leitura → exploração → integração → síntese
 * 
 * Regras determinísticas baseadas em:
 * - tempo decorrido
 * - interação da terapeuta (inputs preenchidos)
 * - estado do Mapa Vivo
 * - risco
 */

import type { MapaVivoState } from './motorMapaVivo';
import type { LeituraCampo } from './motorOracular';

export type SessionStage = 'abertura' | 'leitura' | 'exploracao' | 'integracao' | 'sintese';

export interface SessionStageResult {
  stage: SessionStage;
  label: string;
  orientacao: string;
  sintheya_regra: string;
  sussurro_ativo: boolean;
  sussurro_motivo?: string;
}

export interface SessionContext {
  elapsedMinutes: number;
  checkinPreenchido: boolean;
  ferramentaEscolhida: boolean;
  anotacoesPreenchidas: boolean;
  resumoPreenchido: boolean;
  mapaVivo: MapaVivoState | null;
  leitura: LeituraCampo | null;
  previousStage?: SessionStage;
}

// ========================================
// STAGE LABELS & ORIENTAÇÕES
// ========================================

const STAGE_CONFIG: Record<SessionStage, { label: string; orientacao: string; sintheya_regra: string }> = {
  abertura: {
    label: 'Abertura',
    orientacao: 'Escute sem interpretar. Valide a presença. Observe o nível de abertura vs defesa.',
    sintheya_regra: 'Respostas breves e acolhedoras. Não interpretar. Apenas espelhar presença.',
  },
  leitura: {
    label: 'Leitura do Campo',
    orientacao: 'Mapeie o campo com perguntas abertas. Sem direcionamento forte. Observe antes de agir.',
    sintheya_regra: 'Pode descrever o campo. Perguntas abertas. Sem direcionamento.',
  },
  exploracao: {
    label: 'Exploração',
    orientacao: 'Aprofunde com cuidado. Use a ferramenta escolhida. Mantenha a direção.',
    sintheya_regra: 'Pode sugerir perguntas e aprofundamentos. Manter direção clínica.',
  },
  integracao: {
    label: 'Integração',
    orientacao: 'Reduza a fala. Permita silêncio. Ofereça síntese leve sem fechar.',
    sintheya_regra: 'Respostas curtas. Sem novas interpretações. Reforçar permanência.',
  },
  sintese: {
    label: 'Síntese',
    orientacao: 'Organize o sentido. Defina próximo passo. Prepare envio ao Jardim.',
    sintheya_regra: 'Ajudar a organizar. Pode sugerir próximo passo. Linguagem de encerramento.',
  },
};

// ========================================
// DERIVAÇÃO DO ESTÁGIO
// ========================================

export function deriveSessionStage(ctx: SessionContext): SessionStageResult {
  const { elapsedMinutes, checkinPreenchido, ferramentaEscolhida, anotacoesPreenchidas, resumoPreenchido, mapaVivo, leitura, previousStage } = ctx;

  let stage: SessionStage;
  let sussurro_ativo = false;
  let sussurro_motivo: string | undefined;

  // REGRA DE SÍNTESE: tempo avançado OU resumo sendo preenchido
  if (elapsedMinutes >= 45 || resumoPreenchido) {
    stage = 'sintese';
  }
  // REGRA DE INTEGRAÇÃO: mapa vivo indica integração OU tempo avançado com anotações
  else if (
    mapaVivo?.integracao_em_curso ||
    (elapsedMinutes >= 35 && anotacoesPreenchidas)
  ) {
    stage = 'integracao';
  }
  // REGRA DE EXPLORAÇÃO: ferramenta escolhida e material ativo
  else if (ferramentaEscolhida && anotacoesPreenchidas) {
    stage = 'exploracao';
  }
  // REGRA DE EXPLORAÇÃO (tempo): ferramenta escolhida e tempo suficiente
  else if (ferramentaEscolhida && elapsedMinutes >= 10) {
    stage = 'exploracao';
  }
  // REGRA DE LEITURA: check-in feito, campo sendo mapeado
  else if (checkinPreenchido) {
    stage = 'leitura';
  }
  // DEFAULT: abertura
  else {
    stage = 'abertura';
  }

  // SUSSURRO: só aparece em transições, risco ou repetição
  if (previousStage && previousStage !== stage) {
    sussurro_ativo = true;
    sussurro_motivo = `Transição: ${STAGE_CONFIG[previousStage].label} → ${STAGE_CONFIG[stage].label}`;
  }

  if (leitura?.risco === 'elevado') {
    sussurro_ativo = true;
    sussurro_motivo = 'Risco elevado detectado';
  }

  if (mapaVivo?.repeticao_detectada && stage === 'exploracao') {
    sussurro_ativo = true;
    sussurro_motivo = 'Repetição de padrão — cuidado ao explorar';
  }

  const config = STAGE_CONFIG[stage];

  return {
    stage,
    label: config.label,
    orientacao: config.orientacao,
    sintheya_regra: config.sintheya_regra,
    sussurro_ativo,
    sussurro_motivo,
  };
}

// ========================================
// STAGE COLORS (para UI)
// ========================================

export const STAGE_COLORS: Record<SessionStage, string> = {
  abertura: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  leitura: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  exploracao: 'bg-primary/20 text-primary border-primary/30',
  integracao: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  sintese: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
};

export const STAGE_BG: Record<SessionStage, string> = {
  abertura: 'border-blue-500/15 bg-blue-500/5',
  leitura: 'border-amber-500/15 bg-amber-500/5',
  exploracao: 'border-primary/15 bg-primary/5',
  integracao: 'border-emerald-500/15 bg-emerald-500/5',
  sintese: 'border-purple-500/15 bg-purple-500/5',
};

// ========================================
// GERAR MENSAGEM PARA O JARDIM
// ========================================

export function gerarMensagemJardim(
  stageAtual: SessionStage,
  mapaVivo: MapaVivoState | null,
  resumo?: string,
): string {
  // Mensagens baseadas no estado + estágio
  if (mapaVivo?.repeticao_detectada) {
    return 'Hoje revisitamos um campo que insiste em ser visto. Sua terapeuta sustentou a presença nesse lugar — sem pressa de mudar.';
  }

  if (mapaVivo?.integracao_em_curso) {
    return 'Algo em você está se reorganizando. Sua terapeuta acompanhou esse movimento com cuidado. Permita que continue.';
  }

  if (mapaVivo?.travessia_travada) {
    return 'Ainda estamos no mesmo campo — e isso não é estagnação. É permanência necessária. Confie no tempo do processo.';
  }

  if (stageAtual === 'integracao' || stageAtual === 'sintese') {
    return 'A sessão de hoje chegou a um ponto de integração. Algo foi visto e sustentado. Leve isso com você.';
  }

  if (stageAtual === 'exploracao') {
    return 'Hoje abrimos um campo para exploração. O que apareceu merece atenção — observe nos próximos dias.';
  }

  return 'Sua terapeuta esteve presente com você hoje. O que foi vivido continua trabalhando dentro de você.';
}
