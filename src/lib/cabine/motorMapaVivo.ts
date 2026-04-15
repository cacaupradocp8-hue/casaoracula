/**
 * MOTOR MAPA VIVO — Detecção Longitudinal de Padrões
 * 
 * Analisa os últimos snapshots (client_live_map_entries) para detectar:
 * - Repetição de padrão
 * - Travessia travada
 * - Integração em curso
 * - Ciclo em fechamento sustentado
 * - Aceleração instável
 * - Ritmo da travessia
 * 
 * Regras puramente determinísticas, sem IA.
 */

import type { EstadoCampo, DirecaoConducao, NivelRisco } from './motorOracular';

export type RitmoTravessia = 'lento' | 'adequado' | 'acelerado' | 'travado';

export interface MapaVivoEntry {
  id: string;
  estado_campo: string;
  direcao_conducao: string;
  risco: string;
  estagio?: string;
  tensao_ativa?: string | null;
  ferramenta_utilizada?: string | null;
  ritmo_travessia?: string | null;
  tipo_registro: string;
  mensagem_simbolica?: string | null;
  created_at: string;
}

export interface MapaVivoState {
  estado_atual: string | null;
  direcao_atual: string | null;
  risco_atual: string | null;
  tensao_principal: string | null;
  ritmo_atual: RitmoTravessia;
  repeticao_detectada: boolean;
  travessia_travada: boolean;
  integracao_em_curso: boolean;
  metadata_json: {
    fechamento_sustentado?: boolean;
    aceleracao_instavel?: boolean;
    estados_recentes?: string[];
    direcoes_recentes?: string[];
  };
}

export interface PadroesDetectados {
  repeticao: boolean;
  repeticao_estado?: string;
  travessia_travada: boolean;
  integracao_em_curso: boolean;
  fechamento_sustentado: boolean;
  aceleracao_instavel: boolean;
}

// ========================================
// DETECÇÃO DE PADRÕES
// ========================================

export function detectarPadroes(entries: MapaVivoEntry[]): PadroesDetectados {
  if (entries.length < 2) {
    return {
      repeticao: false,
      travessia_travada: false,
      integracao_em_curso: false,
      fechamento_sustentado: false,
      aceleracao_instavel: false,
    };
  }

  // Últimos 5 registros (mais recentes primeiro)
  const ultimos5 = entries.slice(0, 5);
  const ultimos4 = entries.slice(0, 4);

  // 5.1 REPETIÇÃO: mesmo estado_campo 3x nos últimos 5
  const estadoCount: Record<string, number> = {};
  ultimos5.forEach(e => {
    estadoCount[e.estado_campo] = (estadoCount[e.estado_campo] || 0) + 1;
  });
  const estadoRepetido = Object.entries(estadoCount).find(([_, count]) => count >= 3);
  const repeticao = !!estadoRepetido;

  // 5.2 TRAVESSIA TRAVADA: mesma direção por 3 sessões consecutivas tipo 'sessao'
  const sessoes = entries.filter(e => e.tipo_registro === 'sessao').slice(0, 3);
  const travessia_travada = sessoes.length >= 3 &&
    sessoes.every(s => s.direcao_conducao === sessoes[0].direcao_conducao);

  // 5.3 INTEGRAÇÃO EM CURSO
  const estadoAtual = entries[0]?.estado_campo;
  const estadoAnterior = entries[1]?.estado_campo;
  const integracao_em_curso =
    estadoAtual === 'integracao_emergente' ||
    (estadoAnterior === 'divisao_interna' && estadoAtual === 'integracao_emergente');

  // 5.4 FECHAMENTO SUSTENTADO
  const ultimos2Sessoes = entries.filter(e => e.tipo_registro === 'sessao').slice(0, 2);
  const fechamento_sustentado = ultimos2Sessoes.length >= 2 &&
    ultimos2Sessoes.every(s => s.estado_campo === 'ciclo_em_fechamento');

  // 5.5 ACELERAÇÃO INSTÁVEL: ≥3 estados diferentes nos últimos 4 + risco elevado
  const estadosDistintos = new Set(ultimos4.map(e => e.estado_campo)).size;
  const riscoRecente = entries[0]?.risco;
  const aceleracao_instavel = estadosDistintos >= 3 && riscoRecente === 'elevado';

  return {
    repeticao,
    repeticao_estado: estadoRepetido?.[0],
    travessia_travada,
    integracao_em_curso,
    fechamento_sustentado,
    aceleracao_instavel,
  };
}

