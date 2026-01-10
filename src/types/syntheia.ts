export type SyntheiaTipo = 
  | 'sessao_individual' 
  | 'experiencia_grupo' 
  | 'ritual' 
  | 'produto_programa' 
  | 'aula_conteudo';

export type SyntheiaPublicoAlvo = 
  | 'mulher_individual' 
  | 'grupo_mulheres' 
  | 'publico_profissional';

export type SyntheiaMomentoJornada = 
  | 'inicio' 
  | 'crise_transicao' 
  | 'integracao' 
  | 'fechamento';

export type SyntheiaTempoDisponivel = 
  | '30min' 
  | '50min' 
  | '90min' 
  | 'jornada_multipla';

export interface SyntheiaFormData {
  tipo: SyntheiaTipo;
  publico_alvo: SyntheiaPublicoAlvo;
  momento_jornada: SyntheiaMomentoJornada;
  tempo_disponivel: SyntheiaTempoDisponivel;
  tema_principal: string;
}

export interface SyntheiaGeneratedContent {
  titulo: string;
  chave_simbolica: string;
  intencao_terapeutica: string;
  estrutura_pratica: string;
  suporte_linguagem: string;
  fechamento_integracao: string;
}

export interface SyntheiaCreation extends SyntheiaFormData, Partial<SyntheiaGeneratedContent> {
  id: string;
  user_id: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export const TIPO_OPTIONS: { value: SyntheiaTipo; label: string; icon: string }[] = [
  { value: 'sessao_individual', label: 'Sessão Individual', icon: 'User' },
  { value: 'experiencia_grupo', label: 'Experiência de Grupo', icon: 'Users' },
  { value: 'ritual', label: 'Ritual', icon: 'Flame' },
  { value: 'produto_programa', label: 'Produto / Programa', icon: 'Package' },
  { value: 'aula_conteudo', label: 'Aula / Conteúdo', icon: 'BookOpen' },
];

export const PUBLICO_OPTIONS: { value: SyntheiaPublicoAlvo; label: string }[] = [
  { value: 'mulher_individual', label: 'Mulher individual' },
  { value: 'grupo_mulheres', label: 'Grupo de mulheres' },
  { value: 'publico_profissional', label: 'Público profissional' },
];

export const MOMENTO_OPTIONS: { value: SyntheiaMomentoJornada; label: string }[] = [
  { value: 'inicio', label: 'Início' },
  { value: 'crise_transicao', label: 'Crise / Transição' },
  { value: 'integracao', label: 'Integração' },
  { value: 'fechamento', label: 'Fechamento' },
];

export const TEMPO_OPTIONS: { value: SyntheiaTempoDisponivel; label: string }[] = [
  { value: '30min', label: '30 minutos' },
  { value: '50min', label: '50 minutos' },
  { value: '90min', label: '90 minutos' },
  { value: 'jornada_multipla', label: 'Jornada multi-sessão' },
];
