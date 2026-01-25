// Pedagogical Module Types for Casa Orácula
// Structured format for complete pedagogical units within courses

export interface LeituraCard {
  numero: number;
  texto: string;
}

export interface FerramentaPratica {
  nome: string;
  descricao: string;
  rota: string; // Internal app route
}

export interface EstudoCaso {
  titulo: string;
  texto: string;
}

export interface CheckMaturidade {
  pergunta: string;
}

// Extended CourseModule with pedagogical blocks
export interface PedagogicalModuleData {
  // Standard module fields
  id: string;
  course_id: string;
  titulo: string;
  subtitulo?: string | null;
  descricao?: string | null;
  ordem: number;
  publicado: boolean;
  disponivel_em?: string | null;
  dias_apos_matricula?: number | null;
  created_at: string;
  updated_at: string;

  // Pedagogical format flag
  formato_pedagogico: boolean;

  // Block 1: Main Video
  video_principal_url?: string | null;
  video_principal_titulo?: string | null;
  video_principal_duracao?: number | null; // minutes

  // Block 2: Reading Cards (up to 12)
  cards_leitura: LeituraCard[];

  // Block 3: Practical Tool Reference
  ferramenta_pratica?: FerramentaPratica | null;

  // Block 4: Case Studies (up to 3)
  estudos_caso: EstudoCaso[];

  // Block 5: Reflexive Check (up to 5 questions)
  check_maturidade: CheckMaturidade[];
}

// Form data for admin editing
export interface PedagogicalModuleFormData {
  titulo: string;
  subtitulo: string;
  descricao: string;
  video_principal_url: string;
  video_principal_titulo: string;
  video_principal_duracao: number | null;
  cards_leitura: LeituraCard[];
  ferramenta_pratica: FerramentaPratica | null;
  estudos_caso: EstudoCaso[];
  check_maturidade: CheckMaturidade[];
}

// Default empty module
export const emptyPedagogicalModule: PedagogicalModuleFormData = {
  titulo: '',
  subtitulo: '',
  descricao: '',
  video_principal_url: '',
  video_principal_titulo: '',
  video_principal_duracao: null,
  cards_leitura: [],
  ferramenta_pratica: null,
  estudos_caso: [],
  check_maturidade: [],
};

// Validation limits
export const PEDAGOGICAL_LIMITS = {
  MAX_CARDS: 12,
  MAX_CASE_STUDIES: 3,
  MAX_CHECK_QUESTIONS: 5,
};
