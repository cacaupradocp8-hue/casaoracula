// Mapa Vivo da Heroína Oracular - Types

export type FaseJornada =
  | 'chamado_silenciado'
  | 'descida'
  | 'fragmentacao'
  | 'sombra_revelada'
  | 'travessia'
  | 'reintegracao'
  | 'retorno_sabedoria';

export type RitualTipo =
  | 'interno'
  | 'corporal'
  | 'relacional'
  | 'simbolico_concreto'
  | 'ritual_tempo';

export type MovimentoHeroina = 'avancou' | 'resistiu' | 'ciclou';

export interface MapaVivoHeroina {
  id: string;
  session_case_id: string;
  therapist_id: string;
  client_id: string;

  // Camada 1: Localização na Jornada
  fase_jornada: FaseJornada | null;
  fase_descricao: string | null;

  // Camada 2: Arquétipos Ativos
  arquetipo_predominante: string | null;
  arquetipo_tensao: string | null;
  arquetipo_emergente: string | null;
  dinamica_arquetipal: string | null;

  // Camada 3: Narrativa Pessoal
  simbolo_recorrente: string | null;
  mito_pessoal: string | null;
  metafora_central: string | null;

  // Camada 4: Ritual Sugerido
  ritual_tipo: RitualTipo | null;
  ritual_descricao: string | null;
  ritual_realizado: boolean;
  ritual_observacoes: string | null;

  // Camada 5: Movimento da Heroína
  movimento_heroina: MovimentoHeroina | null;
  movimento_descricao: string | null;

  // Camada 6: (Espelho da Terapeuta migrado para Jardim do Ofício)

  // Camada 7: Gesto de Integração (ponte para o Jardim)
  gesto_integracao: string | null;
  gesto_sem_indicacao: boolean;
  gesto_justificativa: string | null;
  gesto_jardim_registro_id: string | null;

  // Metadata
  created_at: string;
  updated_at: string;
}

export interface MapaVivoHistorico {
  id: string;
  mapa_id: string;
  session_case_id: string;
  therapist_id: string;
  fase_anterior: string | null;
  fase_nova: string | null;
  movimento: string | null;
  observacao: string | null;
  created_at: string;
}

export const FASES_JORNADA: { value: FaseJornada; label: string; descricao: string; cor: string }[] = [
  { value: 'chamado_silenciado', label: 'Chamado Silenciado', descricao: 'A heroína sente um incômodo mas ainda não reconhece o chamado', cor: 'bg-slate-500' },
  { value: 'descida', label: 'Descida', descricao: 'Início da jornada rumo ao desconhecido', cor: 'bg-indigo-500' },
  { value: 'fragmentacao', label: 'Fragmentação', descricao: 'Momento de crise e dissolução de antigas estruturas', cor: 'bg-purple-500' },
  { value: 'sombra_revelada', label: 'Sombra Revelada', descricao: 'Confronto com aspectos rejeitados do self', cor: 'bg-violet-700' },
  { value: 'travessia', label: 'Travessia', descricao: 'Atravessamento do limiar transformador', cor: 'bg-amber-500' },
  { value: 'reintegracao', label: 'Reintegração', descricao: 'Reunificação dos fragmentos em nova identidade', cor: 'bg-emerald-500' },
  { value: 'retorno_sabedoria', label: 'Retorno com Sabedoria', descricao: 'Retorno ao mundo com o dom conquistado', cor: 'bg-gold' },
];

export const TIPOS_RITUAL: { value: RitualTipo; label: string; descricao: string }[] = [
  { value: 'interno', label: 'Ritual Interno', descricao: 'Meditação, visualização, diálogo interior' },
  { value: 'corporal', label: 'Ritual Corporal', descricao: 'Movimento, dança, respiração consciente' },
  { value: 'relacional', label: 'Ritual Relacional', descricao: 'Conversa, carta, gesto simbólico com outro' },
  { value: 'simbolico_concreto', label: 'Ritual Simbólico-Concreto', descricao: 'Objeto, altar, queima, enterro simbólico' },
  { value: 'ritual_tempo', label: 'Ritual de Tempo', descricao: 'Período de silêncio, jejum simbólico, espera consciente' },
];

export const MOVIMENTOS: { value: MovimentoHeroina; label: string; cor: string }[] = [
  { value: 'avancou', label: 'Avançou', cor: 'bg-emerald-500' },
  { value: 'resistiu', label: 'Resistiu', cor: 'bg-amber-500' },
  { value: 'ciclou', label: 'Ciclou', cor: 'bg-purple-500' },
];
