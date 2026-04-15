/**
 * MOTOR ORACULAR DETERMINÍSTICO
 * 
 * Converte leitura de condução (co_cartografia_profile) + metadados de sessão
 * em Estado do Campo + Direção de Condução.
 * 
 * As Oráculas operam invisivelmente — a terapeuta vê apenas
 * Estado e Direção, nunca o nome da Orácula.
 * 
 * PRIORIDADE DE DETECÇÃO:
 * 1. Campos estruturados (estrategia_defesa, tensao_central, intensidade_oracular, oracula_inicial)
 * 2. Metadados de sessão (histórico, travessia, movimento)
 * 3. Keywords em texto (apoio secundário apenas)
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
  | 'contencao'
  | 'espelho_contencao'
  | 'dialogo_contencao'
  | 'integracao_contencao';

export type NivelRisco = 'baixo' | 'moderado' | 'elevado';

export interface LeituraCampo {
  estado: EstadoCampo;
  direcao: DirecaoConducao;
  risco: NivelRisco;
  estagio: EstagioCampo;
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

export type EstagioCampo = 'inicio' | 'meio' | 'fechamento';

interface SessionMetadata {
  lastSessionDate: string | null;
  sessionCount?: number;
  intensidade_oracular?: string | null;
  oracula_inicial?: string | null;
  /** Indica se há travessia/ritmo ativo */
  temTravessiaAtiva?: boolean;
  /** Indica se há movimento de integração ativo */
  temMovimentoAtivo?: boolean;
}

// ================================
// LABELS
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
  espelho_contencao: 'Espelhar com contenção — risco elevado',
  dialogo_contencao: 'Dialogar com contenção — risco elevado',
  integracao_contencao: 'Integrar com contenção — risco elevado',
};

// ================================
// MAPEAMENTO ORÁCULA → ESTADO
// ================================

const ORACULA_ESTADO_MAP: Record<string, EstadoCampo> = {
  mente: 'excesso_de_mente',
  espelho: 'repeticao_de_padrao',
  integracao: 'divisao_interna',
  contencao: 'desorganizacao_leve',
  ciclo: 'ciclo_em_fechamento',
  leitura: 'inicio_de_processo',
  sustentacao: 'integracao_emergente',
};

// ================================
// MAPEAMENTO ESTRATÉGIA → ESTADO
// ================================

const ESTRATEGIA_ESTADO_MAP: Record<string, EstadoCampo> = {
  racionalizacao: 'excesso_de_mente',
  intelectualizacao: 'excesso_de_mente',
  controle: 'excesso_de_mente',
  repeticao: 'repeticao_de_padrao',
  evitacao: 'repeticao_de_padrao',
  cisao: 'divisao_interna',
  dissociacao: 'divisao_interna',
  fragmentacao: 'desorganizacao_leve',
  dispersao: 'desorganizacao_leve',
  integracao: 'integracao_emergente',
  encerramento: 'ciclo_em_fechamento',
  luto: 'ciclo_em_fechamento',
};

// ================================
// MAPEAMENTO TENSÃO → ESTADO
// ================================

const TENSAO_ESTADO_MAP: Record<string, EstadoCampo> = {
  mente_corpo: 'excesso_de_mente',
  controle_entrega: 'excesso_de_mente',
  repeticao_mudanca: 'repeticao_de_padrao',
  padrao_liberdade: 'repeticao_de_padrao',
  divisao: 'divisao_interna',
  ambivalencia: 'divisao_interna',
  conflito_interno: 'divisao_interna',
  desorganizacao: 'desorganizacao_leve',
  confusao: 'desorganizacao_leve',
  integracao: 'integracao_emergente',
  fechamento: 'ciclo_em_fechamento',
  despedida: 'ciclo_em_fechamento',
};

// ================================
// ESTADO DO CAMPO — Detecção (3 camadas)
// ================================

function detectEstado(profile: ProfileInput, meta: SessionMetadata): EstadoCampo {
  // ─── CAMADA 0: Início de processo (regra robusta) ───
  const semHistorico = !meta.lastSessionDate && (!meta.sessionCount || meta.sessionCount === 0);
  const semTravessia = !meta.temTravessiaAtiva;
  const semMovimento = !meta.temMovimentoAtivo;

  if (semHistorico && semTravessia && semMovimento) {
    return 'inicio_de_processo';
  }

  // ─── CAMADA 1: Campos estruturados (prioridade máxima) ───

  // 1a. oracula_inicial → mapeamento direto
  const oracula = (meta.oracula_inicial || '').toLowerCase().trim();
  if (oracula && ORACULA_ESTADO_MAP[oracula]) {
    return ORACULA_ESTADO_MAP[oracula];
  }

  // 1b. intensidade_oracular alta → NÃO altera estado, apenas risco (tratado em avaliarRisco)

  // 1c. estrategia_defesa → mapeamento estruturado
  const ed = (profile.estrategia_defesa || '').toLowerCase().trim();
  if (ed && ESTRATEGIA_ESTADO_MAP[ed]) {
    return ESTRATEGIA_ESTADO_MAP[ed];
  }

  // 1d. tensao_central → mapeamento estruturado
  const tc = (profile.tensao_central || '').toLowerCase().trim();
  if (tc && TENSAO_ESTADO_MAP[tc]) {
    return TENSAO_ESTADO_MAP[tc];
  }

  // ─── CAMADA 2: Keywords como apoio secundário ───
  const pd = (profile.padrao_dominante || '').toLowerCase();
  const edText = (profile.estrategia_defesa || '').toLowerCase();
  const tcText = (profile.tensao_central || '').toLowerCase();

  if (matchAny(pd, ['racionaliza', 'intelectualiza', 'mente', 'controle', 'analisa'])) {
    return 'excesso_de_mente';
  }
  if (matchAny(pd, ['repete', 'ciclo', 'loop', 'padrão', 'mesmo']) || matchAny(edText, ['repeti'])) {
    return 'repeticao_de_padrao';
  }
  if (matchAny(tcText, ['divid', 'cisão', 'ambival', 'conflito', 'entre'])) {
    return 'divisao_interna';
  }
  if (matchAny(tcText, ['desorgani', 'confus', 'dispers', 'fragment'])) {
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
  const intensidade = (meta.intensidade_oracular || '').toLowerCase().trim();
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
// PERMANÊNCIA
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

/**
 * Trunca texto para payload seguro.
 * Remove quebras de linha e limita caracteres.
 */
export function sanitizePayloadText(text: string | null | undefined, maxLen = 80): string | null {
  if (!text) return null;
  const clean = text.replace(/[\n\r]+/g, ' ').trim();
  if (clean.length <= maxLen) return clean;
  return clean.substring(0, maxLen) + '…';
}
