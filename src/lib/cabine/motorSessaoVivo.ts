/**
 * MOTOR DE SESSÃO VIVA
 * 
 * 6 estados invisíveis de fluxo clínico:
 * PRESENCA → ESCUTA → CAMPO_RESPONDE → INTERVENCAO → INTEGRACAO → CONTINUIDADE
 * 
 * A terapeuta nunca vê esses nomes. Ela vê orientações contextuais.
 * Estados derivam de: tempo, inputs, mapa vivo, risco.
 */

import type { MapaVivoState } from './motorMapaVivo';
import type { LeituraCampo } from './motorOracular';

export type FluxoClinico = 
  | 'presenca' 
  | 'escuta' 
  | 'campo_responde' 
  | 'intervencao' 
  | 'integracao' 
  | 'continuidade';

export interface FluxoClinicoResult {
  fluxo: FluxoClinico;
  orientacao: string;
  sintheya_regra: string;
  sussurro_ativo: boolean;
  sussurro_motivo?: string;
  campo_aberto: boolean;      // se a terapeuta pode registrar livremente
  ferramenta_ativa: boolean;   // se a ferramenta deve estar visível
  sintese_ativa: boolean;      // se o registro de síntese deve emergir
  temperatura: 'fria' | 'morna' | 'quente'; // intensidade do campo
}

export interface FluxoContext {
  elapsedMinutes: number;
  checkinPreenchido: boolean;
  checkinTexto: string;
  ferramentaEscolhida: boolean;
  anotacoesLength: number;
  resumoPreenchido: boolean;
  mapaVivo: MapaVivoState | null;
  leitura: LeituraCampo | null;
  previousFluxo?: FluxoClinico;
}

// ========================================
// ORIENTAÇÕES CONTEXTUAIS (não labels)
// ========================================

const ORIENTACOES: Record<FluxoClinico, { orientacao: string; sintheya_regra: string }> = {
  presenca: {
    orientacao: 'Observe antes de agir. Sustente o silêncio. Perceba o que chega.',
    sintheya_regra: 'Respostas mínimas. Espelhar presença. Nenhuma interpretação.',
  },
  escuta: {
    orientacao: 'O campo está se revelando. Escute o que está entre as palavras.',
    sintheya_regra: 'Perguntas abertas. Descrever sem direcionar. Mapear o campo.',
  },
  campo_responde: {
    orientacao: 'Algo está emergindo. Mantenha a atenção sem capturar.',
    sintheya_regra: 'Pode nomear o que aparece. Sem interpretar. Sustentar a emergência.',
  },
  intervencao: {
    orientacao: 'O campo pediu intervenção. Conduza com direção e cuidado.',
    sintheya_regra: 'Pode sugerir aprofundamento. Manter direção clínica. Sem dispersar.',
  },
  integracao: {
    orientacao: 'Reduza a fala. Permita que o que foi vivido se organize.',
    sintheya_regra: 'Respostas curtas. Sem novas interpretações. Reforçar permanência.',
  },
  continuidade: {
    orientacao: 'Prepare o encerramento. O que foi vivido continua trabalhando.',
    sintheya_regra: 'Ajudar a organizar. Linguagem de continuidade, não de fechamento.',
  },
};

// ========================================
// DERIVAÇÃO DO FLUXO
// ========================================

