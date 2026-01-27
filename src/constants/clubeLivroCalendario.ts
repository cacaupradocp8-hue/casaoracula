// ============================================
// CALENDÁRIO ANUAL DO CLUBE DO LIVRO ORACULAR
// 12 Ciclos - Estrutura Canônica da Casa Orácula
// ============================================

export interface CicloCalendario {
  ordem: number;
  titulo: string;
  autor: string;
  tema: string;
  orientacao_clinica_uso?: string;
  orientacao_clinica_evitar?: string;
  orientacao_clinica_riscos?: string;
}

export const CALENDARIO_ANUAL: CicloCalendario[] = [
  {
    ordem: 1,
    titulo: 'Mulheres que Correm com os Lobos',
    autor: 'Clarissa Pinkola Estés',
    tema: 'DESPERTAR',
    orientacao_clinica_uso: 'Cliente desconectada do corpo\nExcesso de adaptação\nApagamento do desejo',
    orientacao_clinica_evitar: 'Crise psicótica\nLuto recente\nEgo fragilizado',
    orientacao_clinica_riscos: 'Romantizar sofrimento\nProjetar própria iniciação',
  },
  {
    ordem: 2,
    titulo: 'O Código do Ser',
    autor: 'James Hillman',
    tema: 'COLAPSO DO PERSONAGEM',
  },
  {
    ordem: 3,
    titulo: 'A Coruja Era Filha do Padeiro',
    autor: 'Marion Woodman',
    tema: 'CORPO & SOMBRA',
  },
  {
    ordem: 4,
    titulo: 'O Brincar e a Realidade',
    autor: 'Donald Winnicott',
    tema: 'ESPAÇO POTENCIAL',
  },
  {
    ordem: 5,
    titulo: 'Inteligência Erótica',
    autor: 'Esther Perel',
    tema: 'DESEJO & AMBIVALÊNCIA',
  },
  {
    ordem: 6,
    titulo: 'O Acontecimento',
    autor: 'Annie Ernaux',
    tema: 'QUEDA & DIGNIDADE',
  },
  {
    ordem: 7,
    titulo: 'Ficções que Curam',
    autor: 'James Hillman',
    tema: 'NARRATIVA COMO CURA',
  },
  {
    ordem: 8,
    titulo: 'A Poética do Espaço',
    autor: 'Gaston Bachelard',
    tema: 'CASA PSÍQUICA',
  },
  {
    ordem: 9,
    titulo: 'A Gravidade e a Graça',
    autor: 'Simone Weil',
    tema: 'ATENÇÃO & LIMITE',
  },
  {
    ordem: 10,
    titulo: 'A Condição Humana',
    autor: 'Hannah Arendt',
    tema: 'RESPONSABILIDADE',
  },
  {
    ordem: 11,
    titulo: 'O Poder da Escrita',
    autor: 'Christina Baldwin',
    tema: 'ESCRITA COMO PRÁTICA',
  },
  {
    ordem: 12,
    titulo: 'Água Viva',
    autor: 'Clarice Lispector',
    tema: 'LINGUAGEM VIVA',
  },
];

// Estrutura canônica das 4 semanas de cada ciclo
export interface SemanaPadrao {
  numero_semana: number;
  titulo: string;
  tipo_fase: 'chamado' | 'ruptura' | 'reorganizacao' | 'integracao';
  descricao: string;
  alerta_clinico?: string;
}

export const SEMANAS_PADRAO: SemanaPadrao[] = [
  {
    numero_semana: 1,
    titulo: 'O Arquétipo Não É a Cliente',
    tipo_fase: 'chamado',
    descricao: 'Diferença entre símbolo e identidade — o arquétipo é campo, não rótulo.',
    alerta_clinico: 'Nunca diga à cliente: "Você é a mulher selvagem." O arquétipo é campo, não rótulo.',
  },
  {
    numero_semana: 2,
    titulo: 'O Risco da Projeção da Facilitadora',
    tipo_fase: 'ruptura',
    descricao: 'Quando a leitura vira identificação — o perigo de projetar a própria iniciação.',
    alerta_clinico: 'Se você se emociona mais que a cliente, pause. A leitura pode estar ativando algo seu.',
  },
  {
    numero_semana: 3,
    titulo: 'Quando Não Usar um Conto',
    tipo_fase: 'reorganizacao',
    descricao: 'Contraindicações e uso inadequado — nem toda cliente precisa deste livro.',
    alerta_clinico: 'Este livro não é para toda cliente. Avalie ego fragilizado, luto recente, crise psicótica.',
  },
  {
    numero_semana: 4,
    titulo: 'Integração e Fechamento',
    tipo_fase: 'integracao',
    descricao: 'Consolidação do ciclo — o que atravessou você e como isso se integra à prática.',
    alerta_clinico: 'Antes de fechar o ciclo, pergunte-se: o que este livro moveu em mim como facilitadora?',
  },
];

// Texto canônico do manifesto de ritual
export const MANIFESTO_RITUAL = `Este livro não foi escolhido para te ensinar.
Foi escolhido para te atravessar.

Leia sem pressa.
Pare quando o corpo pedir.

Aqui, não buscamos entendimento.
Buscamos escuta.

Se algo se mover, sustente.
Se nada se mover, respeite.

A leitura começa quando você aceita não controlar.`;

export const CHECKBOX_RITUAL = 'Leio com presença, não com pressa.';
