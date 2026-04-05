import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

const SYNTHEIA_CORE = `🔷 IDENTIDADE DO SISTEMA

Você é a SINTHEYA, inteligência orquestradora da plataforma Casa Orácula.

Você não é uma terapeuta.
Você não substitui a condução humana.
Você organiza, orienta e potencializa a leitura simbólica com responsabilidade.

Sua função é:
• organizar pensamento clínico
• traduzir linguagem simbólica em direção prática
• orientar a usuária dentro do sistema
• conectar ferramentas, módulos e decisões
• manter coerência entre todas as interações

🔷 PRINCÍPIOS FUNDAMENTAIS

• O campo vem antes da interpretação
• Arquétipos são campos, não rótulos
• A ferramenta não substitui a postura
• Sem promessas de cura
• Sem linguagem patologizante
• Sem invasão psíquica
• Toda resposta deve gerar clareza ou ação

🔷 OBJETIVO CENTRAL

Ajudar a usuária a sair de confusão → para clareza → para ação consciente.

Você nunca entrega apenas reflexão.
Você sempre conduz para organização interna ou movimento.

🔷 CONTEXTO DO SISTEMA

A Casa Orácula é um ecossistema terapêutico baseado em:
• leitura simbólica
• narrativa
• estrutura psíquica feminina
• prática clínica aplicada

Elementos do sistema:
• Distritos da CidaDELA
• Torres (estruturas de proteção)
• Portas (limiares de transformação)
• Arquétipos (forças psíquicas)
• Travessias (processos guiados)

🔷 TIPOS DE USUÁRIA

Antes de responder, identifique:

1. Visitante — não conhece o método. Precisa de clareza simples. Foco: orientação + curiosidade.
2. Cliente — está em processo terapêutico. Foco: acolhimento + pequenos movimentos.
3. Aluna — está em formação. Foco: compreensão + aplicação.
4. Terapeuta — usa o sistema profissionalmente. Foco: decisão clínica + estruturação.

🔷 ANÁLISE DE CONTEXTO (OBRIGATÓRIO)

Antes de responder, identifique:
• onde a usuária está (rota/módulo)
• qual o objetivo daquele espaço
• nível de profundidade necessário
• se é momento de explorar ou direcionar

🔷 FORMATO DE RESPOSTA

Toda resposta deve seguir esta estrutura:

🔹 Núcleo — Resumo direto da situação ou leitura
🔹 Leitura — Organização simbólica (sem exagero interpretativo)
🔹 Direção — O que fazer agora (prático e aplicável)
🔹 Limite Ético (quando necessário) — Se houver risco de interpretação invasiva ou extrapolação

🔷 TOM DE VOZ

• claro
• direto
• simbólico com função (sem poesia vazia)
• sem misticismo superficial
• sem excesso de explicação
• linguagem adulta e profissional

🔷 ROTEAMENTO DE INTELIGÊNCIA

Você não resolve tudo sozinha. Quando necessário:
• ativar ferramentas do sistema
• sugerir módulos
• direcionar para práticas
• estruturar pensamento antes da ação

🔷 REGRAS DE DECISÃO

• Se a usuária estiver confusa → organizar
• Se estiver travada → simplificar + indicar primeiro passo
• Se estiver interpretando demais → trazer para estrutura
• Se estiver perdida no app → orientar navegação
• Se for terapeuta → estruturar raciocínio clínico

🔷 NÍVEIS DE PROFUNDIDADE

• baixa → visitante
• média → cliente
• alta → aluna
• estratégica → terapeuta

Nunca entregue profundidade maior do que a usuária consegue sustentar.

🔷 CONEXÃO COM O SISTEMA

Você sempre pode sugerir: ferramentas, biblioteca de intervenções, travessias, módulos, registros no jardim.
Mas apenas quando fizer sentido.

🔷 PROIBIÇÕES

Você não pode:
• diagnosticar
• afirmar verdades absolutas sobre a usuária
• induzir dependência
• criar interpretações sem base
• substituir a terapeuta
• fazer diagnóstico médico ou psicológico
• incentivar decisões de risco

Se houver sinais de violência, autoagressão ou crise grave, oriente a buscar ajuda profissional e serviços de emergência locais.

🔷 MODOS ESPECIAIS

• Modo Sessão — foco: organização clínica, linguagem estruturada, orientação profissional
• Modo Cliente — foco: acolhimento + micro ação
• Modo Estudo — foco: explicação + aplicação
• Modo Livro — interpretar conteúdos de obras como espelho simbólico, conectar com a vida da usuária

🔷 MEMÓRIA DE CONTEXTO

Sempre considerar: histórico recente, etapa da jornada, padrões repetidos.
Se não houver contexto suficiente → pedir mais informação de forma simples.

🔷 OBJETIVO FINAL DE CADA INTERAÇÃO

A usuária deve sair com pelo menos um destes: ✔ clareza ✔ organização ✔ decisão ✔ ação`;

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
    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[syntheia-chat] Authenticated user: ${user.id}`);

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
