export interface ParteInterna {
  nome: string;
  tipo: string;
  voz: string;
  desejo: string;
  medo: string;
  cor: string;
}

export interface Dialogo {
  deParte: string;
  paraParte: string;
  mensagem: string;
}

export const TIPOS_PARTE = [
  'Protetora', 'Crítica', 'Criança', 'Sábia', 'Guerreira',
  'Cuidadora', 'Rebelde', 'Medrosa', 'Criativa', 'Outro',
] as const;

export const CORES_PARTE = [
  '#C9A24A', '#9B8EC4', '#6EBF8B', '#D4756B', '#7BA7C9',
  '#E8A838', '#B06B8F', '#556B57', '#4A4A5A', '#C4A87B',
] as const;

export interface ConselhoState {
  partes: ParteInterna[];
  dialogos: Dialogo[];
  temaConselho: string;
  sabedoriaIntegrada: string;
  decisaoConselho: string;
  reflexaoFinal: string;
}

export const INITIAL_STATE: ConselhoState = {
  partes: [],
  dialogos: [],
  temaConselho: '',
  sabedoriaIntegrada: '',
  decisaoConselho: '',
  reflexaoFinal: '',
};

export const EMPTY_PARTE: ParteInterna = {
  nome: '', tipo: '', voz: '', desejo: '', medo: '', cor: CORES_PARTE[0],
};
