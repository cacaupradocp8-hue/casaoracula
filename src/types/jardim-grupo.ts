// ============================================
// JARDIM DO GRUPO - TYPES
// ============================================
// Diário terapêutico coletivo para grupos terapêuticos

export type ClimaMovimento = 'expansao' | 'recolhimento' | 'tensao' | 'fluidez' | 'outro';

export interface JardimGrupoRegistro {
  id: string;
  group_id: string;
  session_id: string | null;
  therapist_id: string;
  
  // Contexto do Encontro
  fase_jornada_grupo: string | null;
  tema_simbolico: string | null;
  ritual_atual: string | null;
  
  // 1. Clima do Campo
  clima_movimento: ClimaMovimento | null;
  clima_descricao: string | null;
  escuta_campo: string | null;
  
  // 2. Ecos da Jornada Coletiva
  movimentos_repetidos: string | null;
  escuta_coletiva: string | null;
  resistencias_grupais: string | null;
  
  // 3. Ritual do Encontro
  ritual_realizado: string | null;
  resposta_campo: string | null;
  
  // 4. Imagens, Símbolos e Frases
  imagens_emergentes: string | null;
  simbolos_coletivos: string | null;
  frase_semente_grupo: string | null;
  
  // 5. Fechamento Ético
  campo_fechado: boolean;
  ritual_fechamento: string | null;
  cuidado_proximo_encontro: string | null;
  
  // 6. Notas Privadas
  notas_privadas: string | null;
  
  // Metadados
  data_registro: string;
  created_at: string;
  updated_at: string;
}

export interface NovoJardimGrupoRegistro {
  group_id: string;
  session_id?: string;
  therapist_id: string;
  fase_jornada_grupo?: string;
  tema_simbolico?: string;
  ritual_atual?: string;
  clima_movimento?: ClimaMovimento;
  clima_descricao?: string;
  escuta_campo?: string;
  movimentos_repetidos?: string;
  escuta_coletiva?: string;
  resistencias_grupais?: string;
  ritual_realizado?: string;
  resposta_campo?: string;
  imagens_emergentes?: string;
  simbolos_coletivos?: string;
  frase_semente_grupo?: string;
  campo_fechado?: boolean;
  ritual_fechamento?: string;
  cuidado_proximo_encontro?: string;
  notas_privadas?: string;
  data_registro?: string;
}

export const CLIMA_MOVIMENTO_LABELS: Record<ClimaMovimento, string> = {
  expansao: 'Expansão',
  recolhimento: 'Recolhimento',
  tensao: 'Tensão',
  fluidez: 'Fluidez',
  outro: 'Outro',
};

export const CLIMA_MOVIMENTO_ICONS: Record<ClimaMovimento, string> = {
  expansao: '☀️',
  recolhimento: '🌙',
  tensao: '⚡',
  fluidez: '🌊',
  outro: '✨',
};