// ========================================
// RITMO DA TRAVESSIA
// ========================================

export function calcularRitmo(
  entries: MapaVivoEntry[],
  padroes: PadroesDetectados,
): RitmoTravessia {
  if (entries.length < 2) return 'adequado';

  // Travado: repetição + mesma direção + travessia travada
  if (padroes.repeticao && padroes.travessia_travada) return 'travado';

  // Acelerado: aceleração instável
  if (padroes.aceleracao_instavel) return 'acelerado';

  // Adequado: integração em curso + sem aceleração
  if (padroes.integracao_em_curso && !padroes.aceleracao_instavel) return 'adequado';

  // Lento: poucas mudanças + risco baixo
  const ultimos5 = entries.slice(0, 5);
  const estadosDistintos = new Set(ultimos5.map(e => e.estado_campo)).size;
  const riscoBaixo = entries[0]?.risco === 'baixo';
  if (estadosDistintos <= 1 && riscoBaixo) return 'lento';

  // Travado: repetição detectada isolada
  if (padroes.repeticao) return 'travado';

  return 'adequado';
}

// ========================================
// RECALCULAR ESTADO COMPLETO
// ========================================

export function recalcularEstado(entries: MapaVivoEntry[]): MapaVivoState {
  if (entries.length === 0) {
    return {
      estado_atual: null,
      direcao_atual: null,
      risco_atual: null,
      tensao_principal: null,
      ritmo_atual: 'adequado',
      repeticao_detectada: false,
      travessia_travada: false,
      integracao_em_curso: false,
      metadata_json: {},
    };
  }

  const mais_recente = entries[0];
  const padroes = detectarPadroes(entries);
  const ritmo = calcularRitmo(entries, padroes);

  return {
    estado_atual: mais_recente.estado_campo,
    direcao_atual: mais_recente.direcao_conducao,
    risco_atual: mais_recente.risco,
    tensao_principal: mais_recente.tensao_ativa || null,
    ritmo_atual: ritmo,
    repeticao_detectada: padroes.repeticao,
    travessia_travada: padroes.travessia_travada,
    integracao_em_curso: padroes.integracao_em_curso,
    metadata_json: {
      fechamento_sustentado: padroes.fechamento_sustentado,
      aceleracao_instavel: padroes.aceleracao_instavel,
      estados_recentes: entries.slice(0, 5).map(e => e.estado_campo),
      direcoes_recentes: entries.slice(0, 5).map(e => e.direcao_conducao),
    },
  };
}

// ========================================
// LABELS & HELPERS
// ========================================

export const RITMO_LABELS: Record<RitmoTravessia, { label: string; descricao: string; cor: string }> = {
  lento: { label: 'Lento', descricao: 'Poucas mudanças, campo estável mas pouca mobilidade', cor: 'text-blue-400' },
  adequado: { label: 'Adequado', descricao: 'Movimento consistente com sustentação', cor: 'text-emerald-400' },
  acelerado: { label: 'Acelerado', descricao: 'Mudanças rápidas — atenção ao risco', cor: 'text-amber-400' },
  travado: { label: 'Travado', descricao: 'Repetição detectada sem avanço de direção', cor: 'text-red-400' },
};

export const PADRAO_LABELS: Record<string, { label: string; descricao: string; icon: string }> = {
  repeticao: { label: 'Repetição detectada', descricao: 'O mesmo estado do campo apareceu 3 vezes nos últimos 5 registros', icon: '🔄' },
  travessia_travada: { label: 'Travessia travada', descricao: 'A mesma direção de condução por 3 sessões consecutivas', icon: '⚠️' },
  integracao_em_curso: { label: 'Integração em curso', descricao: 'Movimento de integração emergente ativo', icon: '🌱' },
  fechamento_sustentado: { label: 'Ciclo em fechamento', descricao: 'Ciclo em fechamento sustentado por múltiplas sessões', icon: '🌙' },
  aceleracao_instavel: { label: 'Aceleração instável', descricao: 'Mudanças rápidas de estado com risco elevado', icon: '⚡' },
};

