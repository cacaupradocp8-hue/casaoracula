// ============================================
// JARDIM DA HEROÍNA - NEW TYPES (Integration Space)
// ============================================
// Temporary integration space between sessions
// Activated ONLY by therapist, never by client

// Status do Jardim
export type JardimHeroinaStatus = 'inactive' | 'active' | 'closed';

// Tipos de gesto simbólico
export type JardimGestoTipo = 
  | 'observacao'     // observation
  | 'limite'         // boundary  
  | 'cuidado'        // self-care
  | 'pausa'          // pause
  | 'acao_simbolica'; // simple symbolic action

export const GESTO_TIPO_LABELS: Record<JardimGestoTipo, string> = {
  observacao: 'Observação',
  limite: 'Limite',
  cuidado: 'Cuidado',
  pausa: 'Pausa',
  acao_simbolica: 'Ação Simbólica',
};

export const GESTO_TIPO_ICONS: Record<JardimGestoTipo, string> = {
  observacao: '👁️',
  limite: '🚧',
  cuidado: '💚',
  pausa: '⏸️',
  acao_simbolica: '✨',
};

// Opções de sustentação do gesto
export type GestoSustentacao = 'sim' | 'parcialmente' | 'nao';

export const SUSTENTACAO_LABELS: Record<GestoSustentacao, string> = {
  sim: 'Sim, sustentei',
  parcialmente: 'Parcialmente',
  nao: 'Não consegui',
};

// Interface principal do Jardim
export interface JardimHeroinaNovo {
  id: string;
  case_id: string;
  therapist_id: string;
  client_id: string;
  status: JardimHeroinaStatus;
  
  // Section 1: Chegada ao Jardim
  chegada_vivo: string | null;      // max 240 chars
  chegada_corpo: string | null;     // max 100 chars
  
  // Section 2: Integração da Semana
  integracao_observar: string | null; // max 300 chars
  
  // Section 3: Gesto Simbólico (CORE)
  gesto_descricao: string | null;   // max 200 chars
  gesto_tipo: JardimGestoTipo | null;
  gesto_prazo: string | null;       // date
  gesto_prazo_texto: string | null; // max 50 chars
  
  // Section 4: Observação Simples
  observacao_sustentou: GestoSustentacao | null;
  observacao_percebi: string | null; // max 180 chars
  
  // Section 5: Fechamento
  fechamento_levo: string | null;   // max 200 chars
  fechamento_deixo: string | null;  // max 200 chars
  
  // Metadata
  ativado_em: string | null;
  fechado_em: string | null;
  created_at: string;
  updated_at: string;
}

// Para criação de novo Jardim
export interface NovoJardimHeroina {
  case_id: string;
  therapist_id: string;
  client_id: string;
}

// Para atualização
export interface AtualizarJardimHeroina {
  chegada_vivo?: string | null;
  chegada_corpo?: string | null;
  integracao_observar?: string | null;
  gesto_descricao?: string | null;
  gesto_tipo?: JardimGestoTipo | null;
  gesto_prazo?: string | null;
  gesto_prazo_texto?: string | null;
  observacao_sustentou?: GestoSustentacao | null;
  observacao_percebi?: string | null;
  fechamento_levo?: string | null;
  fechamento_deixo?: string | null;
}
