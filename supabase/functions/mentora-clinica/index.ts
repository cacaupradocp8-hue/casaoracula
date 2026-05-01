import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Você é a Mentora Oracular Clínica da Casa Orácula — uma supervisora simbólica experiente que ajuda terapeutas, psicólogas e facilitadoras a refinarem sua escuta clínica em casos REAIS.

CONTEXTO:
A terapeuta está trazendo um caso real (de cliente próprio) para supervisão simbólica. Não é treino com caso fictício — é supervisão profissional.

SUA FUNÇÃO:
1. ANÁLISE SIMBÓLICA: leia o campo simbólico do caso. Identifique o distrito da Cidadela ativo, padrões arquetípicos, eixo de tensão. Use linguagem da Cartografia Psíquica (NÃO use Big5 nem Eneagrama — são proibidos).

2. PERGUNTAS SUGERIDAS: ofereça 3 perguntas-chave que a terapeuta pode levar à próxima sessão. Perguntas que abrem campo, não que fecham diagnóstico.

3. RISCOS ÉTICOS: aponte armadilhas de contratransferência, riscos de interpretação literal, possíveis erros comuns naquela configuração de campo.

4. SIMULAÇÃO DO CLIENTE: descreva como o cliente provavelmente reagiria a uma intervenção mal calibrada vs uma bem calibrada. Use linguagem narrativa, não diagnóstica.

5. FERRAMENTA SUGERIDA: indique uma ferramenta da Casa Orácula apropriada (Cartografia Psíquica, Torre Viva, Labirinto da Heroína, Espelho Relacional, Ritual Simbólico, etc).

REGRAS ABSOLUTAS:
- NUNCA dê diagnóstico clínico
- NUNCA use Big5, MBTI, Eneagrama
- NUNCA prometa resultado
- NÃO conclua a experiência — mantenha o campo aberto
- Linguagem simbólica, ética, humana — sem misticismo performático
- Seja precisa, breve e profunda

FORMATO: retorne APENAS via tool calling estruturado.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { caso } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const userPrompt = `CASO TRAZIDO PELA TERAPEUTA:

Título: ${caso.titulo || "(sem título)"}
${caso.caso_texto ? `\nContexto: ${caso.caso_texto}` : ""}
${caso.fala_cliente ? `\nFala do cliente: "${caso.fala_cliente}"` : ""}
${caso.duvida_terapeuta ? `\nDúvida da terapeuta: ${caso.duvida_terapeuta}` : ""}
${caso.ja_tentou ? `\nO que ela já tentou: ${caso.ja_tentou}` : ""}

Forneça a supervisão simbólica completa.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "supervisao_simbolica",
              description: "Retorna análise clínica simbólica do caso real",
              parameters: {
                type: "object",
                properties: {
                  analise_simbolica: {
                    type: "string",
                    description: "Leitura do campo simbólico, distrito ativo, padrão arquetípico (3-5 frases)",
                  },
                  perguntas_sugeridas: {
                    type: "array",
                    items: { type: "string" },
                    description: "3 perguntas-chave para a próxima sessão",
                  },
                  riscos_eticos: {
                    type: "string",
                    description: "Armadilhas de contratransferência e erros comuns (2-4 frases)",
                  },
                  simulacao_cliente: {
                    type: "string",
                    description: "Como o cliente reagiria a intervenções mal vs bem calibradas (narrativa breve)",
                  },
                  ferramenta_sugerida: {
                    type: "string",
                    description: "Nome da ferramenta da Casa Orácula apropriada",
                  },
                },
                required: [
                  "analise_simbolica",
                  "perguntas_sugeridas",
                  "riscos_eticos",
                  "simulacao_cliente",
                  "ferramenta_sugerida",
                ],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "supervisao_simbolica" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit excedido. Aguarde alguns segundos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos esgotados. Adicione fundos em Settings > Workspace > Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data?.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      throw new Error("Resposta da IA sem tool call");
    }

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e) {
    console.error("mentora-clinica error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
