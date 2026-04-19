// Edge function: lab-oracular-ia
// 3 modos: cartografia | espelho | forja
// Usa Lovable AI Gateway (LOVABLE_API_KEY)

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const MODEL = "google/gemini-2.5-flash";

interface ReqBody {
  modo: "cartografia" | "espelho" | "forja";
  obra: { titulo: string; autor?: string | null };
  contexto_autoral?: Record<string, unknown> | null; // do season_lab
  inputs: Record<string, unknown>; // respostas da usuária
}

const SYSTEMS: Record<string, string> = {
  cartografia: `Você é a Sintheya — agente oracular formativa da Casa Orácula. Linguagem simbólica, ética, sem misticismo performático. NÃO resuma o livro. NÃO crie identidade arquetípica. Devolva uma leitura simbólica estruturada da obra à luz das respostas da usuária.`,
  espelho: `Você é a Sintheya em modo Espelho Clínico. Traduza o simbólico em clínico real: padrões comportamentais observáveis, riscos éticos, tipo de cliente correspondente. Sem dramatização. Sem promessas. Sem diagnóstico.`,
  forja: `Você é a Sintheya em modo Forja Narrativa. Devolva um plano terapêutico estruturado e seguro: sequência de condução, linguagem sugerida, possíveis respostas da cliente, riscos e ajustes de rota.`,
};

const TOOLS: Record<string, unknown> = {
  cartografia: {
    type: "function",
    function: {
      name: "leitura_simbolica",
      description: "Leitura simbólica da obra a partir das respostas",
      parameters: {
        type: "object",
        properties: {
          padrao_psiquico: { type: "string" },
          hipotese_protecao: { type: "string", description: "Torre - o que protege" },
          hipotese_movimento: { type: "string", description: "Porta - o que pede travessia" },
          tensao_central: { type: "string" },
          imagem_organizadora: { type: "string" },
          proximo_passo: { type: "string" },
        },
        required: ["padrao_psiquico", "hipotese_protecao", "hipotese_movimento", "tensao_central"],
        additionalProperties: false,
      },
    },
  },
  espelho: {
    type: "function",
    function: {
      name: "espelho_clinico",
      description: "Tradução simbólico→clínico",
      parameters: {
        type: "object",
        properties: {
          padroes_comportamentais: { type: "array", items: { type: "string" } },
          tipo_cliente_correspondente: { type: "string" },
          alertas_eticos: { type: "array", items: { type: "string" } },
          o_que_nao_fazer: { type: "array", items: { type: "string" } },
          observacao_clinica: { type: "string" },
        },
        required: ["padroes_comportamentais", "tipo_cliente_correspondente", "alertas_eticos", "o_que_nao_fazer"],
        additionalProperties: false,
      },
    },
  },
  forja: {
    type: "function",
    function: {
      name: "plano_terapeutico",
      description: "Roteiro estruturado de sessão",
      parameters: {
        type: "object",
        properties: {
          objetivo_refinado: { type: "string" },
          sequencia_conducao: { type: "array", items: { type: "string" } },
          perguntas_chave: { type: "array", items: { type: "string" } },
          intervencao_simbolica: { type: "string" },
          fechamento: { type: "string" },
          riscos: { type: "array", items: { type: "string" } },
          possiveis_respostas_cliente: { type: "array", items: { type: "string" } },
          ajustes_de_rota: { type: "array", items: { type: "string" } },
        },
        required: ["objetivo_refinado", "sequencia_conducao", "perguntas_chave", "intervencao_simbolica", "fechamento", "riscos"],
        additionalProperties: false,
      },
    },
  },
};

const TOOL_NAMES: Record<string, string> = {
  cartografia: "leitura_simbolica",
  espelho: "espelho_clinico",
  forja: "plano_terapeutico",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = (await req.json()) as ReqBody;
    if (!body?.modo || !TOOLS[body.modo]) {
      return new Response(JSON.stringify({ error: "modo inválido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY ausente");

    const userPrompt = `OBRA: ${body.obra.titulo}${body.obra.autor ? ` — ${body.obra.autor}` : ""}

CONTEXTO AUTORAL DA OBRA (sugestões da Casa Orácula):
${JSON.stringify(body.contexto_autoral ?? {}, null, 2)}

RESPOSTAS DA USUÁRIA:
${JSON.stringify(body.inputs ?? {}, null, 2)}

Devolva a análise via tool call.`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEMS[body.modo] },
          { role: "user", content: userPrompt },
        ],
        tools: [TOOLS[body.modo]],
        tool_choice: { type: "function", function: { name: TOOL_NAMES[body.modo] } },
      }),
    });

    if (resp.status === 429) {
      return new Response(JSON.stringify({ error: "Limite atingido. Tente novamente em instantes." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (resp.status === 402) {
      return new Response(JSON.stringify({ error: "Créditos esgotados. Adicione créditos em Settings > Workspace > Usage." }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!resp.ok) {
      const t = await resp.text();
      console.error("AI gateway error:", resp.status, t);
      return new Response(JSON.stringify({ error: "Falha na IA" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const toolCall = data?.choices?.[0]?.message?.tool_calls?.[0];
    const args = toolCall?.function?.arguments;
    const parsed = typeof args === "string" ? JSON.parse(args) : args;

    return new Response(JSON.stringify({ analise: parsed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("lab-oracular-ia error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "erro" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