/**
 * Gera mensagem simbólica para a versão da cliente (Jardim da Heroína).
 * Não expõe dados técnicos.
 */
export function gerarMensagemSimbolica(state: MapaVivoState): string {
  if (!state.estado_atual) return 'Sua jornada está sendo tecida.';

  if (state.repeticao_detectada) {
    return 'Um padrão antigo continua pedindo escuta. Não é hora de avançar — é hora de observar.';
  }
  if (state.travessia_travada) {
    return 'Você ainda está atravessando este campo. O tempo psíquico tem seu próprio ritmo.';
  }
  if (state.integracao_em_curso) {
    return 'O movimento está acontecendo, mesmo sem pressa. Algo se reorganiza dentro de você.';
  }
  if (state.metadata_json.fechamento_sustentado) {
    return 'Um ciclo se encerra. Permita que o fechamento aconteça sem forçar o novo.';
  }
  if (state.metadata_json.aceleracao_instavel) {
    return 'Ainda não é hora de avançar. É hora de sustentar.';
  }

  const mensagens: Record<string, string> = {
    excesso_de_mente: 'A mente busca controle. Convide o corpo a participar.',
    repeticao_de_padrao: 'Algo se repete, pedindo para ser visto de outra forma.',
    divisao_interna: 'Duas partes suas pedem espaço. Não escolha — escute ambas.',
    desorganizacao_leve: 'O campo está se reorganizando. Confie no processo.',
    integracao_emergente: 'Algo novo está se integrando. Sustente sem pressa.',
    ciclo_em_fechamento: 'Um ciclo se aproxima do fim. Honre o que foi vivido.',
    inicio_de_processo: 'O caminho está se abrindo. Cada passo conta.',
    campo_estavel: 'O campo está estável. Aproveite esta pausa para observar.',
  };

  return mensagens[state.estado_atual] || 'Sua jornada continua sendo tecida.';
}

// Direction labels for the therapist view
export const DIRECAO_CLINICA: Record<string, { sustentar: string; evitar: string; proxima: string }> = {
  dialogo: {
    sustentar: 'Espaço de diálogo interno, escuta sem pressa',
    evitar: 'Confronto direto, interpretações precipitadas',
    proxima: 'Aprofundar escuta ou oferecer espelho',
  },
  espelho: {
    sustentar: 'Reflexo sem julgamento, devolver o que aparece',
    evitar: 'Explicar ou racionalizar o que foi espelhado',
    proxima: 'Verificar se o espelho foi acolhido ou rejeitado',
  },
  integracao: {
    sustentar: 'Trabalho entre partes, pontes internas',
    evitar: 'Forçar síntese prematura',
    proxima: 'Acompanhar sustentação da integração',
  },
  ciclo: {
    sustentar: 'Acompanhar encerramento sem apressar',
    evitar: 'Trazer novos temas antes do fechamento',
    proxima: 'Ritualizar o encerramento quando maduro',
  },
  leitura: {
    sustentar: 'Observação do campo antes de intervir',
    evitar: 'Intervenção precoce sem leitura completa',
    proxima: 'Escolher direção após leitura consolidada',
  },
  sustentacao: {
    sustentar: 'Presença, acolhimento, não-ação consciente',
    evitar: 'Mudar de direção por ansiedade da terapeuta',
    proxima: 'Manter sustentação até sinal de movimento',
  },
  contencao: {
    sustentar: 'Contenção firme e acolhedora',
    evitar: 'Aprofundamento, confronto, interpretação',
    proxima: 'Reavaliar risco antes de abrir o campo',
  },
  espelho_contencao: {
    sustentar: 'Espelhar com segurança e limite claro',
    evitar: 'Confronto ou exposição excessiva',
    proxima: 'Reduzir risco antes de aprofundar',
  },
  dialogo_contencao: {
    sustentar: 'Diálogo contido, com limite de profundidade',
    evitar: 'Abrir campo emocional sem contenção',
    proxima: 'Avaliar se risco baixou para abrir mais',
  },
  integracao_contencao: {
    sustentar: 'Integração parcial, respeitando limites',
    evitar: 'Forçar integração completa sob risco elevado',
    proxima: 'Manter contenção até estabilização',
  },
};
