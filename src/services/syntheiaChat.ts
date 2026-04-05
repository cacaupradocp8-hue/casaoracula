// ============================================
// SYNTHEIA CHAT SERVICE
// Frontend service to call syntheia-chat Edge Function
// ============================================

import { supabase } from "@/integrations/supabase/client";

export type SyntheiaChatMode = "arcano" | "arcane" | "ferramenteira" | "converse_com_livro";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface RoutingContext {
  tipoUsuario?: string;
  area?: string;
  subArea?: string;
  module?: string;
  pageName?: string;
  intencao?: string;
}

export interface RoutingInfo {
  responseMode: 'direto' | 'skill_unica' | 'pipeline';
  skillsActivated: string[];
}

export interface SyntheiaChatResponse {
  mode: SyntheiaChatMode;
  message: {
    role: "assistant";
    content: string;
  };
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  routing?: RoutingInfo;
}

export interface SyntheiaChatError {
  error: string;
}

/**
 * Send a message to Syntheia using OpenAI via Edge Function
 */
export async function sendMessageToSyntheia(
  mode: SyntheiaChatMode,
  messages: ChatMessage[],
  extraContext?: Record<string, unknown>,
  voicePrompt?: string,
  routingContext?: RoutingContext
): Promise<SyntheiaChatResponse> {
  const { data, error } = await supabase.functions.invoke<SyntheiaChatResponse | SyntheiaChatError>(
    "syntheia-chat",
    {
      body: {
        mode,
        messages,
        extra_context: extraContext,
        voice_prompt: voicePrompt,
        routing_context: routingContext,
      },
    }
  );

  if (error) {
    console.error("[syntheiaChat] Invocation error:", error);
    throw new Error(error.message || "Erro ao conectar com Syntheia");
  }

  if (!data) {
    throw new Error("Resposta vazia do servidor");
  }

  if ("error" in data) {
    throw new Error(data.error);
  }

  return data;
}

/**
 * Helper to format messages for the API
 */
export function formatMessagesForAPI(
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }>
): ChatMessage[] {
  return conversationHistory.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));
}

/**
 * Mode labels for UI display
 */
export const SYNTHEIA_MODE_LABELS: Record<SyntheiaChatMode, string> = {
  arcano: "Arcano — Linguagem Simbólica",
  arcane: "Arcane — Linguagem Simbólica",
  ferramenteira: "Ferramenteira — Prática Aplicável",
  converse_com_livro: "Converse com o Livro",
};

/**
 * Mode descriptions for UI
 */
export const SYNTHEIA_MODE_DESCRIPTIONS: Record<SyntheiaChatMode, string> = {
  arcano: "Metáforas, arquétipos, contos simbólicos e exercícios de imaginação",
  arcane: "Metáforas, arquétipos, contos simbólicos e exercícios de imaginação",
  ferramenteira: "Rituais, práticas, roteiros de condução e perguntas terapêuticas",
  converse_com_livro: "Conversa guiada sobre a obra do Clube do Livro Oracular",
};