export function deriveFluxoClinico(ctx: FluxoContext): FluxoClinicoResult {
  const {
    elapsedMinutes, checkinPreenchido, checkinTexto, ferramentaEscolhida,
    anotacoesLength, resumoPreenchido, mapaVivo, leitura, previousFluxo,
  } = ctx;

  let fluxo: FluxoClinico;
  let sussurro_ativo = false;
  let sussurro_motivo: string | undefined;

  // === DERIVAÇÃO DETERMINÍSTICA ===

  // CONTINUIDADE: tempo avançado OU resumo sendo preenchido
  if (elapsedMinutes >= 45 || resumoPreenchido) {
    fluxo = 'continuidade';
  }
  // INTEGRAÇÃO: mapa indica integração OU tempo avançado com anotações densas
  else if (
    mapaVivo?.integracao_em_curso ||
    (elapsedMinutes >= 35 && anotacoesLength > 100)
  ) {
    fluxo = 'integracao';
  }
  // INTERVENÇÃO: ferramenta escolhida + material emergindo
  else if (ferramentaEscolhida && anotacoesLength > 30) {
    fluxo = 'intervencao';
  }
  // CAMPO_RESPONDE: check-in denso ou ferramenta escolhida
  else if (
    (checkinPreenchido && checkinTexto.length > 50) ||
    ferramentaEscolhida
  ) {
    fluxo = 'campo_responde';
  }
  // ESCUTA: check-in iniciado
  else if (checkinPreenchido) {
    fluxo = 'escuta';
  }
  // PRESENÇA: início
  else {
    fluxo = 'presenca';
  }

  // === SUSSURRO: só em transições, risco ou padrões ===
  if (previousFluxo && previousFluxo !== fluxo) {
    sussurro_ativo = true;
    sussurro_motivo = getTransitionHint(previousFluxo, fluxo);
  }

  if (leitura?.risco === 'elevado') {
    sussurro_ativo = true;
    sussurro_motivo = 'Campo em risco elevado — sustente sem aprofundar';
  }

  if (mapaVivo?.repeticao_detectada && (fluxo === 'campo_responde' || fluxo === 'intervencao')) {
    sussurro_ativo = true;
    sussurro_motivo = 'Padrão recorrente — espelhe, não interprete';
  }

  // === TEMPERATURA DO CAMPO ===
  let temperatura: FluxoClinicoResult['temperatura'] = 'fria';
  if (leitura?.risco === 'elevado' || mapaVivo?.repeticao_detectada) {
    temperatura = 'quente';
  } else if (ferramentaEscolhida || anotacoesLength > 50) {
    temperatura = 'morna';
  }

  const config = ORIENTACOES[fluxo];

  return {
    fluxo,
    orientacao: config.orientacao,
    sintheya_regra: config.sintheya_regra,
    sussurro_ativo,
    sussurro_motivo,
    campo_aberto: fluxo !== 'presenca',
    ferramenta_ativa: ['campo_responde', 'intervencao'].includes(fluxo),
    sintese_ativa: ['integracao', 'continuidade'].includes(fluxo),
    temperatura,
  };
}

function getTransitionHint(from: FluxoClinico, to: FluxoClinico): string {
  if (to === 'escuta') return 'O campo começou a se abrir';
  if (to === 'campo_responde') return 'Algo está emergindo — mantenha presença';
  if (to === 'intervencao') return 'O campo pede direção';
  if (to === 'integracao') return 'Hora de reduzir — permita integração';
  if (to === 'continuidade') return 'Prepare o encerramento com cuidado';
  return 'Movimento no campo';
}

// ========================================
// CORES AMBIENTAIS (sutis, não rótulos)
// ========================================

export const FLUXO_AMBIENT: Record<FluxoClinico, string> = {
  presenca: 'border-blue-500/10 bg-blue-500/3',
  escuta: 'border-amber-500/10 bg-amber-500/3',
  campo_responde: 'border-primary/10 bg-primary/3',
  intervencao: 'border-primary/15 bg-primary/5',
  integracao: 'border-emerald-500/10 bg-emerald-500/3',
  continuidade: 'border-purple-500/10 bg-purple-500/3',
};

export const FLUXO_ACCENT: Record<FluxoClinico, string> = {
  presenca: 'text-blue-400/50',
  escuta: 'text-amber-400/50',
  campo_responde: 'text-primary/60',
  intervencao: 'text-primary/70',
  integracao: 'text-emerald-400/50',
  continuidade: 'text-purple-400/50',
};

// ========================================
// GERAR MENSAGEM PARA O JARDIM
// ========================================

export function gerarMensagemJardimVivo(
  fluxoAtual: FluxoClinico,
  mapaVivo: MapaVivoState | null,
): string {
  if (mapaVivo?.repeticao_detectada) {
    return 'Hoje revisitamos um campo que insiste em ser visto. Sua terapeuta sustentou a presença nesse lugar — sem pressa de mudar.';
  }
  if (mapaVivo?.integracao_em_curso) {
    return 'Algo em você está se reorganizando. Sua terapeuta acompanhou esse movimento com cuidado. Permita que continue.';
  }
  if (mapaVivo?.travessia_travada) {
    return 'Ainda estamos no mesmo campo — e isso não é estagnação. É permanência necessária. Confie no tempo do processo.';
  }
  if (fluxoAtual === 'integracao' || fluxoAtual === 'continuidade') {
    return 'A sessão de hoje chegou a um ponto de integração. Algo foi visto e sustentado. Leve isso com você.';
  }
  if (fluxoAtual === 'intervencao') {
    return 'Hoje abrimos um campo para exploração. O que apareceu merece atenção — observe nos próximos dias.';
  }
  return 'Sua terapeuta esteve presente com você hoje. O que foi vivido continua trabalhando dentro de você.';
}
