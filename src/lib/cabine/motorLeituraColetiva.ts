/**
 * MOTOR DE LEITURA COLETIVA — Campo do Grupo Terapêutico
 * 
 * Analisa registros do jardim_grupo_registros para derivar:
 * - estado_campo_coletivo (8 estados)
 * - tensao_coletiva (5 eixos)
 * - padrao_predominante (6 padrões)
 * - direcao_conducao (8 direções)
 * - risco_coletivo (3 níveis)
 * - permanencia (mensagem de sustentação)
 * - sugestao_intervencao (ação prática)
 * 
 * Janela: últimos 3 registros com pesos 0.5 / 0.3 / 0.2
 * Regras puramente determinísticas, sem IA.
 */

import type { ClimaMovimento } from '@/types/jardim-grupo';

// ── Tipos ────────────────────────────────────────────────

export type EstadoCampoColetivo =
  | 'abertura_coletiva'
  | 'retracao_coletiva'
  | 'fragmentacao'
  | 'repeticao_narrativa'
  | 'integracao_coletiva'
  | 'transicao_de_ciclo'
  | 'descarga_emocional'
  | 'campo_estavel';

export type TensaoColetiva =
  | 'pertencimento_vs_autonomia'
  | 'seguranca_vs_profundidade'
  | 'expressao_vs_protecao'
  | 'vinculo_vs_individuacao'
  | 'permanencia_vs_mudanca'
  | null;

export type PadraoPredominanteGrupo =
  | 'grupo_defensivo'
  | 'grupo_em_abertura'
  | 'grupo_disperso'
  | 'grupo_em_maturacao'
  | 'grupo_em_repeticao'
  | 'grupo_em_fechamento';

export type DirecaoConducaoGrupo =
  | 'aprofundar_com_cuidado'
  | 'criar_seguranca'
  | 'recentrar'
  | 'espelhar_sem_romper'
  | 'sustentar_permanencia'
  | 'fechar_com_delicadeza'
  | 'conter_e_reduzir_intensidade'
  | 'manter_leitura_e_observar';

export type NivelRiscoColetivo = 'baixo' | 'moderado' | 'elevado';

export interface LeituraCampoColetivo {
  estado_campo_coletivo: EstadoCampoColetivo;
  tensao_coletiva: TensaoColetiva;
  padrao_predominante: PadraoPredominanteGrupo;
  direcao_conducao: DirecaoConducaoGrupo;
  risco_coletivo: NivelRiscoColetivo;
  permanencia: string | null;
  sugestao_intervencao: string;
  mensagem_estado: string;
  mensagem_direcao: string;
  alerta_risco: string | null;
  frase_simbolica: string | null;
}

export interface RegistroInput {
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

// ── Palavras-chave para detecção textual ─────────────────

const KW_ABERTURA = ['confiança', 'partilha', 'conexão', 'troca', 'fluidez', 'abertura', 'presença', 'acolhimento'];
const KW_RETRACAO = ['silêncio', 'medo', 'contenção', 'retraída', 'fechada', 'proteção', 'distância', 'curta'];
const KW_FRAGMENTACAO = ['dispersão', 'caos', 'confusão', 'desconexão', 'disperso', 'fragmentado', 'sem eixo'];
const KW_DESCARGA = ['intensidade', 'choro', 'colapso', 'transbordamento', 'carregado', 'pesado', 'explosão', 'desabou'];
const KW_INTEGRACAO = ['convergência', 'elaboração', 'maturidade', 'síntese', 'integração', 'coerência', 'avançando'];
const KW_TRANSICAO = ['encerramento', 'despedida', 'fechamento', 'ciclo', 'novo', 'reorganização', 'propósito'];

function textContainsAny(text: string | null, keywords: string[]): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  return keywords.some(kw => lower.includes(kw));
}

function countKeywordHits(texts: (string | null)[], keywords: string[]): number {
  return texts.reduce((sum, t) => sum + (textContainsAny(t, keywords) ? 1 : 0), 0);
}

// ── Mensagens ────────────────────────────────────────────

