/**
 * MOTOR DE LEITURA COLETIVA — Campo do Grupo Terapêutico
 * 
 * Analisa registros do jardim_grupo_registros para derivar:
 * - estado_campo_coletivo
 * - tensao_coletiva
 * - padrao_predominante_grupo
 * - direcao_conducao_grupo
 * - risco_coletivo
 * 
 * Regras puramente determinísticas, sem IA.
 */

import type { ClimaMovimento } from '@/types/jardim-grupo';

// ── Tipos ────────────────────────────────────────────────

export type EstadoCampoColetivo =
  | 'campo_coeso'
  | 'campo_fragmentado'
  | 'campo_tenso'
  | 'campo_estagnado'
  | 'campo_em_expansao'
  | 'campo_em_recolhimento'
  | 'campo_inicial';

export type PadraoPredominanteGrupo =
  | 'fusao_excessiva'
  | 'dispersao'
  | 'polarizacao'
  | 'co_regulacao'
  | 'silencio_coletivo'
  | 'movimento_circular'
  | 'sem_padrao_definido';

export type DirecaoConducaoGrupo =
  | 'acolher_e_conter'
  | 'ampliar_escuta'
  | 'nomear_tensao'
  | 'facilitar_fluidez'
  | 'sustentar_silencio'
  | 'integrar_movimento'
  | 'observar';

export type NivelRiscoColetivo = 'baixo' | 'moderado' | 'elevado';

export interface LeituraCampoColetivo {
  estado_campo_coletivo: EstadoCampoColetivo;
  tensao_coletiva: string | null;
  padrao_predominante_grupo: PadraoPredominanteGrupo;
  direcao_conducao_grupo: DirecaoConducaoGrupo;
  risco_coletivo: NivelRiscoColetivo;
  mensagem_estado: string;
  mensagem_direcao: string;
  alerta_risco: string | null;
  frase_simbolica: string | null;
}

interface RegistroInput {
  clima_movimento: ClimaMovimento | null;
  clima_descricao: string | null;
  escuta_campo: string | null;
  movimentos_repetidos: string | null;
  resistencias_grupais: string | null;
  fase_jornada_grupo: string | null;
  tema_simbolico: string | null;
  frase_semente_grupo: string | null;
  campo_fechado: boolean;
  data_registro: string;
}

// ── Mensagens ────────────────────────────────────────────

const MENSAGENS_ESTADO: Record<EstadoCampoColetivo, string> = {
  campo_coeso: 'O grupo move-se como organismo. O campo sustenta presença compartilhada.',
  campo_fragmentado: 'Há dispersão entre as participantes. O campo pede recolhimento.',
  campo_tenso: 'Tensão circula no campo. Algo precisa ser nomeado ou contido.',
  campo_estagnado: 'O campo parou. Repetição ou silêncio prolongado sem movimento.',
  campo_em_expansao: 'Expansão coletiva em curso. O campo abre e pede acompanhamento.',
  campo_em_recolhimento: 'O grupo recolhe-se. Momento de proteção e escuta interna.',
  campo_inicial: 'Campo ainda se constituindo. Observar antes de intervir.',
};

const MENSAGENS_DIRECAO: Record<DirecaoConducaoGrupo, string> = {
  acolher_e_conter: 'Priorizar acolhimento. Conter sem interpretar.',
  ampliar_escuta: 'Abrir espaço para vozes ainda silenciosas no grupo.',
  nomear_tensao: 'Nomear o que circula sem direcionar. Deixar o grupo responder.',
  facilitar_fluidez: 'Facilitar movimento — o campo está pronto para fluir.',
  sustentar_silencio: 'Silêncio é presença. Sustentar sem preencher.',
  integrar_movimento: 'Integrar o que emergiu. Ritual ou gesto de fechamento.',
  observar: 'Observar o campo antes de intervir. Escuta ativa.',
};

// ── Motor Principal ──────────────────────────────────────

export function calcularLeituraCampoColetivo(
  registros: RegistroInput[],
  participantesAtivos: number,
): LeituraCampoColetivo {
  // Sem registros → campo inicial
  if (!registros.length) {
    return {
      estado_campo_coletivo: 'campo_inicial',
      tensao_coletiva: null,
      padrao_predominante_grupo: 'sem_padrao_definido',
      direcao_conducao_grupo: 'observar',
      risco_coletivo: 'baixo',
      mensagem_estado: MENSAGENS_ESTADO.campo_inicial,
      mensagem_direcao: MENSAGENS_DIRECAO.observar,
      alerta_risco: null,
      frase_simbolica: null,
    };
  }

  // Últimos 5 registros para análise
  const recentes = registros.slice(0, 5);
  const ultimo = recentes[0];

  // ── 1. Derivar estado do campo ──
  const estado = derivarEstadoCampo(recentes);

  // ── 2. Derivar padrão predominante ──
  const padrao = derivarPadraoPredominante(recentes);

  // ── 3. Derivar direção de condução ──
  const direcao = derivarDirecaoConducao(estado, padrao);

  // ── 4. Avaliar risco ──
  const { risco, alerta } = avaliarRisco(recentes, participantesAtivos);

  // ── 5. Tensão coletiva ──
  const tensao = derivarTensaoColetiva(recentes);

  return {
    estado_campo_coletivo: estado,
    tensao_coletiva: tensao,
    padrao_predominante_grupo: padrao,
    direcao_conducao_grupo: direcao,
    risco_coletivo: risco,
    mensagem_estado: MENSAGENS_ESTADO[estado],
    mensagem_direcao: MENSAGENS_DIRECAO[direcao],
    alerta_risco: alerta,
    frase_simbolica: ultimo.frase_semente_grupo || null,
  };
}

