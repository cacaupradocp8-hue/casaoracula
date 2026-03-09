export interface Aprendizado {
  area: string;
  descricao: string;
  importancia: number;
}

export interface ElementoRitual {
  nome: string;
  significado: string;
}

export const AREAS_APRENDIZADO = [
  'Autoconhecimento', 'Relacionamentos', 'Corpo', 'Emoções',
  'Propósito', 'Limites', 'Criatividade', 'Espiritualidade',
] as const;

export const ELEMENTOS_SUGERIDOS = [
  'Vela', 'Água', 'Terra', 'Incenso', 'Escrita', 'Música',
  'Silêncio', 'Movimento', 'Pedra', 'Flor', 'Espelho', 'Fogo',
] as const;

export interface RitualState {
  aprendizados: Aprendizado[];
  oQueDeixo: string;
  oQueLevo: string;
  simboloTransicao: string;
  elementos: ElementoRitual[];
  intencao: string;
  compromisso: string;
  dataRitual: string;
  reflexaoFinal: string;
}

export const INITIAL_STATE: RitualState = {
  aprendizados: [],
  oQueDeixo: '',
  oQueLevo: '',
  simboloTransicao: '',
  elementos: [],
  intencao: '',
  compromisso: '',
  dataRitual: '',
  reflexaoFinal: '',
};

export const EMPTY_APRENDIZADO: Aprendizado = { area: '', descricao: '', importancia: 5 };
export const EMPTY_ELEMENTO: ElementoRitual = { nome: '', significado: '' };
