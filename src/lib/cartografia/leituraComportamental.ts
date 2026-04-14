// ============================================================
// Camada Invisível de Leitura Comportamental
// Módulo puro — zero dependências de banco ou UI
// ============================================================

// --- Tipos ---

export type NivelIntensidade = 'baixa' | 'media' | 'alta';
export type ContextoLeitura = 'clube' | 'formacao' | 'casa_das_maquinas';

export interface MediasFatores {
  porta_do_possivel: number;
  torre_interna: number;
  campo_do_outro: number;
  voz_no_mundo: number;
  porta_do_abalo: number;
}

export interface CartografiaProfile {
  organizacao: NivelIntensidade;
  abertura: NivelIntensidade;
  estabilidade_emocional: NivelIntensidade;
  reatividade: NivelIntensidade;
  expressao: NivelIntensidade;
  medo_dominante: string;
  estrategia_defesa: string;
  tensao_central: string;
  ritmo_ideal: string;
  tolerancia_confronto: NivelIntensidade;
  estilo_conducao: string;
}

export interface SaidaCliente {
  forca_principal: string;
  tensao_central: string;
  convite_inicial: string;
}

export interface SaidaTerapeuta {
  padrao_dominante: string;
  estrategia_defesa: string;
  tensao_central: string;
  o_que_evitar: string[];
  o_que_priorizar: string[];
  ritmo_recomendado: string;
}

export interface LeituraComportamental {
  profile: CartografiaProfile;
  saida_cliente: SaidaCliente;
  saida_terapeuta: SaidaTerapeuta;
  oracula_inicial: string;
  contexto: ContextoLeitura;
}

// --- Normalização de chaves (wizard Casa das Máquinas) ---

const NORMALIZACAO: Record<string, keyof MediasFatores> = {
  porta_possivel: 'porta_do_possivel',
  porta_do_possivel: 'porta_do_possivel',
  torre_interna: 'torre_interna',
  campo_outro: 'campo_do_outro',
  campo_do_outro: 'campo_do_outro',
  voz_mundo: 'voz_no_mundo',
  voz_no_mundo: 'voz_no_mundo',
  porta_abalo: 'porta_do_abalo',
  porta_do_abalo: 'porta_do_abalo',
};

export function normalizarMedias(raw: Record<string, number>): MediasFatores {
  const result: Partial<MediasFatores> = {};
  for (const [key, val] of Object.entries(raw)) {
    const norm = NORMALIZACAO[key];
    if (norm) result[norm] = val;
  }
  return {
    porta_do_possivel: result.porta_do_possivel ?? 3,
    torre_interna: result.torre_interna ?? 3,
    campo_do_outro: result.campo_do_outro ?? 3,
    voz_no_mundo: result.voz_no_mundo ?? 3,
    porta_do_abalo: result.porta_do_abalo ?? 3,
  };
}

// --- Classificadores base ---

function classificar(media: number): NivelIntensidade {
  if (media >= 4.0) return 'alta';
  if (media >= 2.6) return 'media';
  return 'baixa';
}

function classificarInvertido(media: number): NivelIntensidade {
  if (media >= 4.0) return 'baixa';
  if (media >= 2.6) return 'media';
  return 'alta';
}

// --- Regras fechadas ---

function calcularMedoDominante(m: MediasFatores): string {
  const torre = classificar(m.torre_interna);
  const voz = classificar(m.voz_no_mundo);
  const campo = classificar(m.campo_do_outro);
  const abalo = classificar(m.porta_do_abalo);
  const possivel = classificar(m.porta_do_possivel);

  if (torre === 'alta' && voz === 'baixa') return 'errar e se expor';
  if (campo === 'alta' && voz === 'baixa') return 'rejeição e julgamento';
  if (abalo === 'alta' && torre === 'alta') return 'colapso e perda de controle';
  if (possivel === 'baixa' && torre === 'alta') return 'mudar e não sustentar';
  if (voz === 'alta' && campo === 'alta') return 'ser mal compreendida';
  return 'instabilidade interna'; // fallback
}

function calcularEstrategiaDefesa(m: MediasFatores): string {
  const torre = classificar(m.torre_interna);
  const abalo = classificar(m.porta_do_abalo);
  const possivel = classificar(m.porta_do_possivel);
  const campo = classificar(m.campo_do_outro);
  const voz = classificar(m.voz_no_mundo);

  if (torre === 'alta' && abalo === 'alta') return 'controle por antecipação';
  if (abalo === 'alta' && possivel === 'baixa') return 'evitação por sobrecarga';
  if (campo === 'alta' && voz === 'baixa') return 'adaptação para pertencimento';
  if (voz === 'alta' && torre === 'alta') return 'afirmação rígida';
  if (possivel === 'alta' && torre === 'baixa' && abalo === 'baixa') return 'exploração com flexibilidade';
  return 'compensação adaptativa'; // fallback
}