// ── Derivações ───────────────────────────────────────────

function derivarEstadoCampo(registros: RegistroInput[]): EstadoCampoColetivo {
  const climas = registros.map(r => r.clima_movimento).filter(Boolean) as ClimaMovimento[];

  if (climas.length === 0) return 'campo_inicial';

  const contagem: Record<string, number> = {};
  climas.forEach(c => { contagem[c] = (contagem[c] || 0) + 1; });

  const dominante = Object.entries(contagem).sort((a, b) => b[1] - a[1])[0]?.[0];
  const todosIguais = climas.length >= 3 && new Set(climas).size === 1;
  const temResistencia = registros.some(r => r.resistencias_grupais && r.resistencias_grupais.length > 10);

  if (dominante === 'tensao') return 'campo_tenso';
  if (dominante === 'recolhimento') return 'campo_em_recolhimento';
  if (dominante === 'expansao' && !temResistencia) return 'campo_em_expansao';
  if (dominante === 'fluidez' && todosIguais) return 'campo_coeso';
  if (dominante === 'fluidez') return 'campo_coeso';

  // Stagnation: mesmos climas repetidos sem movimento
  if (todosIguais && dominante !== 'fluidez' && dominante !== 'expansao') return 'campo_estagnado';

  // Fragmentation: muita variação
  if (new Set(climas).size >= 3 && climas.length >= 3) return 'campo_fragmentado';

  return 'campo_coeso';
}

function derivarPadraoPredominante(registros: RegistroInput[]): PadraoPredominanteGrupo {
  const movimentos = registros.map(r => r.movimentos_repetidos).filter(Boolean);
  const resistencias = registros.map(r => r.resistencias_grupais).filter(Boolean);
  const climas = registros.map(r => r.clima_movimento).filter(Boolean) as ClimaMovimento[];

  // Polarização: tensão + resistências frequentes
  if (climas.filter(c => c === 'tensao').length >= 2 && resistencias.length >= 2) {
    return 'polarizacao';
  }

  // Silêncio coletivo: recolhimento dominante sem movimentos
  if (climas.filter(c => c === 'recolhimento').length >= 2 && movimentos.length === 0) {
    return 'silencio_coletivo';
  }

  // Dispersão: fragmentação de climas
  if (new Set(climas).size >= 3) return 'dispersao';

  // Co-regulação: fluidez consistente
  if (climas.filter(c => c === 'fluidez').length >= 2) return 'co_regulacao';

  // Fusão: expansão repetida sem resistência
  if (climas.filter(c => c === 'expansao').length >= 3 && resistencias.length === 0) {
    return 'fusao_excessiva';
  }

  // Movimento circular: movimentos repetidos identificados
  if (movimentos.length >= 2) return 'movimento_circular';

  return 'sem_padrao_definido';
}

function derivarDirecaoConducao(
  estado: EstadoCampoColetivo,
  padrao: PadraoPredominanteGrupo,
): DirecaoConducaoGrupo {
  // Risco alto → conter
  if (estado === 'campo_tenso' && padrao === 'polarizacao') return 'nomear_tensao';
  if (estado === 'campo_tenso') return 'acolher_e_conter';

  // Recolhimento → silêncio
  if (estado === 'campo_em_recolhimento') return 'sustentar_silencio';

  // Estagnado → ampliar
  if (estado === 'campo_estagnado') return 'ampliar_escuta';

  // Fragmentado → acolher
  if (estado === 'campo_fragmentado') return 'acolher_e_conter';

  // Expansão + co-regulação → facilitar
  if (estado === 'campo_em_expansao' && padrao === 'co_regulacao') return 'facilitar_fluidez';
  if (estado === 'campo_em_expansao') return 'facilitar_fluidez';

  // Coeso → integrar
  if (estado === 'campo_coeso') return 'integrar_movimento';

  return 'observar';
}

function avaliarRisco(
  registros: RegistroInput[],
  participantes: number,
): { risco: NivelRiscoColetivo; alerta: string | null } {
  const recentes = registros.slice(0, 3);
  const tensoes = recentes.filter(r => r.clima_movimento === 'tensao').length;
  const resistencias = recentes.filter(r => r.resistencias_grupais && r.resistencias_grupais.length > 10).length;
  const naoFechados = recentes.filter(r => !r.campo_fechado).length;

  // Elevado: tensão constante + resistência + campo não fechado
  if (tensoes >= 2 && resistencias >= 2) {
    return {
      risco: 'elevado',
      alerta: 'Campo sob tensão recorrente com resistências ativas. Atenção ao manejo.',
    };
  }

  // Elevado: campo nunca fechado
  if (naoFechados >= 3 && registros.length >= 3) {
    return {
      risco: 'elevado',
      alerta: 'Campo não tem sido fechado nos últimos encontros. Risco de dispersão emocional.',
    };
  }

  // Moderado: alguma tensão
  if (tensoes >= 1 || resistencias >= 1) {
    return {
      risco: 'moderado',
      alerta: 'Atenção a movimentos de tensão ou resistência no campo.',
    };
  }

  return { risco: 'baixo', alerta: null };
}

function derivarTensaoColetiva(registros: RegistroInput[]): string | null {
  // Procura resistências e escuta de campo nos registros recentes
  for (const r of registros.slice(0, 3)) {
    if (r.resistencias_grupais && r.resistencias_grupais.length > 5) {
      return r.resistencias_grupais;
    }
  }
  return null;
}
