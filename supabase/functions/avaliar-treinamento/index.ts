import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { caso, resposta } = await req.json();
    if (!caso || !resposta) {
      return new Response(JSON.stringify({ error: "Missing caso or resposta" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch the evaluator agent prompt
    const { data: agente } = await supabase
      .from("agentes")
      .select("instrucoes_base")
      .eq("nome", "Avaliador da Sala de Treinamento")
      .eq("status", "ativo")
      .single();

    const systemPrompt = agente?.instrucoes_base || "Avalie a coerência da leitura clínica.";

    // Build the user message with case + response data
    const userMessage = `CASO:
Título: ${caso.title}
Texto: ${caso.caso_texto}
Sinais: ${(caso.signals || []).map((s: any) => s.sinal).join(", ")}
Distrito correto: ${caso.distrito_esperado}
Distritos alternativos: ${(caso.distritos_alternativos || []).join(", ")}
Hipótese base: ${caso.hipotese_esperada}
Vetor de crescimento: ${caso.vetor_esperado}
Ferramenta principal: ${caso.ferramenta_principal}
Ferramentas de apoio: ${(caso.ferramentas_apoio || []).join(", ")}
Erro comum: ${caso.erro_comum}

RESPOSTA DA TERAPEUTA EM TREINAMENTO:
Distrito escolhido: ${resposta.distrito_escolhido}
Hipótese: ${resposta.hipotese_texto}
Ferramenta escolhida: ${resposta.ferramenta_escolhida}
Leitura: ${resposta.leitura_texto}
Estado percebido: ${resposta.estado_escolhido}
Vetor identificado: ${resposta.vetor_texto}`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "avaliar_treinamento",
              description: "Retorna a avaliação estruturada da leitura clínica da terapeuta",
              parameters: {
                type: "object",
                properties: {
                  score_total: { type: "number", description: "Pontuação total 0-9" },
                  score_distrito: { type: "number", description: "Pontuação distrito 0-3" },
                  score_hipotese: { type: "number", description: "Pontuação hipótese 0-3" },
                  score_ferramenta: { type: "number", description: "Pontuação ferramenta 0-3" },
                  nivel_coerencia: {
                    type: "string",
                    enum: ["leitura muito coerente", "leitura boa, mas refinável", "leitura parcial", "leitura incoerente"],
                  },
                  feedback: {
                    type: "object",
                    properties: {
                      leitura_do_padrao: { type: "string" },
                      analise_do_distrito: { type: "string" },
                      analise_da_ferramenta: { type: "string" },
                      erro_comum: { type: "string" },
                      direcao_sugerida: { type: "string" },
                    },
                    required: ["leitura_do_padrao", "analise_do_distrito", "analise_da_ferramenta", "erro_comum", "direcao_sugerida"],
                    additionalProperties: false,
                  },
                  perfil_simbolico_emergente: {
                    type: "object",
                    properties: {
                      padrao_dominante: { type: "string" },
                      estado_atual: { type: "string" },
                      vetor_crescimento: { type: "string" },
                    },
                    required: ["padrao_dominante", "estado_atual", "vetor_crescimento"],
                    additionalProperties: false,
                  },
                },
                required: ["score_total", "score_distrito", "score_hipotese", "score_ferramenta", "nivel_coerencia", "feedback", "perfil_simbolico_emergente"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "avaliar_treinamento" } },
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Muitas requisições. Tente novamente em alguns instantes." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA esgotados." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await aiResponse.text();
      console.error("AI error:", status, errorText);
      return new Response(JSON.stringify({ error: "Erro na avaliação IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      console.error("No tool call in response:", JSON.stringify(aiData));
      return new Response(JSON.stringify({ error: "Resposta IA sem estrutura esperada" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const avaliacao = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(avaliacao), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("avaliar-treinamento error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