function calcularTensaoCentral(m: MediasFatores): string {
  const torre = classificar(m.torre_interna);
  const voz = classificar(m.voz_no_mundo);
  const campo = classificar(m.campo_do_outro);
  const abalo = classificar(m.porta_do_abalo);
  const possivel = classificar(m.porta_do_possivel);

  if (torre === 'alta' && voz === 'baixa') return 'estrutura vs expressão';
  if (campo === 'alta' && possivel === 'baixa') return 'pertencimento vs autonomia';
  if (abalo === 'alta' && torre === 'alta') return 'controle vs colapso';
  if (possivel === 'alta' && torre === 'alta') return 'expansão vs segurança';
  if (voz === 'alta' && campo === 'alta') return 'expressão vs aceitação';
  return 'segurança vs movimento'; // fallback
}

function calcularRitmoIdeal(m: MediasFatores): string {
  const abalo = classificar(m.porta_do_abalo);
  const torre = classificar(m.torre_interna);
  const possivel = classificar(m.porta_do_possivel);

  if (abalo === 'alta') return 'lento';
  if (torre === 'alta' && abalo === 'media') return 'medio';
  if (possivel === 'alta' && abalo === 'baixa') return 'medio ou rapido';
  return 'medio';
}

function calcularToleranciaConfronto(m: MediasFatores): NivelIntensidade {
  const campo = classificar(m.campo_do_outro);
  const abalo = classificar(m.porta_do_abalo);
  const torre = classificar(m.torre_interna);
  const voz = classificar(m.voz_no_mundo);

  if (campo === 'alta' && abalo === 'alta') return 'baixa';
  if (torre === 'alta' && voz === 'alta') return 'media';
  if (voz === 'alta' && abalo === 'baixa') return 'alta';
  return 'media';
}

function calcularEstiloConducao(m: MediasFatores): string {
  const partes: string[] = [];
  const torre = classificar(m.torre_interna);
  const voz = classificar(m.voz_no_mundo);
  const campo = classificar(m.campo_do_outro);
  const possivel = classificar(m.porta_do_possivel);
  const abalo = classificar(m.porta_do_abalo);

  if (torre === 'alta') partes.push('estrutura e clareza');
  if (voz === 'baixa') partes.push('validação e abertura gradual');
  if (campo === 'alta') partes.push('cuidado com pressão relacional');
  if (possivel === 'alta') partes.push('perguntas de expansão');
  if (abalo === 'alta') partes.push('contenção antes de aprofundar');

  return partes.length > 0 ? partes.join('; ') : 'acolhimento e escuta ativa';
}

function calcularOraculaInicial(estrategia: string): string {
  switch (estrategia) {
    case 'controle por antecipação': return 'dialogo ou integracao';
    case 'evitação por sobrecarga': return 'integracao';
    case 'adaptação para pertencimento': return 'espelho com baixa intensidade';
    case 'afirmação rígida': return 'dialogo';
    case 'exploração com flexibilidade': return 'leitura ou ciclo';
    case 'compensação adaptativa': return 'leitura ou ciclo';
    default: return 'leitura ou ciclo';
  }
}

// --- Textos simbólicos (saída para cliente) ---

const TEXTOS_FORCA: Record<string, string> = {
  alta_torre: 'Você tende a buscar estrutura para não se perder.',
  alta_possivel: 'Você se abre com curiosidade ao que ainda não conhece.',
  alta_campo: 'Você se conecta profundamente com o outro.',
  alta_voz: 'Você se expressa com presença e clareza.',
  alta_estabilidade: 'Você sustenta bem o impacto emocional.',
  fallback: 'Você carrega uma força que ainda está se revelando.',
};

const TEXTOS_TENSAO: Record<string, string> = {
  'estrutura vs expressão': 'Seu desafio não é falta de força, mas conciliar proteção e expressão.',
  'pertencimento vs autonomia': 'Você oscila entre acolher o outro e sustentar seu próprio caminho.',
  'controle vs colapso': 'Há uma tensão entre manter tudo sob controle e o medo de desmoronar.',
  'expansão vs segurança': 'Você deseja crescer, mas teme perder a base que construiu.',
  'expressão vs aceitação': 'Falar sua verdade e ser aceita parecem caminhos opostos para você.',
  'segurança vs movimento': 'Você busca estabilidade, mas sente o chamado para se mover.',
};

const TEXTOS_CONVITE: Record<string, string> = {
  lento: 'Seu próximo passo não é se forçar. É criar espaço seguro para atravessar.',
  medio: 'Você já tem recursos. O convite é usá-los com mais intenção.',
  'medio ou rapido': 'Há espaço para experimentar. Permita-se explorar sem medo de errar.',
};

