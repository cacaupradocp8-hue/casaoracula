// ============================================
// AI AGENT SYSTEM - TYPES
// ============================================

import { PortalType } from './portal';
import { BlockContextType } from './modular';

// Agent status enum matching database
export type AgenteStatus = 'ativo' | 'inativo';

// Main Agent interface
export interface Agent {
  id: string;
  nome: string;
  descricao: string;
  instrucoesBase: string;
  promptPersonalidade?: string;
  icone?: string;
  status: AgenteStatus;
  portalMinimo: PortalType;
  contextosPermitidos?: BlockContextType[];
  modeloPreferido?: string;
  temperatura?: number;
  maxTokens?: number;
  createdAt: string;
  updatedAt: string;
}

// Raw database row (snake_case)
export interface AgentRow {
  id: string;
  nome: string;
  descricao: string;
  instrucoes_base: string;
  prompt_personalidade?: string;
  icone?: string;
  status: AgenteStatus;
  portal_minimo: PortalType;
  contextos_permitidos?: BlockContextType[];
  modelo_preferido?: string;
  temperatura?: number;
  max_tokens?: number;
  created_at: string;
  updated_at: string;
}

// Transform function
export function transformAgentRow(row: AgentRow): Agent {
  return {
    id: row.id,
    nome: row.nome,
    descricao: row.descricao,
    instrucoesBase: row.instrucoes_base,
    promptPersonalidade: row.prompt_personalidade,
    icone: row.icone,
    status: row.status,
    portalMinimo: row.portal_minimo,
    contextosPermitidos: row.contextos_permitidos,
    modeloPreferido: row.modelo_preferido,
    temperatura: row.temperatura,
    maxTokens: row.max_tokens,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// AI Global Settings
export interface AIGlobalSetting {
  id: string;
  chave: string;
  valor: string;
  descricao?: string;
  ativo: boolean;
}

// AI Interaction context for edge functions
export interface AIInteractionContext {
  userId: string;
  agentId?: string;
  contextType?: BlockContextType;
  contextId?: string;
  contextData?: Record<string, unknown>; // Dynamic context (quiz result, tool data, etc.)
}

// AI Request payload
export interface AIRequestPayload {
  messages: AIMessage[];
  context: AIInteractionContext;
  stream?: boolean;
}

// AI Message format
export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// AI Response
export interface AIResponse {
  content: string;
  tokensUsed?: number;
  modelo?: string;
  latencyMs?: number;
}

// Agent with resolved global prompt (from database function)
export interface AgentWithContext {
  agentId: string;
  agentNome: string;
  agentDescricao: string;
  instrucoesBase: string;
  promptPersonalidade: string;
  globalSystemPrompt: string;
  modeloPreferido: string;
  temperatura: number;
  maxTokens: number;
}

// Default agent configuration
export const DEFAULT_AGENT_CONFIG = {
  modelo: 'google/gemini-2.5-flash',
  temperatura: 0.7,
  maxTokens: 1024,
};

// Available AI models for admin selection
export const AVAILABLE_AI_MODELS = [
  { value: 'google/gemini-2.5-flash', label: 'Gemini 2.5 Flash (Rápido)' },
  { value: 'google/gemini-2.5-pro', label: 'Gemini 2.5 Pro (Poderoso)' },
  { value: 'google/gemini-3-flash-preview', label: 'Gemini 3 Flash Preview' },
  { value: 'openai/gpt-5-mini', label: 'GPT-5 Mini' },
  { value: 'openai/gpt-5-nano', label: 'GPT-5 Nano (Econômico)' },
];
