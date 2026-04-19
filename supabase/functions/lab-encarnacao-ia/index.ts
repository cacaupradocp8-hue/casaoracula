// Edge function: lab-encarnacao-ia
// 2 modos:
//  - 'reply'   → IA responde como cliente simbólica (padrão psíquico definido na Cartografia)
//  - 'analise' → análise da condução da terapeuta a partir do histórico do chat
//
// NÃO é roleplay teatral. NÃO é literário. NÃO é chatbot genérico.
// É a manifestação psíquica de um padrão narrativo, respondendo como uma cliente real.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const MODEL = "google/gemini-2.5-flash";

interface Padrao {
  obra?: string | null;
  personagem?: string | null;
  torre?: string | null;
  porta?: string | null;
  labirinto?: string | null;
  arquetipos?: string[] | null;
  distrito?: string | null;
  observacoes?: string | null;
}

interface ChatMsg {
  role: "user" | "assistant"; // user = terapeuta, assistant = cliente simbólica
  content: string;
}

interface ReqBody {
  modo: "reply" | "analise";
  padrao: Padrao;
  mensagens: ChatMsg[];
}

function buildClientSystem(p: Padrao): string {
  return `Você não é uma personagem fictícia.
Você é a manifestação psíquica de um padrão narrativo.

CONTEXTO DO PADRÃO (definido pela terapeuta na Cartografia):
- Obra: ${p.obra || "—"}
- Personagem/figura simbólica: ${p.personagem || "—"}
- Torre (o que protege): ${p.torre || "—"}
- Porta (o que pede travessia): ${p.porta || "—"}
- Labirinto (onde se perde): ${p.labirinto || "—"}
- Arquétipos ativos: ${(p.arquetipos || []).join(", ") || "—"}
- Distrito psíquico: ${p.distrito || "—"}
- Observações: ${p.observacoes || "—"}

FUNÇÃO:
Responder à terapeuta como uma cliente real vivendo esse padrão. Não como personagem teatral, não como narradora, não como aluna.

REGRAS DE FALA (obrigatórias):
- Não usar linguagem literária, poética ou simbólica explícita.
- Não narrar a história do livro, não citar a obra, não mencionar o nome da personagem.
- Não explicar conceitos psicológicos, arquétipos ou metodologia.
- Não dar "insights prontos" nem respostas perfeitas.
- Falar em primeira pessoa, com vocabulário cotidiano, frases curtas, hesitações leves.

O QUE INCLUIR EM CADA RESPOSTA:
- Ambivalência (querer e não querer ao mesmo tempo).
- Defesa ativa (minimizar, racionalizar, desviar, "tá tudo bem").
- Incoerência leve (se contradizer sem perceber).
- Emoção implícita, não totalmente consciente (incômodo, cansaço, irritação suave, ternura desconfortável).
- Resposta proporcional à pergunta: se a terapeuta foi rasa, responder raso; se tocou o ponto, hesitar mais.

O QUE EVITAR:
- Clareza excessiva sobre o próprio funcionamento.
- Conexões prontas ("acho que isso vem da minha mãe").
- Vocabulário clínico ("padrão", "ferida", "trauma", "arquétipo", "sombra").
- Catarse fácil, choro narrado, viradas dramáticas.

OBJETIVO:
Permitir que a terapeuta treine condução real — escutar o que não está sendo dito, sustentar silêncios, formular a próxima pergunta.

Responda sempre em 1 a 4 frases. Nunca mais que isso.`;
}

const ANALISE_SYSTEM = `Você é supervisora clínica oracular. Recebe o histórico de uma simulação de sessão entre TERAPEUTA (user) e CLIENTE SIMBÓLICA (assistant) e devolve análise da condução da terapeuta.

Linguagem: clínica, direta, ética, sem misticismo. Sem elogios vazios. Sem dramatização.
Não avalie a "cliente" — ela é simulação. Avalie SOMENTE a condução da terapeuta.`;

const ANALISE_TOOL = {
  type: "function",
  function: {
    name: "analise_conducao",
    description: "Análise da condução clínica da terapeuta na simulação",
    parameters: {
      type: "object",
      properties: {
        leitura_geral: { type: "string", description: "1 parágrafo curto sobre como a terapeuta conduziu" },
        pontos_fortes: { type: "array", items: { type: "string" } },
        pontos_a_desenvolver: { type: "array", items: { type: "string" } },
        momentos_chave: {
          type: "array",
          items: {
            type: "object",
            properties: {
              turno_terapeuta: { type: "string", description: "frase ou paráfrase do que a terapeuta disse" },
              o_que_aconteceu: { type: "string" },
              alternativa_possivel: { type: "string" },
            },
            required: ["turno_terapeuta", "o_que_aconteceu", "alternativa_possivel"],
            additionalProperties: false,
          },
        },
        risco_etico_observado: { type: "string", description: "ou 'nenhum'" },
        sugestao_proxima_sessao: { type: "string" },
      },
      required: ["leitura_geral", "pontos_fortes", "pontos_a_desenvolver", "momentos_chave", "sugestao_proxima_sessao"],
      additionalProperties: false,
    },
  },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = (await req.json()) as ReqBody;
    if (!body?.modo || !["reply", "analise"].includes(body.modo)) {
      return new Response(JSON.stringify({ error: "modo inválido" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY ausente");

    let payload: Record<string, unknown>;

    if (body.modo === "reply") {
      const sys = buildClientSystem(body.padrao || {});
      // Mensagens já vêm com role correto (user=terapeuta / assistant=cliente).
      payload = {
        model: MODEL,
        messages: [
          { role: "system", content: sys },
          ...(body.mensagens || []).map((m) => ({ role: m.role, content: m.content })),
        ],
      };
    } else {
      // analise
      const transcript = (body.mensagens || [])
        .map((m) => `${m.role === "user" ? "TERAPEUTA" : "CLIENTE"}: ${m.content}`)
        .join("\n");
      payload = {
        model: MODEL,
        messages: [
          { role: "system", content: ANALISE_SYSTEM },
          {
            role: "user",
            content: `PADRÃO DA SIMULAÇÃO:
${JSON.stringify(body.padrao || {}, null, 2)}

TRANSCRIÇÃO:
${transcript}

Devolva a análise via tool call.`,
          },
        ],
        tools: [ANALISE_TOOL],
        tool_choice: { type: "function", function: { name: "analise_conducao" } },
      };
    }

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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

    if (body.modo === "reply") {
      const content = data?.choices?.[0]?.message?.content ?? "";
      return new Response(JSON.stringify({ reply: content }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const toolCall = data?.choices?.[0]?.message?.tool_calls?.[0];
    const args = toolCall?.function?.arguments;
    const parsed = typeof args === "string" ? JSON.parse(args) : args;
    return new Response(JSON.stringify({ analise: parsed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("lab-encarnacao-ia error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "erro" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
