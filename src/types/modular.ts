// ============================================
// MODULAR PAGE SYSTEM - TYPES
// ============================================

import { PortalType } from './portal';

// Block type enum matching database
export type ContentBlockType = 
  | 'rich_text'
  | 'image'
  | 'video'
  | 'audio'
  | 'ai_chat'
  | 'cta_button'
  // New interactive block types
  | 'chakra_wheel'
  | 'energy_slider'
  | 'pattern_diary'
  | 'lunar_calendar'
  | 'pendulum_map'
  | 'ego_layers'
  | 'archetype_card'
  | 'reflection_prompt';

// Context type enum - where blocks can be used
export type BlockContextType = 
  | 'quiz_result'
  | 'portal'
  | 'ritual'
  | 'formation'
  | 'tool'
  | 'sala'
  | 'landing';

// ============================================
// CONTENT SCHEMAS FOR EACH BLOCK TYPE
// ============================================

export interface RichTextContent {
  html: string;
  plainText?: string;
}

export interface ImageContent {
  url: string;
  alt?: string;
  caption?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | '3:4' | 'auto';
  size?: 'small' | 'medium' | 'large' | 'full';
}

export interface VideoContent {
  url: string;
  provider?: 'youtube' | 'vimeo' | 'custom';
  thumbnail?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

export interface AudioContent {
  url: string;
  title?: string;
  artist?: string;
  coverImage?: string;
  autoplay?: boolean;
  loop?: boolean;
}

export interface AIChatContent {
  agenteId?: string;
  placeholder?: string;
  welcomeMessage?: string;
  contextPrompt?: string;
  maxMessages?: number;
  showHistory?: boolean;
}

export interface CTAButtonContent {
  text: string;
  href?: string;
  action?: 'navigate' | 'scroll' | 'modal' | 'external';
  variant?: 'default' | 'gold' | 'mystical' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: string;
  fullWidth?: boolean;
}

// ============================================
// NEW INTERACTIVE BLOCK CONTENT SCHEMAS
// ============================================

export type ChakraStatus = 'equilibrado' | 'bloqueado' | 'hiperativo' | 'em_cura';

export interface ChakraState {
  nome: string;
  cor: string;
  status: ChakraStatus;
  observacao?: string;
}

export interface ChakraWheelContent {
  allowMultipleSelection?: boolean;
  showDescriptions?: boolean;
  showObservations?: boolean;
  saveToRegistros?: boolean;
  chakras?: ChakraState[];
}

export interface EnergySliderContent {
  minValue?: number;
  maxValue?: number;
  defaultValue?: number;
  showLabels?: boolean;
  showFeedback?: boolean;
  feedbackTexts?: Record<string, string>;
  saveToRegistros?: boolean;
}

export interface PatternDiaryContent {
  fields?: Array<{
    key: string;
    label: string;
    placeholder?: string;
    type: 'text' | 'textarea' | 'select';
    options?: string[];
  }>;
  showAIReflection?: boolean;
  agenteId?: string;
  saveToRegistros?: boolean;
}

export interface LunarCalendarContent {
  showPhases?: boolean;
  showEmotionInput?: boolean;
  showIntentionInput?: boolean;
  showEnergyInput?: boolean;
  monthsToShow?: number;
  saveToRegistros?: boolean;
}

export interface PendulumMapContent {
  maps?: Array<{
    id: string;
    name: string;
    imageUrl?: string;
    options?: string[];
  }>;
  showAnimation?: boolean;
  enableSound?: boolean;
  saveToRegistros?: boolean;
}

export interface EgoLayersContent {
  layers?: Array<{
    id: string;
    name: string;
    color: string;
    questions?: string[];
  }>;
  showProgress?: boolean;
  saveToRegistros?: boolean;
}

export interface ArchetypeCardContent {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  description?: string;
  keywords?: string[];
  shadowAspect?: string;
  lightAspect?: string;
  practice?: string;
}

export interface ReflectionPromptContent {
  prompt?: string;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  showAIResponse?: boolean;
  agenteId?: string;
  saveToRegistros?: boolean;
}

// ============================================
// UNION TYPE FOR ALL CONTENT TYPES
// ============================================

export type BlockContent = 
  | RichTextContent
  | ImageContent
  | VideoContent
  | AudioContent
  | AIChatContent
  | CTAButtonContent
  | ChakraWheelContent
  | EnergySliderContent
  | PatternDiaryContent
  | LunarCalendarContent
  | PendulumMapContent
  | EgoLayersContent
  | ArchetypeCardContent
  | ReflectionPromptContent;

// ============================================
// MAIN CONTENT BLOCK INTERFACE
// ============================================

export interface ContentBlock {
  id: string;
  contextType: BlockContextType;
  contextId: string;
  blockType: ContentBlockType;
  ordem: number;
  ativo: boolean;
  portalMinimo: PortalType;
  content: BlockContent;
  agenteId?: string;
  titulo?: string;
  descricao?: string;
  createdAt: string;
  updatedAt: string;
}

// Raw database row (snake_case)
export interface ContentBlockRow {
  id: string;
  context_type: BlockContextType;
  context_id: string;
  block_type: ContentBlockType;
  ordem: number;
  ativo: boolean;
  portal_minimo: PortalType;
  content: Record<string, unknown>;
  agente_id?: string;
  titulo?: string;
  descricao?: string;
  created_at: string;
  updated_at: string;
}

// Transform function
export function transformBlockRow(row: ContentBlockRow): ContentBlock {
  return {
    id: row.id,
    contextType: row.context_type,
    contextId: row.context_id,
    blockType: row.block_type,
    ordem: row.ordem,
    ativo: row.ativo,
    portalMinimo: row.portal_minimo,
    content: row.content as BlockContent,
    agenteId: row.agente_id,
    titulo: row.titulo,
    descricao: row.descricao,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Block editor form state
export interface BlockFormState {
  blockType: ContentBlockType;
  ordem: number;
  ativo: boolean;
  portalMinimo: PortalType;
  content: BlockContent;
  agenteId?: string;
  titulo?: string;
  descricao?: string;
}

// ============================================
// DEFAULT CONTENT FOR EACH BLOCK TYPE
// ============================================

export const DEFAULT_BLOCK_CONTENT: Record<ContentBlockType, BlockContent> = {
  rich_text: { html: '', plainText: '' },
  image: { url: '', alt: '', size: 'medium' },
  video: { url: '', provider: 'youtube' },
  audio: { url: '', title: '' },
  ai_chat: { placeholder: 'Digite sua pergunta...', showHistory: true },
  cta_button: { text: 'Saiba mais', action: 'navigate', variant: 'gold', size: 'lg' },
  // New interactive blocks
  chakra_wheel: { allowMultipleSelection: true, showDescriptions: true, showObservations: true, saveToRegistros: true },
  energy_slider: { minValue: 20, maxValue: 1000, defaultValue: 200, showLabels: true, showFeedback: true, saveToRegistros: true },
  pattern_diary: { 
    fields: [
      { key: 'gatilho', label: 'Gatilho', placeholder: 'O que disparou esse padrão?', type: 'textarea' },
      { key: 'emocao', label: 'Emoção', placeholder: 'O que você sentiu?', type: 'textarea' },
      { key: 'resposta', label: 'Resposta Desejada', placeholder: 'Como gostaria de responder?', type: 'textarea' },
    ],
    showAIReflection: true,
    saveToRegistros: true 
  },
  lunar_calendar: { showPhases: true, showEmotionInput: true, showIntentionInput: true, showEnergyInput: true, monthsToShow: 1, saveToRegistros: true },
  pendulum_map: { 
    maps: [
      { id: 'sim_nao', name: 'Sim/Não', options: ['Sim', 'Não', 'Talvez'] },
      { id: 'chakras', name: 'Chakras', options: ['Raiz', 'Sacral', 'Plexo Solar', 'Cardíaco', 'Laríngeo', 'Frontal', 'Coronário'] },
    ],
    showAnimation: true,
    enableSound: false,
    saveToRegistros: true 
  },
  ego_layers: { 
    layers: [
      { id: 'fisico', name: 'Corpo Físico', color: 'hsl(0, 70%, 50%)', questions: ['Como está meu corpo hoje?'] },
      { id: 'eterico', name: 'Corpo Etérico', color: 'hsl(30, 70%, 50%)', questions: ['Qual minha energia vital?'] },
      { id: 'astral', name: 'Corpo Astral', color: 'hsl(60, 70%, 50%)', questions: ['Como estão minhas emoções?'] },
      { id: 'mental', name: 'Eu Mental', color: 'hsl(120, 70%, 50%)', questions: ['Como está minha mente?'] },
    ],
    showProgress: true,
    saveToRegistros: true 
  },
  archetype_card: { title: '', subtitle: '', description: '', keywords: [], shadowAspect: '', lightAspect: '', practice: '' },
  reflection_prompt: { prompt: '', placeholder: 'Escreva sua reflexão...', minLength: 50, showAIResponse: false, saveToRegistros: true },
};

// ============================================
// BLOCK TYPE METADATA FOR ADMIN UI
// ============================================

export const BLOCK_TYPE_META: Record<ContentBlockType, { label: string; icon: string; description: string; category: 'content' | 'media' | 'action' | 'interactive' | 'ai' }> = {
  rich_text: { 
    label: 'Texto Rico', 
    icon: 'FileText', 
    description: 'Texto formatado com HTML',
    category: 'content'
  },
  image: { 
    label: 'Imagem', 
    icon: 'Image', 
    description: 'Imagem com legenda opcional',
    category: 'media'
  },
  video: { 
    label: 'Vídeo', 
    icon: 'Video', 
    description: 'Vídeo do YouTube, Vimeo ou upload',
    category: 'media'
  },
  audio: { 
    label: 'Áudio', 
    icon: 'Music', 
    description: 'Player de áudio nativo',
    category: 'media'
  },
  ai_chat: { 
    label: 'Chat IA', 
    icon: 'Bot', 
    description: 'Interação com agente de IA',
    category: 'ai'
  },
  cta_button: { 
    label: 'Botão CTA', 
    icon: 'MousePointerClick', 
    description: 'Botão de ação configurável',
    category: 'action'
  },
  // New interactive blocks
  chakra_wheel: {
    label: 'Roda de Chakras',
    icon: 'Circle',
    description: 'Visualização e seleção dos 7 chakras',
    category: 'interactive'
  },
  energy_slider: {
    label: 'Slider de Energia',
    icon: 'Gauge',
    description: 'Escala de Hawkins com feedback',
    category: 'interactive'
  },
  pattern_diary: {
    label: 'Diário de Padrões',
    icon: 'BookOpen',
    description: 'Registro de gatilhos, emoções e respostas',
    category: 'interactive'
  },
  lunar_calendar: {
    label: 'Calendário Lunar',
    icon: 'Moon',
    description: 'Calendário cíclico com inputs diários',
    category: 'interactive'
  },
  pendulum_map: {
    label: 'Mapa de Pêndulo',
    icon: 'Target',
    description: 'Pêndulo interativo com mapas',
    category: 'interactive'
  },
  ego_layers: {
    label: 'Camadas do Ego',
    icon: 'Layers',
    description: 'Visualização em camadas antroposóficas',
    category: 'interactive'
  },
  archetype_card: {
    label: 'Card de Arquétipo',
    icon: 'Sparkles',
    description: 'Card visual para resultados narrativos',
    category: 'content'
  },
  reflection_prompt: {
    label: 'Prompt de Reflexão',
    icon: 'MessageSquare',
    description: 'Prompt com resposta opcional de IA',
    category: 'ai'
  },
};

// ============================================
// FERRAMENTA TYPES
// ============================================

export type FerramentaTipo = 'custom' | 'quiz' | 'ai_chat' | 'mandala' | 'diary' | 'content';

export interface Ferramenta {
  id: string;
  salaId: string;
  nome: string;
  descricao?: string;
  icone?: string;
  rota?: string;
  ordem: number;
  ativa: boolean;
  tipo: FerramentaTipo;
  portalMinimo: PortalType;
  hasBlocks: boolean;
  slug?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FerramentaRow {
  id: string;
  sala_id: string;
  nome: string;
  descricao?: string;
  icone?: string;
  rota?: string;
  ordem: number;
  ativa: boolean;
  tipo: FerramentaTipo;
  portal_minimo: PortalType;
  has_blocks: boolean;
  slug?: string;
  created_at: string;
  updated_at: string;
}

export function transformFerramentaRow(row: FerramentaRow): Ferramenta {
  return {
    id: row.id,
    salaId: row.sala_id,
    nome: row.nome,
    descricao: row.descricao,
    icone: row.icone,
    rota: row.rota,
    ordem: row.ordem,
    ativa: row.ativa,
    tipo: row.tipo || 'custom',
    portalMinimo: row.portal_minimo || 'pre_iniciada',
    hasBlocks: row.has_blocks || false,
    slug: row.slug,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ============================================
// FERRAMENTA REGISTROS (USER DATA)
// ============================================

export interface FerramentaRegistro {
  id: string;
  userId: string;
  ferramentaId: string;
  clienteId?: string;
  dataRegistro: string;
  dados: Record<string, unknown>;
  notas?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FerramentaRegistroRow {
  id: string;
  user_id: string;
  ferramenta_id: string;
  cliente_id?: string;
  data_registro: string;
  dados: Record<string, unknown>;
  notas?: string;
  created_at: string;
  updated_at: string;
}

export function transformFerramentaRegistroRow(row: FerramentaRegistroRow): FerramentaRegistro {
  return {
    id: row.id,
    userId: row.user_id,
    ferramentaId: row.ferramenta_id,
    clienteId: row.cliente_id,
    dataRegistro: row.data_registro,
    dados: row.dados,
    notas: row.notas,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
