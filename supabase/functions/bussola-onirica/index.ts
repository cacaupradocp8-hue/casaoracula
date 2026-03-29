import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { descricao_sonho, simbolos_chave } = await req.json();
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY not configured");

    const systemPrompt = `Você é a Bússola Onírica da Casa Orácula — uma inteligência simbólica especializada em leitura onírica com base na tradição cabalística e na psicologia arquetípica junguiana.

Sua tarefa é oferecer uma LEITURA SIMBÓLICA do sonho descrito, NÃO um diagnóstico.

Regras:
- Use linguagem simbólica, poética e profissional
- Nunca diagnostique ou interprete de forma literal
- Use sempre linguagem de hipótese ("pode sugerir", "parece apontar")
- Conecte os símbolos aos 12 distritos da CidaDELA Interior
- Sugira práticas somáticas ou reflexivas (não terapêuticas)

Os 12 distritos da CidaDELA são: Portão da Chegada, Torres, Portas, Jardim dos Arquétipos, Praça do Abalo, Casa dos Sonhos, Espelho dos Vínculos, Forja, Conselho Interior, Labirinto, Praça da Integração, Portal de Renascimento.

Labirintos possíveis: Autossabotagem, Abandono, Controle, Perfeccionismo, Codependência, Invisibilidade, Raiva Contida, Desconexão Corporal.

Responda SEMPRE em JSON com exatamente estes campos:
{
  "interpretacao": "texto da interpretação cabalística simbólica (3-5 parágrafos)",
  "distritos_sugeridos": ["distrito1", "distrito2"],
  "labirintos_sugeridos": ["labirinto1"],
  "praticas_sugeridas": ["prática1", "prática2", "prática3"]
}`;

    const userPrompt = `Sonho descrito pela cliente:
"${descricao_sonho}"

Símbolos-chave identificados: ${simbolos_chave.join(", ")}

Ofereça a leitura simbólica cabalística deste sonho.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-5",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "dream_analysis",
              description: "Return kabbalistic dream analysis",
              parameters: {
                type: "object",
                properties: {
                  interpretacao: { type: "string" },
                  distritos_sugeridos: { type: "array", items: { type: "string" } },
                  labirintos_sugeridos: { type: "array", items: { type: "string" } },
                  praticas_sugeridas: { type: "array", items: { type: "string" } },
                },
                required: ["interpretacao", "distritos_sugeridos", "labirintos_sugeridos", "praticas_sugeridas"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "dream_analysis" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns instantes." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes. Entre em contato com o suporte." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro na análise onírica" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    let result;
    if (toolCall?.function?.arguments) {
      result = JSON.parse(toolCall.function.arguments);
    } else {
      // Fallback: try parsing content directly
      const content = data.choices?.[0]?.message?.content || "";
      try {
        result = JSON.parse(content);
      } catch {
        result = {
          interpretacao: content,
          distritos_sugeridos: [],
          labirintos_sugeridos: [],
          praticas_sugeridas: [],
        };
      }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("bussola-onirica error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