const MENSAGENS_ESTADO: Record<EstadoCampoColetivo, string> = {
  abertura_coletiva: 'O grupo está em abertura. Há confiança circulando e espaço para aprofundar.',
  retracao_coletiva: 'O grupo se recolheu. Há contenção, silêncio ou medo de exposição.',
  fragmentacao: 'O grupo está disperso. Temas desconectados, sem eixo comum.',
  repeticao_narrativa: 'Padrão repetitivo identificado. O grupo revisita o mesmo território sem elaborar.',
  integracao_coletiva: 'O grupo integra o que emergiu. Há convergência e maturidade coletiva.',
  transicao_de_ciclo: 'Ciclo em encerramento. O grupo se reorganiza para uma nova fase.',
  descarga_emocional: 'Muita intensidade no campo. O grupo precisa de contenção, não aprofundamento.',
  campo_estavel: 'O campo está estável. Observar sem intervir até que um movimento se defina.',
};

const MENSAGENS_DIRECAO: Record<DirecaoConducaoGrupo, string> = {
  aprofundar_com_cuidado: 'Aprofundar com cuidado — o campo sustenta, mas não force.',
  criar_seguranca: 'Criar segurança antes de aprofundar. O grupo precisa de confiança.',
  recentrar: 'Recentrar o campo. Trazer uma pergunta comum ou símbolo que una.',
  espelhar_sem_romper: 'Espelhar o padrão sem forçar ruptura. A repetição ainda tem algo a dizer.',
  sustentar_permanencia: 'Sustentar o que está acontecendo. Não acelere — a integração está em curso.',
  fechar_com_delicadeza: 'Acompanhar o fechamento. Não abrir novo campo agora.',
  conter_e_reduzir_intensidade: 'Conter e reduzir intensidade. Intervenção suave, sem confronto.',
  manter_leitura_e_observar: 'Manter leitura e observar. O campo ainda não se definiu.',
};

const SUGESTOES_INTERVENCAO: Record<DirecaoConducaoGrupo, string> = {
  aprofundar_com_cuidado: 'Abrir roda de espelho — cada participante nomeia o que sente.',
  criar_seguranca: 'Sustentar silêncio acolhedor. Oferecer presença sem demanda.',
  recentrar: 'Recentrar com pergunta comum que traga o grupo de volta ao eixo.',
  espelhar_sem_romper: 'Fazer síntese coletiva do que se repete, sem interpretar.',
  sustentar_permanencia: 'Sustentar silêncio. Não preencher o espaço — a integração precisa de tempo.',
  fechar_com_delicadeza: 'Fechar encontro sem aprofundar. Ritual de encerramento simples.',
  conter_e_reduzir_intensidade: 'Evitar confronto. Respiração coletiva. Reduzir o ritmo.',
  manter_leitura_e_observar: 'Manter escuta ativa. Não intervir até que o campo mostre direção.',
};

// ── Motor Principal ──────────────────────────────────────

export function calcularLeituraCampoColetivo(
  registros: RegistroInput[],
  participantesAtivos: number,
): LeituraCampoColetivo {
  // Sem registros → campo estável (inicial)
  if (!registros.length) {
    return buildResult('campo_estavel', null, 'manter_leitura_e_observar', 'baixo', null, null);
  }

  // Janela de análise: últimos 3
  const janela = registros.slice(0, 3);
  const ultimo = janela[0];

  // Campos textuais agregados para análise
  const textosCampo = janela.map(r => r.escuta_campo);
  const textosClima = janela.map(r => r.clima_descricao);
  const textosResistencia = janela.map(r => r.resistencias_grupais);
  const todosTextos = [...textosCampo, ...textosClima, ...textosResistencia];

  // ── 1. Derivar estado ──
  const estado = derivarEstado(janela, todosTextos);

  // ── 2. Derivar tensão ──
  const tensao = derivarTensao(janela, todosTextos);

  // ── 3. Derivar direção ──
  const direcao = ESTADO_DIRECAO_MAP[estado];

  // ── 4. Derivar risco ──
  const risco = derivarRisco(estado, janela);

  // ── 5. Permanência ──
  const permanencia = derivarPermanencia(estado);

  // ── 6. Frase simbólica ──
  const frase = ultimo.frase_semente_grupo || null;

  return buildResult(estado, tensao, direcao, risco, permanencia, frase);
}

