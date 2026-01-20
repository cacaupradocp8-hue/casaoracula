export interface TherapeuticGroup {
  id: string;
  therapist_id: string;
  nome: string;
  descricao: string | null;
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
  participants_count?: number;
}

export interface GroupParticipant {
  id: string;
  group_id: string;
  cliente_id: string;
  joined_at: string;
  ativo: boolean;
  cliente?: {
    id: string;
    nome: string;
  };
}

export interface GroupSession {
  id: string;
  group_id: string;
  therapist_id: string;
  title: string;
  notes: string | null;
  status: 'draft' | 'active' | 'archived';
  created_at: string;
  updated_at: string;
}
