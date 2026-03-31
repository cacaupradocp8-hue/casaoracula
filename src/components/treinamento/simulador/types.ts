// Interfaces matching co_training_* tables

export interface TrainingCase {
  id: string;
  title: string;
  nivel: 'guiado' | 'semi_guiado' | 'livre';
  tema: string | null;
  caso_texto: string;
  distrito_esperado: string | null;
  estado_esperado: string | null;
  movimento_esperado: string | null;
  hipotese_esperada: string | null;
  vetor_esperado: string | null;
  ferramenta_principal: string | null;
  ativo: boolean;
  ordem: number;
  // Joined data
  signals?: TrainingCaseSignal[];
  readings?: TrainingCaseReading[];
  feedbacks?: TrainingCaseFeedback[];
}

export interface TrainingCaseSignal {
  id: string;
  case_id: string;
  sinal: string;
  ordem: number;
}

export interface TrainingCaseReading {
  id: string;
  case_id: string;
  leitura: string;
  tipo: 'esperada' | 'aceitavel' | 'erro_comum';
  observacao: string | null;
}

export interface TrainingCaseFeedback {
  id: string;
  case_id: string;
  tipo: 'coerente' | 'ajuste' | 'erro';
  gatilho: string | null;
  feedback_texto: string;
}

export interface TrainingAttempt {
  id?: string;
  user_id: string;
  case_id: string;
  resposta_o_que_acontece: string;
  resposta_parece_o_que: string;
  resposta_distrito: string;
  resposta_estado: string;
  resposta_movimento: string;
  resposta_hipotese: string;
  resposta_vetor: string;
  resposta_ferramenta: string;
  feedback_final: string | null;
  status: 'rascunho' | 'concluido';
}

// Legacy type kept for backwards compat (old table)
export interface CasoSimulado {
  id: string;
  titulo: string;
  nivel: 'guiado' | 'semi-guiado' | 'livre';
  fala_inicial: string;
  sinais: string[];
  contexto_breve: string;
  perguntas_leitura: string[];
  distrito_referencia: string | null;
  estado_referencia: string | null;
  hipotese_referencia: string | null;
  vetor_referencia: string | null;
  ferramenta_referencia: string | null;
  feedback_json: {
    coerencia_alta?: string;
    coerencia_media?: string;
    riscos?: string[];
  };
  ordem: number;
}

export interface RespostaAluna {
  leitura_texto: string;
  distrito_escolhido: string;
  estado_escolhido: string;
  hipotese_texto: string;
  vetor_texto: string;
  ferramenta_escolhida: string;
}

export type SimuladorStep = 'caso' | 'leitura' | 'posicionamento' | 'direcao' | 'ferramenta' | 'feedback';

export const STEP_ORDER: SimuladorStep[] = ['caso', 'leitura', 'posicionamento', 'direcao', 'ferramenta', 'feedback'];

export const STEP_LABELS: Record<SimuladorStep, string> = {
  caso: 'Caso',
  leitura: 'Leitura',
  posicionamento: 'Posição',
  direcao: 'Direção',
  ferramenta: 'Ferramenta',
  feedback: 'Retorno',
};

export const ESTADOS_CLIENTE = [
  'contraída', 'instável', 'receptiva', 'dissociada',
  'hiperativa', 'em transição', 'em luto', 'resistente',
];

export const DISTRITOS_CIDADELA = [
  'Portão da Chegada', 'Torres', 'Portas', 'Jardim dos Arquétipos',
  'Praça do Abalo', 'Casa dos Sonhos', 'Espelho dos Vínculos',
  'Forja', 'Conselho Interior', 'Labirinto', 'Praça da Integração',
  'Portal de Renascimento',
];

export const FERRAMENTAS_METODO = [
  'Cartografia Psíquica', 'Torre Viva', 'Labirinto das 39 Portas',
  'Atlas de Arquétipos', 'Escrita Simbólica', 'Decodificação Onírica',
  'Espelho Relacional', 'Ritual Simbólico', 'Diálogo de Partes',
  'Portas Avançadas', 'Mapa de Transformação', 'Ritual de Passagem',
];