function buildResult(
  estado: EstadoCampoColetivo,
  tensao: TensaoColetiva,
  direcao: DirecaoConducaoGrupo,
  risco: NivelRiscoColetivo,
  permanencia: string | null,
  frase: string | null,
): LeituraCampoColetivo {
  const padrao = ESTADO_PADRAO_MAP[estado];
  return {
    estado_campo_coletivo: estado,
    tensao_coletiva: tensao,
    padrao_predominante: padrao,
    direcao_conducao: direcao,
    risco_coletivo: risco,
    permanencia,
    sugestao_intervencao: SUGESTOES_INTERVENCAO[direcao],
    mensagem_estado: MENSAGENS_ESTADO[estado],
    mensagem_direcao: MENSAGENS_DIRECAO[direcao],
    alerta_risco: risco === 'elevado'
      ? 'Campo sob risco elevado. Priorizar contenção e segurança.'
      : risco === 'moderado'
        ? 'Atenção a movimentos de tensão ou resistência no campo.'
        : null,
    frase_simbolica: frase,
  };
}

// ── Mapeamentos estado → padrão / direção ────────────────

const ESTADO_DIRECAO_MAP: Record<EstadoCampoColetivo, DirecaoConducaoGrupo> = {
  abertura_coletiva: 'aprofundar_com_cuidado',
  retracao_coletiva: 'criar_seguranca',
  fragmentacao: 'recentrar',
  repeticao_narrativa: 'espelhar_sem_romper',
  integracao_coletiva: 'sustentar_permanencia',
  transicao_de_ciclo: 'fechar_com_delicadeza',
  descarga_emocional: 'conter_e_reduzir_intensidade',
  campo_estavel: 'manter_leitura_e_observar',
};

const ESTADO_PADRAO_MAP: Record<EstadoCampoColetivo, PadraoPredominanteGrupo> = {
  abertura_coletiva: 'grupo_em_abertura',
  retracao_coletiva: 'grupo_defensivo',
  fragmentacao: 'grupo_disperso',
  repeticao_narrativa: 'grupo_em_repeticao',
  integracao_coletiva: 'grupo_em_maturacao',
  transicao_de_ciclo: 'grupo_em_fechamento',
  descarga_emocional: 'grupo_defensivo',
  campo_estavel: 'grupo_em_maturacao',
};

// ── Derivação de Estado (prioridade descendente) ─────────

function derivarEstado(
  janela: RegistroInput[],
  todosTextos: (string | null)[],
): EstadoCampoColetivo {
  const climas = janela.map(r => r.clima_movimento).filter(Boolean) as ClimaMovimento[];
  const hitsDescarga = countKeywordHits(todosTextos, KW_DESCARGA);
  const hitsFragmentacao = countKeywordHits(todosTextos, KW_FRAGMENTACAO);
  const hitsRetracao = countKeywordHits(todosTextos, KW_RETRACAO);
  const hitsAbertura = countKeywordHits(todosTextos, KW_ABERTURA);
  const hitsIntegracao = countKeywordHits(todosTextos, KW_INTEGRACAO);
  const hitsTransicao = countKeywordHits(todosTextos, KW_TRANSICAO);

  // Descarga emocional — prioridade máxima
  if (hitsDescarga >= 2 || (climas.filter(c => c === 'tensao').length >= 2 && hitsDescarga >= 1)) {
    return 'descarga_emocional';
  }

  // Fragmentação
  if (hitsFragmentacao >= 2 || (new Set(climas).size >= 3 && climas.length >= 3)) {
    return 'fragmentacao';
  }

  // Repetição narrativa: mesmos temas/frases/fase nos 3 registros
  if (janela.length >= 2 && detectarRepeticao(janela)) {
    return 'repeticao_narrativa';
  }

  // Retração coletiva
  if (hitsRetracao >= 2 || climas.filter(c => c === 'recolhimento').length >= 2) {
    return 'retracao_coletiva';
  }

  // Transição de ciclo
  if (hitsTransicao >= 2) {
    return 'transicao_de_ciclo';
  }

  // Integração coletiva
  if (hitsIntegracao >= 2 || (climas.filter(c => c === 'fluidez').length >= 2 && hitsAbertura >= 1)) {
    return 'integracao_coletiva';
  }

  // Abertura coletiva
  if (hitsAbertura >= 2 || (climas.filter(c => c === 'expansao').length >= 2)) {
    return 'abertura_coletiva';
  }

  // Fallback
  return 'campo_estavel';
}