function gerarSaidaCliente(profile: CartografiaProfile, medias: MediasFatores): SaidaCliente {
  // Força: usar o fator mais alto
  let forcaKey = 'fallback';
  const fatores: [string, number][] = [
    ['alta_torre', medias.torre_interna],
    ['alta_possivel', medias.porta_do_possivel],
    ['alta_campo', medias.campo_do_outro],
    ['alta_voz', medias.voz_no_mundo],
  ];
  // Estabilidade é invertida, então alta estabilidade = baixo abalo
  if (medias.porta_do_abalo <= 2.5) fatores.push(['alta_estabilidade', 5 - medias.porta_do_abalo]);

  const maior = fatores.sort((a, b) => b[1] - a[1])[0];
  if (maior[1] >= 3.5) forcaKey = maior[0];

  return {
    forca_principal: TEXTOS_FORCA[forcaKey] || TEXTOS_FORCA.fallback,
    tensao_central: TEXTOS_TENSAO[profile.tensao_central] || TEXTOS_TENSAO['segurança vs movimento'],
    convite_inicial: TEXTOS_CONVITE[profile.ritmo_ideal] || TEXTOS_CONVITE.medio,
  };
}

// --- Saída para terapeuta ---

const EVITAR_POR_ESTRATEGIA: Record<string, string[]> = {
  'controle por antecipação': ['pressão por decisão rápida', 'confronto direto', 'interpretação precoce'],
  'evitação por sobrecarga': ['excesso de estímulos simultâneos', 'confronto direto', 'excesso de abstração'],
  'adaptação para pertencimento': ['excesso de pressão relacional', 'confronto direto sem vínculo', 'interpretação precoce'],
  'afirmação rígida': ['confronto frontal imediato', 'invalidação da posição', 'pressão por vulnerabilidade'],
  'exploração com flexibilidade': ['estrutura rígida demais', 'direcionamento excessivo', 'limitação da curiosidade'],
  'compensação adaptativa': ['pressão por decisão rápida', 'excesso de abstração', 'interpretação precoce'],
};

const PRIORIZAR_POR_ESTRATEGIA: Record<string, string[]> = {
  'controle por antecipação': ['estrutura clara', 'previsibilidade', 'clarificação'],
  'evitação por sobrecarga': ['contenção', 'ritmo lento', 'validação'],
  'adaptação para pertencimento': ['validação', 'diferenciação gradual', 'perguntas abertas'],
  'afirmação rígida': ['escuta ativa', 'perguntas reflexivas', 'reconhecimento da posição'],
  'exploração com flexibilidade': ['perguntas de expansão', 'experimentação', 'liberdade de exploração'],
  'compensação adaptativa': ['acolhimento', 'estrutura', 'perguntas graduais'],
};

function gerarSaidaTerapeuta(profile: CartografiaProfile): SaidaTerapeuta {
  return {
    padrao_dominante: `${profile.organizacao === 'alta' ? 'Organizada' : profile.organizacao === 'media' ? 'Moderadamente organizada' : 'Pouco estruturada'}, ${profile.expressao === 'alta' ? 'expressiva' : profile.expressao === 'media' ? 'moderadamente expressiva' : 'contida'}`,
    estrategia_defesa: profile.estrategia_defesa,
    tensao_central: profile.tensao_central,
    o_que_evitar: EVITAR_POR_ESTRATEGIA[profile.estrategia_defesa] || EVITAR_POR_ESTRATEGIA['compensação adaptativa'],
    o_que_priorizar: PRIORIZAR_POR_ESTRATEGIA[profile.estrategia_defesa] || PRIORIZAR_POR_ESTRATEGIA['compensação adaptativa'],
    ritmo_recomendado: profile.ritmo_ideal,
  };
}

// --- Função principal ---

export function calcularLeitura(
  rawMedias: Record<string, number>,
  contexto: ContextoLeitura = 'clube'
): LeituraComportamental {
  const medias = normalizarMedias(rawMedias);

  const profile: CartografiaProfile = {
    organizacao: classificar(medias.torre_interna),
    abertura: classificar(medias.porta_do_possivel),
    estabilidade_emocional: classificarInvertido(medias.porta_do_abalo),
    reatividade: classificar(medias.campo_do_outro),
    expressao: classificar(medias.voz_no_mundo),
    medo_dominante: calcularMedoDominante(medias),
    estrategia_defesa: calcularEstrategiaDefesa(medias),
    tensao_central: calcularTensaoCentral(medias),
    ritmo_ideal: calcularRitmoIdeal(medias),
    tolerancia_confronto: calcularToleranciaConfronto(medias),
    estilo_conducao: calcularEstiloConducao(medias),
  };

  return {
    profile,
    saida_cliente: gerarSaidaCliente(profile, medias),
    saida_terapeuta: gerarSaidaTerapeuta(profile),
    oracula_inicial: calcularOraculaInicial(profile.estrategia_defesa),
    contexto,
  };
}
