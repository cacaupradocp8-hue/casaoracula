// ============================================
// SYNTHEIA CHAT SERVICE
// Frontend service to call syntheia-chat Edge Function
// ============================================

import { supabase } from "@/integrations/supabase/client";

export type SyntheiaChatMode = "arcano" | "arcane" | "ferramenteira";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
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
}

export interface SyntheiaChatError {
  error: string;
}

/**
 * Send a message to Syntheia using OpenAI via Edge Function
 * 
 * @param mode - The Syntheia mode: "arcano", "arcane", or "ferramenteira"
 * @param messages - Array of conversation messages
 * @param extraContext - Optional additional context object
 * @returns The assistant's response
 */
export async function sendMessageToSyntheia(
  mode: SyntheiaChatMode,
  messages: ChatMessage[],
  extraContext?: Record<string, unknown>
): Promise<SyntheiaChatResponse> {
  const { data, error } = await supabase.functions.invoke<SyntheiaChatResponse | SyntheiaChatError>(
    "syntheia-chat",
    {
      body: {
        mode,
        messages,
        extra_context: extraContext,
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

  // Check if response is an error
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
};

/**
 * Mode descriptions for UI
 */
export const SYNTHEIA_MODE_DESCRIPTIONS: Record<SyntheiaChatMode, string> = {
  arcano: "Metáforas, arquétipos, contos simbólicos e exercícios de imaginação",
  arcane: "Metáforas, arquétipos, contos simbólicos e exercícios de imaginação",
  ferramenteira: "Rituais, práticas, roteiros de condução e perguntas terapêuticas",
};
