export interface Arquetipo {
  nome: string;
  keywords: string;
  cor: string;
  icone: string;
}

export const ARQUETIPOS: Arquetipo[] = [
  { nome: 'A Sábia', keywords: 'conhecimento, reflexão, verdade', cor: '#9B8EC4', icone: '🦉' },
  { nome: 'A Guerreira', keywords: 'força, ação, coragem', cor: '#C9A24A', icone: '⚔️' },
  { nome: 'A Grande Mãe', keywords: 'nutrição, proteção, abundância', cor: '#6EBF8B', icone: '🌿' },
  { nome: 'O Herói', keywords: 'coragem, transformação, vitória', cor: '#D4756B', icone: '🔥' },
  { nome: 'A Criança', keywords: 'inocência, alegria, potencial', cor: '#7BA7C9', icone: '✨' },
  { nome: 'A Sombra', keywords: 'rejeição, integração, poder', cor: '#4A4A5A', icone: '🌑' },
  { nome: 'O Trickster', keywords: 'transformação, humor, disrupção', cor: '#E8A838', icone: '🃏' },
  { nome: 'O Velho Sábio', keywords: 'sabedoria, orientação, conhecimento', cor: '#7B8C6E', icone: '📜' },
  { nome: 'O Amante', keywords: 'paixão, conexão, desejo', cor: '#B06B8F', icone: '🌹' },
  { nome: 'O Cuidador', keywords: 'compaixão, serviço, sacrifício', cor: '#6B9EC4', icone: '🤲' },
  { nome: 'O Criador', keywords: 'inovação, expressão, criatividade', cor: '#C4A87B', icone: '🎨' },
  { nome: 'O Buscador', keywords: 'exploração, autenticidade, liberdade', cor: '#556B57', icone: '🧭' },
];

export interface AtlasState {
  selecionados: string[];
  descricoes: Record<string, string>;
  atividades: Record<string, number>;
  situacoes: Record<string, string>;
  dinamicaGeral: string;
  conflitos: string;
  harmonias: string;
  arquetipoDominante: string;
  arquetipoDormindo: string;
  oQuePoderia: string;
  reflexaoDominante: string;
}

export const INITIAL_STATE: AtlasState = {
  selecionados: [],
  descricoes: {},
  atividades: {},
  situacoes: {},
  dinamicaGeral: '',
  conflitos: '',
  harmonias: '',
  arquetipoDominante: '',
  arquetipoDormindo: '',
  oQuePoderia: '',
  reflexaoDominante: '',
};

export function calcAtlasStats(state: AtlasState) {
  const atividades = state.selecionados.map(n => ({ nome: n, val: state.atividades[n] || 0 }));
  const sorted = [...atividades].sort((a, b) => b.val - a.val);
  const dominante = sorted[0];
  const menosAtivo = sorted[sorted.length - 1];
  const media = atividades.length > 0
    ? atividades.reduce((s, a) => s + a.val, 0) / atividades.length
    : 0;

  const naoSelecionados = ARQUETIPOS
    .filter(a => !state.selecionados.includes(a.nome))
    .map(a => a.nome);

  return { dominante, menosAtivo, media, naoSelecionados, atividades: sorted };
}
