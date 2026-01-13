// ============================================
// AI SERVICE - AGENT AGNOSTIC ARCHITECTURE
// ============================================
// This service provides a unified interface for AI interactions.
// It handles global system prompts, agent resolution, and context injection.

import { supabase } from '@/integrations/supabase/client';
import { Agent, AgentRow, transformAgentRow, AIGlobalSetting, AIInteractionContext, AIMessage, DEFAULT_AGENT_CONFIG } from '@/types/agent';
import { BlockContextType } from '@/types/modular';

// Cache for global settings
let globalSettingsCache: Record<string, string> | null = null;
let settingsCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch AI global settings with caching
 */
export async function getAIGlobalSettings(): Promise<Record<string, string>> {
  const now = Date.now();
  
  if (globalSettingsCache && (now - settingsCacheTime) < CACHE_TTL) {
    return globalSettingsCache;
  }

  const { data, error } = await supabase
    .from('ai_global_settings')
    .select('*')
    .eq('ativo', true);

  if (error) {
    console.error('Error fetching AI global settings:', error);
    return {};
  }

  const settings: Record<string, string> = {};
  (data as AIGlobalSetting[]).forEach(s => {
    settings[s.chave] = s.valor;
  });

  globalSettingsCache = settings;
  settingsCacheTime = now;
  
  return settings;
}

/**
 * Get the global system prompt
 */
export async function getGlobalSystemPrompt(): Promise<string> {
  const settings = await getAIGlobalSettings();
  return settings['global_system_prompt'] || '';
}

/**
 * Check if AI is globally enabled
 */
export async function isAIEnabled(): Promise<boolean> {
  const settings = await getAIGlobalSettings();
  return settings['ai_enabled'] !== 'false';
}

/**
 * Get the default agent ID
 */
export async function getDefaultAgentId(): Promise<string | null> {
  const settings = await getAIGlobalSettings();
  const id = settings['default_agent_id'];
  return id && id.trim() ? id : null;
}

/**
 * Fetch an agent by ID
 */
export async function getAgent(agentId: string): Promise<Agent | null> {
  const { data, error } = await supabase
    .from('agentes')
    .select('*')
    .eq('id', agentId)
    .eq('status', 'ativo')
    .single();

  if (error || !data) {
    console.error('Error fetching agent:', error);
    return null;
  }

  return transformAgentRow(data as AgentRow);
}

/**
 * Get the appropriate agent for a context
 * Falls back to default agent if no specific agent is provided
 */
export async function resolveAgent(
  agentId?: string,
  contextType?: BlockContextType
): Promise<Agent | null> {
  // If specific agent provided, try to use it
  if (agentId) {
    const agent = await getAgent(agentId);
    if (agent) return agent;
  }

  // Fall back to default agent
  const defaultId = await getDefaultAgentId();
  if (defaultId) {
    return getAgent(defaultId);
  }

  return null;
}

/**
 * Build the complete system prompt for an AI interaction
 * Combines: Global prompt + Agent personality + Context prompt
 */
export async function buildSystemPrompt(
  agent: Agent | null,
  contextPrompt?: string
): Promise<string> {
  const globalPrompt = await getGlobalSystemPrompt();
  
  const parts: string[] = [];
  
  // 1. Global system prompt (security, ethics, tone)
  if (globalPrompt) {
    parts.push(globalPrompt);
  }
  
  // 2. Agent personality and instructions
  if (agent) {
    if (agent.promptPersonalidade) {
      parts.push(`\n\n## Personalidade\n${agent.promptPersonalidade}`);
    }
    if (agent.instrucoesBase) {
      parts.push(`\n\n## Instruções\n${agent.instrucoesBase}`);
    }
  }
  
  // 3. Page/context specific prompt
  if (contextPrompt) {
    parts.push(`\n\n## Contexto Atual\n${contextPrompt}`);
  }
  
  return parts.join('');
}

/**
 * Get AI model configuration for an agent
 */
export function getModelConfig(agent: Agent | null) {
  return {
    model: agent?.modeloPreferido || DEFAULT_AGENT_CONFIG.modelo,
    temperature: agent?.temperatura ?? DEFAULT_AGENT_CONFIG.temperatura,
    maxTokens: agent?.maxTokens ?? DEFAULT_AGENT_CONFIG.maxTokens,
  };
}

/**
 * Log an AI interaction for analytics
 */
export async function logAIInteraction(
  userId: string,
  inputText: string,
  outputText: string | null,
  context: AIInteractionContext,
  metadata: {
    modelo?: string;
    tokensUsed?: number;
    latencyMs?: number;
    success?: boolean;
    errorMessage?: string;
  }
) {
  try {
    await supabase.from('ai_interaction_logs').insert({
      user_id: userId,
      agente_id: context.agentId,
      context_type: context.contextType,
      context_id: context.contextId,
      input_text: inputText,
      output_text: outputText,
      modelo_usado: metadata.modelo,
      tokens_used: metadata.tokensUsed,
      latency_ms: metadata.latencyMs,
      success: metadata.success ?? true,
      error_message: metadata.errorMessage,
    });
  } catch (error) {
    console.error('Error logging AI interaction:', error);
  }
}

/**
 * Clear the settings cache (useful after admin updates)
 */
export function clearSettingsCache() {
  globalSettingsCache = null;
  settingsCacheTime = 0;
}
