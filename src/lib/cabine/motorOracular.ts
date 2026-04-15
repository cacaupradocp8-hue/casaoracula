/**
 * MOTOR ORACULAR DETERMINÍSTICO
 * 
 * Converte leitura de condução (co_cartografia_profile) + metadados de sessão
 * em Estado do Campo + Direção de Condução.
 * 
 * As Oráculas operam invisivelmente — a terapeuta vê apenas
 * Estado e Direção, nunca o nome da Orácula.
 */

export type EstadoCampo =
  | 'excesso_de_mente'
  | 'repeticao_de_padrao'
  | 'divisao_interna'
  | 'desorganizacao_leve'
  | 'integracao_emergente'
  | 'ciclo_em_fechamento'
  | 'inicio_de_processo'
  | 'campo_estavel';

export type DirecaoConducao =
  | 'dialogo'
  | 'espelho'
  | 'integracao'
  | 'ciclo'
  | 'leitura'
  | 'sustentacao'
  | 'contencao';

export type NivelRisco = 'baixo' | 'moderado' | 'elevado';

export interface LeituraCampo {
  estado: EstadoCampo;
  direcao: DirecaoConducao;
  risco: NivelRisco;
  mensagem_estado: string;
  mensagem_direcao: string;
  mensagem_permanencia: string | null;
  alerta_seguranca: string | null;
}

interface ProfileInput {
  padrao_dominante?: string;
  estrategia_defesa?: string;
  tensao_central?: string;
  ritmo_ideal?: string;
  direcao_inicial?: string;
  o_que_evitar?: string;
  o_que_priorizar?: string;
}

interface SessionMetadata {
  lastSessionDate: string | null;
  sessionCount?: number;
  intensidade_oracular?: string | null;
  oracula_inicial?: string | null;
}

// ================================
// ESTADO DO CAMPO — Detecção
// ================================

const ESTADO_LABELS: Record<EstadoCampo, string> = {
  excesso_de_mente: 'Excesso de mente',
  repeticao_de_padrao: 'Repetição de padrão',
  divisao_interna: 'Divisão interna',
  desorganizacao_leve: 'Desorganização leve',
  integracao_emergente: 'Integração emergente',
  ciclo_em_fechamento: 'Ciclo em fechamento',
  inicio_de_processo: 'Início de processo',
  campo_estavel: 'Campo estável',
};

const DIRECAO_LABELS: Record<DirecaoConducao, string> = {
  dialogo: 'Abrir espaço de diálogo interno',
  espelho: 'Oferecer espelho sem interpretar',
  integracao: 'Trabalhar integração entre partes',
  ciclo: 'Acompanhar encerramento de ciclo',
  leitura: 'Fazer leitura de campo antes de intervir',
  sustentacao: 'Sustentar mais antes de confrontar',
  contencao: 'Priorizar contenção e acolhimento',
};

function detectEstado(profile: ProfileInput, meta: SessionMetadata): EstadoCampo {
  const pd = (profile.padrao_dominante || '').toLowerCase();
  const ed = (profile.estrategia_defesa || '').toLowerCase();
  const tc = (profile.tensao_central || '').toLowerCase();

  // Início de processo — sem sessão anterior
  if (!meta.lastSessionDate) return 'inicio_de_processo';

  // Detecção por palavras-chave no perfil
  if (matchAny(pd, ['racionaliza', 'intelectualiza', 'mente', 'controle', 'analisa'])) {
    return 'excesso_de_mente';
  }
  if (matchAny(pd, ['repete', 'ciclo', 'loop', 'padrão', 'mesmo']) || matchAny(ed, ['repeti'])) {
    return 'repeticao_de_padrao';
  }
  if (matchAny(tc, ['divid', 'cisão', 'ambival', 'conflito', 'entre'])) {
    return 'divisao_interna';
  }
  if (matchAny(tc, ['desorgani', 'confus', 'dispers', 'fragment'])) {
    return 'desorganizacao_leve';
  }
  if (matchAny(pd, ['integr', 'unifica', 'conecta', 'amadurec'])) {
    return 'integracao_emergente';
  }
  if (matchAny(pd, ['encerr', 'final', 'conclu', 'luto', 'despedida'])) {
    return 'ciclo_em_fechamento';
  }

  return 'campo_estavel';
}

// ================================
// DIREÇÃO DE CONDUÇÃO — Mapeamento
// ================================

const ESTADO_DIRECAO_MAP: Record<EstadoCampo, DirecaoConducao> = {
  excesso_de_mente: 'dialogo',
  repeticao_de_padrao: 'espelho',
  divisao_interna: 'integracao',
  desorganizacao_leve: 'contencao',
  integracao_emergente: 'sustentacao',
  ciclo_em_fechamento: 'ciclo',
  inicio_de_processo: 'leitura',
  campo_estavel: 'sustentacao',
};

// ================================
// RISCO — Avaliação
// ================================

function avaliarRisco(profile: ProfileInput, meta: SessionMetadata): NivelRisco {
  const intensidade = (meta.intensidade_oracular || '').toLowerCase();
  const tc = (profile.tensao_central || '').toLowerCase();
  const evitar = (profile.o_que_evitar || '').toLowerCase();

  if (intensidade === 'alta' || matchAny(tc, ['crise', 'ruptura', 'colapso', 'descompens'])) {
    return 'elevado';
  }
  if (matchAny(evitar, ['confronto', 'aprofund', 'pressa']) || intensidade === 'media') {
    return 'moderado';
  }
  return 'baixo';
}

// ================================
// PERMANÊNCIA — Priorizar antes de transição
// ================================

function mensagemPermanencia(estado: EstadoCampo, risco: NivelRisco): string | null {
  if (risco === 'elevado') {
    return 'Este campo ainda está ativo e sensível. Não avance agora — sustente.';
  }
  if (estado === 'integracao_emergente') {
    return 'Integração em curso. Permaneça neste campo antes de mudar de direção.';
  }
  if (estado === 'ciclo_em_fechamento') {
    return 'Ciclo em fechamento. Acompanhe sem apressar a conclusão.';
  }
  return null;
}

function alertaSeguranca(risco: NivelRisco, profile: ProfileInput): string | null {
  if (risco === 'elevado') {
    return 'Intensidade alta detectada. Evite confronto direto e aprofundamento excessivo. Priorize contenção e integração.';
  }
  if (risco === 'moderado' && profile.o_que_evitar) {
    return `Atenção: evitar ${profile.o_que_evitar}`;
  }
  return null;
}

// ================================
// FUNÇÃO PRINCIPAL
// ================================

export function calcularLeituraCampo(
  profileJson: ProfileInput | null,
  meta: SessionMetadata
): LeituraCampo {
  const profile = profileJson || {};
  const estado = detectEstado(profile, meta);
  const direcao = ESTADO_DIRECAO_MAP[estado];
  const risco = avaliarRisco(profile, meta);

  return {
    estado,
    direcao,
    risco,
    mensagem_estado: ESTADO_LABELS[estado],
    mensagem_direcao: DIRECAO_LABELS[direcao],
    mensagem_permanencia: mensagemPermanencia(estado, risco),
    alerta_seguranca: alertaSeguranca(risco, profile),
  };
}

// ================================
// HELPERS
// ================================

function matchAny(text: string, keywords: string[]): boolean {
  return keywords.some(kw => text.includes(kw));
}