function detectarRepeticao(janela: RegistroInput[]): boolean {
  if (janela.length < 2) return false;
  const temas = janela.map(r => r.tema_simbolico).filter(Boolean);
  const frases = janela.map(r => r.frase_semente_grupo).filter(Boolean);
  const fases = janela.map(r => r.fase_jornada_grupo).filter(Boolean);

  // Se 2+ registros compartilham o mesmo valor
  const temRepeteTema = temas.length >= 2 && new Set(temas).size === 1;
  const temRepeteFrase = frases.length >= 2 && new Set(frases).size === 1;
  const temRepeteFase = fases.length >= 2 && new Set(fases).size === 1;

  return temRepeteTema || temRepeteFrase || temRepeteFase;
}

// ── Derivação de Tensão ──────────────────────────────────

function derivarTensao(
  janela: RegistroInput[],
  todosTextos: (string | null)[],
): TensaoColetiva {
  // Análise de resistências e escuta
  const textoResistencia = janela.map(r => r.resistencias_grupais).filter(Boolean).join(' ').toLowerCase();
  const textoEscuta = janela.map(r => r.escuta_campo).filter(Boolean).join(' ').toLowerCase();
  const todo = textoResistencia + ' ' + textoEscuta;

  if (['pertencimento', 'pertencer', 'excluída', 'isolada', 'autonomia', 'sozinha'].some(k => todo.includes(k))) {
    return 'pertencimento_vs_autonomia';
  }
  if (['segurança', 'medo', 'profundidade', 'arriscar', 'vulnerável'].some(k => todo.includes(k))) {
    return 'seguranca_vs_profundidade';
  }
  if (['expressão', 'expressar', 'calar', 'silenciar', 'proteger', 'proteção'].some(k => todo.includes(k))) {
    return 'expressao_vs_protecao';
  }
  if (['vínculo', 'separação', 'individuação', 'fusão', 'dependência'].some(k => todo.includes(k))) {
    return 'vinculo_vs_individuacao';
  }
  if (['permanência', 'ficar', 'ir embora', 'mudar', 'mudança', 'sair'].some(k => todo.includes(k))) {
    return 'permanencia_vs_mudanca';
  }

  return null;
}

// ── Derivação de Risco ───────────────────────────────────

function derivarRisco(
  estado: EstadoCampoColetivo,
  janela: RegistroInput[],
): NivelRiscoColetivo {
  if (estado === 'descarga_emocional') return 'elevado';

  const naoFechados = janela.filter(r => !r.campo_fechado).length;
  if (estado === 'fragmentacao' && naoFechados >= 2) return 'elevado';
  if (estado === 'fragmentacao') return 'moderado';

  if (estado === 'repeticao_narrativa') return 'moderado';
  if (estado === 'retracao_coletiva') return 'moderado';

  if (naoFechados >= 3 && janela.length >= 3) return 'moderado';

  return 'baixo';
}

// ── Derivação de Permanência ─────────────────────────────

function derivarPermanencia(estado: EstadoCampoColetivo): string | null {
  const map: Partial<Record<EstadoCampoColetivo, string>> = {
    retracao_coletiva: 'Este campo precisa de mais segurança antes de abrir.',
    repeticao_narrativa: 'A repetição ainda não foi suficientemente elaborada.',
    integracao_coletiva: 'A integração está em curso. Não acelere.',
    descarga_emocional: 'O grupo ainda não está pronto para aprofundar.',
    fragmentacao: 'O grupo precisa de um eixo comum antes de avançar.',
    transicao_de_ciclo: 'Ciclo em encerramento. Sustentar o processo antes de abrir outro.',
  };
  return map[estado] ?? null;
}
