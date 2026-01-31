// ============================================
// JARDIM DA HEROÍNA - TYPES
// ============================================
// Diário simbólico terapêutico integrado ao Mapa Vivo

export type TipoRegistroJardim = 'sessao' | 'entre_sessoes' | 'reflexao';

export interface JardimHeroinaRegistro {
  id: string;
  session_case_id: string;
  therapist_id: string;
  mapa_vivo_id: string | null;
  
  tipo_registro: TipoRegistroJardim;
  
  // Snapshot do Mapa Vivo
  fase_jornada_snapshot: string | null;
  arquetipo_snapshot: string | null;
  
  // 1. Aterramento da Sessão
  aterramento_ficou_vivo: string | null;
  aterramento_imagem_central: string | null;
  aterramento_corpo_sentiu: string | null;
  
  // 2. Ritual em Vivência
  ritual_vivendo: string | null;
  ritual_resistencia: string | null;
  ritual_movimento: string | null;
  
  // 3. Sonhos, Imagens e Sinais
  sonhos_imagens: string | null;
  sinais_sincronicidades: string | null;
  memorias_emergentes: string | null;
  
  // 4. Frase-Semente
  frase_semente: string | null;
  
  // 5. Notas Privadas
  notas_privadas: string | null;
  
  // Metadados
  data_registro: string;
  created_at: string;
  updated_at: string;
}

export interface NovoJardimRegistro {
  session_case_id: string;
  therapist_id: string;
  mapa_vivo_id?: string;
  tipo_registro: TipoRegistroJardim;
  fase_jornada_snapshot?: string;
  arquetipo_snapshot?: string;
  aterramento_ficou_vivo?: string;
  aterramento_imagem_central?: string;
  aterramento_corpo_sentiu?: string;
  ritual_vivendo?: string;
  ritual_resistencia?: string;
  ritual_movimento?: string;
  sonhos_imagens?: string;
  sinais_sincronicidades?: string;
  memorias_emergentes?: string;
  frase_semente?: string;
  notas_privadas?: string;
  data_registro?: string;
}

export const TIPOS_REGISTRO_LABELS: Record<TipoRegistroJardim, string> = {
  sessao: 'Registro de Sessão',
  entre_sessoes: 'Entre Sessões',
  reflexao: 'Reflexão',
};
