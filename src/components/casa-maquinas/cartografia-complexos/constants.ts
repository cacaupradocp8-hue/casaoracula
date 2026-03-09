export interface Complexo {
  nome: string;
  gatilho: string;
  reacaoAutomatica: string;
  emocaoCentral: string;
  origem: string;
  intensidade: number;
  frequencia: string;
}

export const EMOCOES_COMPLEXO = [
  'Raiva', 'Medo', 'Vergonha', 'Culpa', 'Tristeza',
  'Abandono', 'Rejeição', 'Impotência', 'Inadequação', 'Ciúme',
] as const;

export const FREQUENCIAS = [
  { value: 'diaria', label: 'Diária' },
  { value: 'semanal', label: 'Semanal' },
  { value: 'mensal', label: 'Mensal' },
  { value: 'situacional', label: 'Situacional' },
  { value: 'rara', label: 'Rara' },
] as const;

export interface ComplexosState {
  complexos: Complexo[];
  gatilhosGerais: string;
  padraoCentral: string;
  reflexaoOrigem: string;
  reflexaoFinal: string;
}

export const INITIAL_STATE: ComplexosState = {
  complexos: [],
  gatilhosGerais: '',
  padraoCentral: '',
  reflexaoOrigem: '',
  reflexaoFinal: '',
};

export const EMPTY_COMPLEXO: Complexo = {
  nome: '', gatilho: '', reacaoAutomatica: '', emocaoCentral: '',
  origem: '', intensidade: 5, frequencia: '',
};

export function calcComplexoStats(state: ComplexosState) {
  const total = state.complexos.length;
  if (total === 0) return { total, dominante: null, latente: null, mediaIntensidade: 0, emocoesMaisFrequentes: [] };

  const sorted = [...state.complexos].sort((a, b) => b.intensidade - a.intensidade);
  const dominante = sorted[0];
  const latente = sorted[sorted.length - 1];
  const mediaIntensidade = state.complexos.reduce((s, c) => s + c.intensidade, 0) / total;

  const emocaoCount: Record<string, number> = {};
  state.complexos.forEach(c => {
    if (c.emocaoCentral) emocaoCount[c.emocaoCentral] = (emocaoCount[c.emocaoCentral] || 0) + 1;
  });
  const emocoesMaisFrequentes = Object.entries(emocaoCount).sort((a, b) => b[1] - a[1]);

  return { total, dominante, latente, mediaIntensidade, emocoesMaisFrequentes };
}
