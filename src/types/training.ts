/**
 * TYPES V0.2 - SALA DE TREINAMENTO
 * 
 * Finalidade: Definição do contrato TypeScript para persistência pedagógica.
 * Estes tipos espelham o schema definido em docs/TRAINING_V0_2_SCHEMA_DRAFT.sql.
 * 
 * GUARDRAILS ÉTICOS:
 * 1. Uso exclusivo para treino pedagógico e simulações.
 * 2. Proibido armazenamento de dados de clientes reais.
 * 3. Proibido armazenamento de diagnósticos clínicos.
 * 4. Isolamento total entre contexto de treino e prática profissional.
 */

export type TrainingProgressStatus = 
  | "not_started" 
  | "in_progress" 
  | "completed" 
  | "revisited";

export type TrainingExerciseType = 
  | "essay" 
  | "multiple_choice" 
  | "symbolic_map" 
  | "guided_reflection" 
  | "formulation_practice";

export interface TrainingResponseMetadata {
  [key: string]: any;
  tags?: string[];
  score?: number;
  selected_options?: string[];
}

/**
 * Interface para a tabela training_progress
 */
export interface TrainingProgress {
  id: string;
  user_id: string;
  module_key: string;
  module_title: string;
  status: TrainingProgressStatus;
  progress_percentage: number;
  started_at: string | null;
  completed_at: string | null;
  last_activity_at: string;
  created_at: string;
  updated_at: string;
}

export type TrainingProgressInsert = Omit<TrainingProgress, "id" | "created_at" | "updated_at">;
export type TrainingProgressUpdate = Partial<TrainingProgressInsert>;

/**
 * Interface para a tabela training_submissions
 */
export interface TrainingSubmission {
  id: string;
  user_id: string;
  module_key: string;
  exercise_key: string;
  exercise_type: TrainingExerciseType;
  case_key: string | null;
  prompt_text: string | null;
  response_text: string;
  response_metadata: TrainingResponseMetadata;
  is_fictional: boolean;
  is_archived: boolean;
  submitted_at: string;
  created_at: string;
  updated_at: string;
}

export type TrainingSubmissionInsert = Omit<TrainingSubmission, "id" | "created_at" | "updated_at">;
export type TrainingSubmissionUpdate = Partial<TrainingSubmissionInsert>;
