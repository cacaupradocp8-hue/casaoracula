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
  | 'cta_button';

// Context type enum - where blocks can be used
export type BlockContextType = 
  | 'quiz_result'
  | 'portal'
  | 'ritual'
  | 'formation'
  | 'tool'
  | 'sala'
  | 'landing';

// Content schemas for each block type
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
  agenteId?: string; // Optional - falls back to default agent
  placeholder?: string;
  welcomeMessage?: string;
  contextPrompt?: string; // Page-specific context injected into the conversation
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

// Union type for all content types
export type BlockContent = 
  | RichTextContent
  | ImageContent
  | VideoContent
  | AudioContent
  | AIChatContent
  | CTAButtonContent;

// Main Content Block interface
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

// Default content for each block type
export const DEFAULT_BLOCK_CONTENT: Record<ContentBlockType, BlockContent> = {
  rich_text: { html: '', plainText: '' },
  image: { url: '', alt: '', size: 'medium' },
  video: { url: '', provider: 'youtube' },
  audio: { url: '', title: '' },
  ai_chat: { placeholder: 'Digite sua pergunta...', showHistory: true },
  cta_button: { text: 'Saiba mais', action: 'navigate', variant: 'gold', size: 'lg' },
};

// Block type metadata for admin UI
export const BLOCK_TYPE_META: Record<ContentBlockType, { label: string; icon: string; description: string }> = {
  rich_text: { 
    label: 'Texto Rico', 
    icon: 'FileText', 
    description: 'Texto formatado com HTML' 
  },
  image: { 
    label: 'Imagem', 
    icon: 'Image', 
    description: 'Imagem com legenda opcional' 
  },
  video: { 
    label: 'Vídeo', 
    icon: 'Video', 
    description: 'Vídeo do YouTube, Vimeo ou upload' 
  },
  audio: { 
    label: 'Áudio', 
    icon: 'Music', 
    description: 'Player de áudio nativo' 
  },
  ai_chat: { 
    label: 'Chat IA', 
    icon: 'Bot', 
    description: 'Interação com agente de IA' 
  },
  cta_button: { 
    label: 'Botão CTA', 
    icon: 'MousePointerClick', 
    description: 'Botão de ação configurável' 
  },
};
