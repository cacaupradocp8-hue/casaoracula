/**
 * Catálogo fixo de Perguntas Narrativas por território da CidadELA.
 * Uso exclusivo: Camada de Condução Clínica (v1) — apoio à escuta da terapeuta.
 *
 * NÃO é diagnóstico. NÃO é interpretação. NÃO usa IA.
 * Apenas perguntas pré-cadastradas associadas a cada distrito vivo.
 */

export interface TerritorioPerguntas {
  /** Chave técnica do distrito (alinhada com derivacaoCidadela.EIXO_DISTRITOS) */
  chave: string;
  /** Nome simbólico exibido à terapeuta */
  nome: string;
  /** Perguntas narrativas associadas */
  perguntas: string[];
}

export const CATALOGO_PERGUNTAS_NARRATIVAS: Record<string, TerritorioPerguntas> = {
  portao_chegada: {
    chave: 'portao_chegada',
    nome: 'Portão da Chegada',
    perguntas: [
      'O que está chegando agora que ainda não tem nome?',
      'Que possibilidade pede passagem?',
    ],
  },
  portal_renascimento: {
    chave: 'portal_renascimento',
    nome: 'Portal do Renascimento',
    perguntas: [
      'O que precisa ser deixado para que algo novo possa começar?',
      'O que está pronto para nascer?',
    ],
  },
  torres: {
    chave: 'torres',
    nome: 'Torres',
    perguntas: [
      'Que estrutura interna tem sustentado este momento?',
      'O que dentro de você ainda pede firmeza?',
    ],
  },
  conselho_interior: {
    chave: 'conselho_interior',
    nome: 'Conselho Interior',
    perguntas: [
      'Que vozes internas estão sendo escutadas hoje?',
      'Qual delas tem falado mais alto, e qual tem ficado em silêncio?',
    ],
  },
  espelho_vinculos: {
    chave: 'espelho_vinculos',
    nome: 'Espelho dos Vínculos',
    perguntas: [
      'Que vínculo aparece quando este território é tocado?',
      'O que esse encontro devolve a você?',
    ],
  },
  jardim_arquetipos: {
    chave: 'jardim_arquetipos',
    nome: 'Jardim dos Arquétipos',
    perguntas: [
      'Que figura interna se aproxima quando você pensa nisto?',
      'Qual presença tem feito companhia neste tempo?',
    ],
  },
  forja: {
    chave: 'forja',
    nome: 'Forja',
    perguntas: [
      'O que está tentando nascer?',
      'O que pede construção neste momento?',
    ],
  },
  praca_integracao: {
    chave: 'praca_integracao',
    nome: 'Praça da Integração',
    perguntas: [
      'O que está pedindo para ser dito em voz alta?',
      'Onde sua voz tem encontrado lugar?',
    ],
  },
  praca_abalo: {
    chave: 'praca_abalo',
    nome: 'Praça do Abalo',
    perguntas: [
      'O que foi tocado recentemente que ainda reverbera?',
      'Que terreno parece menos firme agora?',
    ],
  },
  labirinto: {
    chave: 'labirinto',
    nome: 'Labirinto',
    perguntas: [
      'Que caminho continua pedindo para ser percorrido?',
      'O que ainda não encontrou forma?',
    ],
  },
  casa_sonhos: {
    chave: 'casa_sonhos',
    nome: 'Casa dos Sonhos',
    perguntas: [
      'Que imagem tem voltado nos últimos tempos?',
      'O que o sonho parece estar tentando mostrar?',
    ],
  },
};

/**
 * Lista completa de distritos conhecidos pelo catálogo.
 */
export const DISTRITOS_CONHECIDOS = Object.keys(CATALOGO_PERGUNTAS_NARRATIVAS);

/**
 * Recupera perguntas para uma lista de distritos vivos.
 * Distritos não mapeados são silenciosamente ignorados.
 */
export function obterPerguntasParaDistritos(
  distritosVivos: string[] | null | undefined
): TerritorioPerguntas[] {
  if (!distritosVivos?.length) return [];
  return distritosVivos
    .map((d) => CATALOGO_PERGUNTAS_NARRATIVAS[d])
    .filter((x): x is TerritorioPerguntas => Boolean(x));
}

/**
 * Texto padrão de cuidados éticos — exibido sempre que a camada é renderizada.
 */
export const CUIDADOS_ETICOS_TEXTO =
  'A Cartografia Psíquica é uma ferramenta de observação simbólica. Não constitui diagnóstico clínico. Não substitui avaliação profissional.';

/**
 * Hipótese de condução padrão — frase fixa, sem interpretação automática.
 */
export const HIPOTESE_CONDUCAO_TEXTO =
  'Este mapa sugere atenção para os territórios atualmente mais habitados e para os territórios com menor movimentação.';
