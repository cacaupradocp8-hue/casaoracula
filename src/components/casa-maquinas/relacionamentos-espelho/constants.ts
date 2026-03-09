
export interface Relacionamento {
  nome: string;
  tipo: string;
  qualidade: string;
  admiracao: string;
  irritacao: string;
  projecao: string;
}

export const TIPOS_RELACIONAMENTO = [
  'Parceiro(a)',
  'Mãe/Pai',
  'Filho(a)',
  'Irmão(ã)',
  'Amigo(a)',
  'Colega',
  'Mentor(a)',
  'Outro',
] as const;

export const QUALIDADES_RELACAO = [
  'Profunda',
  'Superficial',
  'Conflituosa',
  'Harmoniosa',
  'Distante',
  'Dependente',
  'Nutritiva',
  'Tóxica',
] as const;

export interface EspelhoState {
  relacionamentos: Relacionamento[];
  padroes: string;
  padraoCentral: string;
  reflexaoFinal: string;
}

export const INITIAL_STATE: EspelhoState = {
  relacionamentos: [],
  padroes: '',
  padraoCentral: '',
  reflexaoFinal: '',
};

export function calcEspelhoStats(state: EspelhoState) {
  const total = state.relacionamentos.length;
  const tipos = state.relacionamentos.reduce((acc, r) => {
    acc[r.tipo] = (acc[r.tipo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const qualidades = state.relacionamentos.reduce((acc, r) => {
    acc[r.qualidade] = (acc[r.qualidade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const tipoMaisFrequente = Object.entries(tipos).sort((a, b) => b[1] - a[1])[0];
  const qualidadeMaisFrequente = Object.entries(qualidades).sort((a, b) => b[1] - a[1])[0];

  const comProjecao = state.relacionamentos.filter(r => r.projecao.trim().length > 0).length;

  return { total, tipos, qualidades, tipoMaisFrequente, qualidadeMaisFrequente, comProjecao };
}
