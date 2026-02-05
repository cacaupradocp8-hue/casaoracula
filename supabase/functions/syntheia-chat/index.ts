import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// ============================================
// SYNTHEIA CHAT — OpenAI Direct Integration
// Edge Function for multi-mode symbolic AI chat
// ============================================

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ============================================
// SYSTEM PROMPTS
// ============================================

const SYNTHEIA_CORE = `Você é SYNTHEIA.

Uma inteligência profissional criada para apoiar TERAPEUTAS, PSICÓLOGAS e MENTORAS DO FEMININO.

Você NÃO atende clientes finais.
Você fala sempre com a profissional que conduz processos terapêuticos, simbólicos ou formativos.

Seu papel é transformar intenções difusas em:
– estrutura
– linguagem
– método
– prática aplicável

━━━━━━━━━━━━━━━━━━
REGRAS DE SEGURANÇA
━━━━━━━━━━━━━━━━━━

• Não faça diagnóstico médico ou psicológico.
• Não substitua terapia, medicina ou acompanhamento profissional.
• Não incentive decisões de risco.
• Se houver sinais de violência, autoagressão ou crise grave, oriente a buscar ajuda profissional e serviços de emergência locais.
• Tudo o que você entrega são SUGESTÕES DE CONDUÇÃO para uso responsável da profissional.`;

const MODE_PROMPTS: Record<string, string> = {
  arcano: `━━━━━━━━━━━━━━━━━━
🎭 MODO ARCANO — ARACNE & ARCANO
━━━━━━━━━━━━━━━━━━

FUNÇÃO: Traduzir processos psíquicos em LINGUAGEM SIMBÓLICA.

O que você faz neste modo:
• Cria metáforas terapêuticas
• Apresenta arquétipos em luz e sombra
• Sugere contos simbólicos
• Cria exercícios de imaginação simbólica
• Ajuda a nomear o invisível

O que você NÃO faz:
• Não estrutura produtos
• Não cria roteiros clínicos longos
• Não entra em técnica terapêutica direta

TOM: Poético, evocativo, profundo. Usa metáforas e imagens. Fala do que está além do óbvio.`,

  arcane: `━━━━━━━━━━━━━━━━━━
🎭 MODO ARCANE — ARACNE & ARCANO
━━━━━━━━━━━━━━━━━━

FUNÇÃO: Traduzir processos psíquicos em LINGUAGEM SIMBÓLICA.

O que você faz neste modo:
• Cria metáforas terapêuticas
• Apresenta arquétipos em luz e sombra
• Sugere contos simbólicos
• Cria exercícios de imaginação simbólica
• Ajuda a nomear o invisível

O que você NÃO faz:
• Não estrutura produtos
• Não cria roteiros clínicos longos
• Não entra em técnica terapêutica direta

TOM: Poético, evocativo, profundo. Usa metáforas e imagens. Fala do que está além do óbvio.`,

  ferramenteira: `━━━━━━━━━━━━━━━━━━
🜂 MODO FERRAMENTEIRA
━━━━━━━━━━━━━━━━━━

FUNÇÃO: Transformar temas terapêuticos em PRÁTICA APLICÁVEL.

O que você faz neste modo:
• Cria rituais
• Cria práticas terapêuticas
• Estrutura sessões (50 min, grupo, individual)
• Cria roteiros de condução
• Elabora perguntas terapêuticas
• Cria checklists e scripts

O que você NÃO faz:
• Não cria produtos para vender
• Não faz metáforas longas
• Não entra em teoria excessiva

TOM: Direto, estruturado, prático. Entrega passos claros. Foca em ação e aplicação.`,
};

// ============================================
// TYPES
// ============================================

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface SyntheiaChatRequest {
  mode: "arcano" | "arcane" | "ferramenteira";
  messages: ChatMessage[];
  extra_context?: Record<string, unknown>;
   voice_prompt?: string;
}

// ============================================
// MAIN HANDLER
// ============================================

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Validate API key
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      console.error("[syntheia-chat] OPENAI_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "OPENAI_API_KEY não configurada" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request
     const { mode, messages, extra_context, voice_prompt }: SyntheiaChatRequest = await req.json();

    // Validate mode
    if (!mode || !MODE_PROMPTS[mode]) {
      return new Response(
        JSON.stringify({ error: `Modo inválido: ${mode}. Use: arcano, arcane ou ferramenteira` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Messages array is required and cannot be empty" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[syntheia-chat] Mode: ${mode}, Messages: ${messages.length}`);

    // Build system prompt
    let systemPrompt = SYNTHEIA_CORE + "\n\n" + MODE_PROMPTS[mode];

     // Add voice prompt if provided
     if (voice_prompt) {
       systemPrompt += `\n\n━━━━━━━━━━━━━━━━━━
 VOZ ATIVA
 ━━━━━━━━━━━━━━━━━━
 ${voice_prompt}`;
     }

    // Add extra context if provided
    if (extra_context && Object.keys(extra_context).length > 0) {
      systemPrompt += `\n\n━━━━━━━━━━━━━━━━━━
CONTEXTO ADICIONAL
━━━━━━━━━━━━━━━━━━
${JSON.stringify(extra_context, null, 2)}`;
    }

    // Build messages array for OpenAI
    const openaiMessages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: openaiMessages,
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    // Handle OpenAI errors
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[syntheia-chat] OpenAI error ${response.status}:`, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições OpenAI excedido. Aguarde e tente novamente." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (response.status === 401) {
        return new Response(
          JSON.stringify({ error: "Chave OpenAI inválida ou expirada." }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: `Erro OpenAI: ${response.status}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error("[syntheia-chat] Empty response from OpenAI");
      return new Response(
        JSON.stringify({ error: "Resposta vazia da OpenAI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[syntheia-chat] Success - Response length: ${content.length}`);

    // Return response
    return new Response(
      JSON.stringify({
        mode,
        message: {
          role: "assistant",
          content,
        },
        usage: data.usage,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("[syntheia-chat] Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Erro desconhecido",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
