export interface CorSimbolo {
  nome: string;
  hex: string;
  significado: string;
}

export const CORES_SIMBOLICAS: CorSimbolo[] = [
  { nome: 'Ouro', hex: '#C9A24A', significado: 'esperança, abundância' },
  { nome: 'Prata', hex: '#A8B2BD', significado: 'reflexão, mistério' },
  { nome: 'Azul', hex: '#3B6B9E', significado: 'calma, profundidade' },
  { nome: 'Vermelho', hex: '#9E3B3B', significado: 'paixão, energia' },
  { nome: 'Verde', hex: '#556B57', significado: 'crescimento, renovação' },
  { nome: 'Roxo', hex: '#6B3B7A', significado: 'transformação, magia' },
  { nome: 'Cinza', hex: '#6B6B6B', significado: 'neutralidade, transição' },
  { nome: 'Preto', hex: '#1A1A2E', significado: 'potencial, desconhecido' },
  { nome: 'Branco', hex: '#E8E4DA', significado: 'clareza, vazio' },
  { nome: 'Rosa', hex: '#B07A8A', significado: 'ternura, vulnerabilidade' },
  { nome: 'Laranja', hex: '#C97A3B', significado: 'criatividade, alegria' },
  { nome: 'Marrom', hex: '#7A5C3B', significado: 'enraizamento, estabilidade' },
];

export const DESCRITORES_ATMOSFERA = [
  'Calma', 'Agitada', 'Clara', 'Nebulosa',
  'Quente', 'Fria', 'Viva', 'Estática',
  'Segura', 'Ameaçadora', 'Aberta', 'Fechada',
  'Organizada', 'Caótica', 'Esperançosa', 'Desesperada',
];

export interface Territorio {
  key: string;
  nome: string;
  desc: string;
  icon: string;
}

export const TERRITORIOS: Territorio[] = [
  { key: 'portao_chegada', nome: 'Portão da Chegada', desc: 'chegadas, inícios', icon: '🚪' },
  { key: 'torres', nome: 'Torres', desc: 'estruturas, proteção', icon: '🏰' },
  { key: 'portas', nome: 'Portas', desc: 'emoções, acessos', icon: '🗝️' },
  { key: 'jardim_arquetipos', nome: 'Jardim dos Arquétipos', desc: 'forças profundas', icon: '🌿' },
  { key: 'praca_abalo', nome: 'Praça do Abalo', desc: 'emoções intensas', icon: '⚡' },
  { key: 'casa_sonhos', nome: 'Casa dos Sonhos', desc: 'inconsciente, imaginação', icon: '🌙' },
  { key: 'espelho_vinculos', nome: 'Espelho dos Vínculos', desc: 'relacionamentos', icon: '🪞' },
  { key: 'forja', nome: 'Forja', desc: 'transformação', icon: '🔥' },
  { key: 'conselho_interior', nome: 'Conselho Interior', desc: 'sabedoria interna', icon: '👁️' },
  { key: 'labirinto', nome: 'Labirinto', desc: 'confusão, ciclos', icon: '🌀' },
  { key: 'praca_integracao', nome: 'Praça da Integração', desc: 'síntese', icon: '☀️' },
  { key: 'portal_renascimento', nome: 'Portal de Renascimento', desc: 'transição', icon: '🦋' },
];

export interface SimboloPessoal {
  key: string;
  nome: string;
  icon: string;
}

export const SIMBOLOS: SimboloPessoal[] = [
  { key: 'arvore', nome: 'Árvore', icon: '🌳' },
  { key: 'montanha', nome: 'Montanha', icon: '🏔️' },
  { key: 'rio', nome: 'Rio', icon: '🏞️' },
  { key: 'fogo', nome: 'Fogo', icon: '🔥' },
  { key: 'agua', nome: 'Água', icon: '💧' },
  { key: 'vento', nome: 'Vento', icon: '🌬️' },
  { key: 'luz', nome: 'Luz', icon: '✨' },
  { key: 'sombra', nome: 'Sombra', icon: '🌑' },
  { key: 'ponte', nome: 'Ponte', icon: '🌉' },
  { key: 'porta', nome: 'Porta', icon: '🚪' },
  { key: 'coracao', nome: 'Coração', icon: '❤️' },
  { key: 'coroa', nome: 'Coroa', icon: '👑' },
  { key: 'espada', nome: 'Espada', icon: '⚔️' },
  { key: 'escudo', nome: 'Escudo', icon: '🛡️' },
  { key: 'chave', nome: 'Chave', icon: '🗝️' },
  { key: 'labirinto', nome: 'Labirinto', icon: '🌀' },
  { key: 'espelho', nome: 'Espelho', icon: '🪞' },
  { key: 'livro', nome: 'Livro', icon: '📖' },
  { key: 'flor', nome: 'Flor', icon: '🌸' },
  { key: 'estrela', nome: 'Estrela', icon: '⭐' },
];

export const SUGESTOES_RECURSOS = [
  'Encontro força em...',
  'Me sinto segura quando...',
  'Minha criatividade floresce em...',
  'Sou capaz de...',
];

export const SUGESTOES_CONFLITOS = [
  'Há conflito entre...',
  'Sinto tensão quando...',
  'Estou confusa sobre...',
  'Preciso integrar...',
];
