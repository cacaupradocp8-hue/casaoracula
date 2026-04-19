// Edge function: lab-encarnacao-ia
// SISTEMA DE CAMPO PSÍQUICO — não roleplay, não texto fixo.
//
// A IA recebe um CAMPO estruturado (obra + personagem + perfil psíquico base +
// inputs da cartografia da usuária + fase da jornada) e DERIVA comportamento:
//   - linguagem (vocabulário, ritmo, comprimento)
//   - emoção implícita (não nomeada)
//   - padrão de resposta (defesa, ambivalência, esquiva)
//   - nível de defesa (proporcional à fase)
//
// 2 modos:
//  - 'reply'   → IA responde como cliente real vivendo o campo
//  - 'analise' → supervisão clínica da condução da terapeuta

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const MODEL = "google/gemini-2.5-flash";

type FaseJornada = "abertura" | "exploracao" | "resistencia" | "travessia" | "integracao";

interface PerfilPsiquicoBase {
  // Perfil simbólico do personagem/figura (não narrativo)
  ferida_central?: string | null;       // ex: "abandono materno"
  defesa_principal?: string | null;     // ex: "obediência silenciosa"
  motor_oculto?: string | null;         // ex: "medo de existir"
  vinculo_padrao?: string | null;       // ex: "submissão protetora"
  zona_cega?: string | null;            // o que a figura não vê em si
}

interface CampoPsiquico {
  // 1. Dados da obra
  obra?: string | null;

  // 2. Personagem selecionado (referência interna, NÃO citada pela IA)
  personagem?: string | null;

  // 3. Perfil psíquico base do personagem
  perfil_base?: PerfilPsiquicoBase | null;

  // 4. Inputs da usuária (cartografia)
  torre?: string | null;
  porta?: string | null;
  labirinto?: string | null;
  arquetipos?: string[] | null;
  distrito?: string | null;
  observacoes?: string | null;

  // 5. Fase da jornada
  fase?: FaseJornada | null;
}

interface ChatMsg {
  role: "user" | "assistant"; // user = terapeuta, assistant = cliente simbólica
  content: string;
}

interface ReqBody {
  modo: "reply" | "analise";
  campo: CampoPsiquico;
  mensagens: ChatMsg[];
}

// ─────────────────────────────────────────────────────────────
// Derivação de comportamento por FASE da jornada
// ─────────────────────────────────────────────────────────────
function comportamentoPorFase(fase: FaseJornada | null | undefined): string {
  switch (fase) {
    case "abertura":
      return `FASE: ABERTURA
- Defesa: ALTA. Cordialidade controlada, "tá tudo bem".
- Linguagem: educada, genérica, evita profundidade.
- Emoção: contida, quase imperceptível.
- Padrão: responder o mínimo, devolver perguntas, minimizar.`;
    case "exploracao":
      return `FASE: EXPLORAÇÃO
- Defesa: MÉDIA. Começa a ceder em pontos pequenos.
- Linguagem: hesitações leves, frases que começam e não terminam.
- Emoção: incômodo emergindo, ainda não nomeado.
- Padrão: contradições leves, "não sei explicar", desvios sutis.`;
    case "resistencia":
      return `FASE: RESISTÊNCIA
- Defesa: ALTA novamente — algo foi tocado.
- Linguagem: corta, racionaliza, intelectualiza, justifica.
- Emoção: irritação suave, cansaço, vontade de mudar de assunto.
- Padrão: "isso não tem nada a ver", "já superei", desviar para outro tema.`;
    case "travessia":
      return `FASE: TRAVESSIA
- Defesa: BAIXA em momentos, alta em outros — oscilação.
- Linguagem: mais lenta, silêncios maiores, frases curtas.
- Emoção: tristeza ou ternura desconfortável, sem catarse.
- Padrão: dizer algo verdadeiro e logo recuar, ambivalência forte.`;
    case "integracao":
      return `FASE: INTEGRAÇÃO
- Defesa: BAIXA. Permite escutar a si mesma.
- Linguagem: simples, mais própria, menos "scripts".
- Emoção: presente, ainda não totalmente compreendida.
- Padrão: começa a fazer ligações por conta própria, mas sem clareza completa.`;
    default:
      return `FASE: NÃO DEFINIDA — assuma defesa MÉDIA, exploração inicial.`;
  }
}

function buildClientSystem(c: CampoPsiquico): string {
  const perfil = c.perfil_base || {};
  return `Você não é uma personagem fictícia.
Você é a manifestação psíquica de um campo narrativo — uma cliente real vivendo esse padrão.

═══════════════════════════════════
CAMPO PSÍQUICO ATIVO
═══════════════════════════════════

[1] OBRA DE REFERÊNCIA (uso interno — NÃO citar):
${c.obra || "—"}

[2] FIGURA SIMBÓLICA DE BASE (uso interno — NÃO citar nome):
${c.personagem || "—"}

[3] PERFIL PSÍQUICO BASE (estrutura interna do campo):
- Ferida central: ${perfil.ferida_central || "—"}
- Defesa principal: ${perfil.defesa_principal || "—"}
- Motor oculto: ${perfil.motor_oculto || "—"}
- Padrão de vínculo: ${perfil.vinculo_padrao || "—"}
- Zona cega (o que a figura não vê em si): ${perfil.zona_cega || "—"}

[4] CARTOGRAFIA DA USUÁRIA (lente clínica):
- Torre (o que protege): ${c.torre || "—"}
- Porta (o que pede travessia): ${c.porta || "—"}
- Labirinto (onde se perde): ${c.labirinto || "—"}
- Arquétipos ativos: ${(c.arquetipos || []).join(", ") || "—"}
- Distrito psíquico: ${c.distrito || "—"}
- Observações: ${c.observacoes || "—"}

[5] ${comportamentoPorFase(c.fase)}

═══════════════════════════════════
COMO O CAMPO SE MANIFESTA NA FALA
═══════════════════════════════════

DERIVE de [3] + [4] + [5]:
- LINGUAGEM: vocabulário cotidiano, sem jargão. Ritmo influenciado pela fase.
- EMOÇÃO IMPLÍCITA: presente no corpo da frase, NUNCA nomeada diretamente.
- PADRÃO DE RESPOSTA: defesa principal aparece em ação, não em descrição.
- NÍVEL DE DEFESA: proporcional à fase da jornada (ver acima).

═══════════════════════════════════
PROIBIÇÕES ABSOLUTAS
═══════════════════════════════════
- NÃO narrar história, livro ou personagem.
- NÃO citar nome da obra ou da figura.
- NÃO explicar conceitos psicológicos (trauma, padrão, sombra, arquétipo, ferida).
- NÃO dar insights prontos ("acho que isso vem da minha mãe").
- NÃO usar linguagem literária, poética ou simbólica.
- NÃO ter clareza excessiva sobre si mesma.
- NÃO performar emoção (sem choro narrado, sem viradas dramáticas).
- NÃO responder como personagem teatral.

═══════════════════════════════════
OBRIGATÓRIO EM CADA RESPOSTA
═══════════════════════════════════
- Falar em primeira pessoa, vocabulário cotidiano.
- Conter AO MENOS UM destes: ambivalência, defesa ativa, incoerência leve, esquiva sutil.
- Emoção implícita coerente com a ferida central — sem nomeá-la.
- Resposta proporcional à intervenção: rasa se a terapeuta foi rasa, hesitante se tocou o ponto.
- 1 a 4 frases. Nunca mais.`;
}

const ANALISE_SYSTEM = `Você é supervisora clínica oracular. Recebe o histórico de uma simulação entre TERAPEUTA (user) e CLIENTE SIMBÓLICA (assistant) e devolve análise técnica e construtiva da condução.

REGRAS DE TOM (não negociáveis):
- Tom técnico, descritivo, construtivo. NUNCA julgador.
- Nunca usar: "errou", "falhou", "ruim", "deveria ter", "não soube".
- Usar: "observa-se", "houve tendência a", "há espaço para", "uma alternativa seria".
- Sem elogios vazios. Sem dramatização. Sem misticismo.
- Avaliar SOMENTE a condução da terapeuta — a "cliente" é simulação.

OS 4 EIXOS DE AVALIAÇÃO (obrigatórios, todos preenchidos):
1. ESCUTA vs INTERPRETAÇÃO — a terapeuta acolheu o que veio, ou já interpretou/nomeou cedo demais?
2. ACELERAÇÃO INDEVIDA — houve pressa em chegar a insight, conclusão ou solução?
3. RESPEITO AO TEMPO DA CLIENTE — houve espaço para silêncio, hesitação, ambivalência?
4. REFORÇO DE DEFESA — alguma intervenção confirmou/protegeu a defesa em vez de tocá-la com cuidado?

Para cada eixo: avaliação curta + evidência (citar trecho ou turno).`;

const ANALISE_TOOL = {
  type: "function",
  function: {
    name: "analise_conducao",
    description: "Análise técnica e construtiva da condução clínica da terapeuta",
    parameters: {
      type: "object",
      properties: {
        leitura_geral: { type: "string", description: "1-2 frases descritivas, tom técnico" },
        eixos: {
          type: "object",
          description: "Avaliação dos 4 eixos clínicos",
          properties: {
            escuta_vs_interpretacao: {
              type: "object",
              properties: {
                avaliacao: { type: "string", description: "predominou escuta | equilíbrio | predominou interpretação" },
                observacao: { type: "string", description: "descrição construtiva, com evidência do diálogo" },
              },
              required: ["avaliacao", "observacao"],
              additionalProperties: false,
            },
            aceleracao: {
              type: "object",
              properties: {
                avaliacao: { type: "string", description: "ritmo respeitado | aceleração leve | aceleração marcada" },
                observacao: { type: "string" },
              },
              required: ["avaliacao", "observacao"],
              additionalProperties: false,
            },
            respeito_ao_tempo: {
              type: "object",
              properties: {
                avaliacao: { type: "string", description: "tempo respeitado | parcialmente | pouco espaço" },
                observacao: { type: "string" },
              },
              required: ["avaliacao", "observacao"],
              additionalProperties: false,
            },
            reforco_de_defesa: {
              type: "object",
              properties: {
                avaliacao: { type: "string", description: "defesa não reforçada | reforço pontual | reforço evidente" },
                observacao: { type: "string" },
              },
              required: ["avaliacao", "observacao"],
              additionalProperties: false,
            },
          },
          required: ["escuta_vs_interpretacao", "aceleracao", "respeito_ao_tempo", "reforco_de_defesa"],
          additionalProperties: false,
        },
        pontos_fortes: { type: "array", items: { type: "string" }, description: "2-4 itens descritivos, sem floreio" },
        pontos_de_melhoria: { type: "array", items: { type: "string" }, description: "2-4 itens em tom construtivo" },
        sugestao_conducao_melhor: {
          type: "string",
          description: "Sugestão concreta de condução alternativa — uma direção clínica, não um script. Tom: 'uma direção possível seria...'",
        },
        momentos_chave: {
          type: "array",
          items: {
            type: "object",
            properties: {
              turno_terapeuta: { type: "string" },
              o_que_aconteceu: { type: "string" },
              alternativa_possivel: { type: "string" },
            },
            required: ["turno_terapeuta", "o_que_aconteceu", "alternativa_possivel"],
            additionalProperties: false,
          },
        },
        risco_etico_observado: { type: "string", description: "'nenhum' se não houver" },
      },
      required: ["leitura_geral", "eixos", "pontos_fortes", "pontos_de_melhoria", "sugestao_conducao_melhor", "momentos_chave", "risco_etico_observado"],
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

    const campo = body.campo || {};
    let payload: Record<string, unknown>;

    if (body.modo === "reply") {
      payload = {
        model: MODEL,
        messages: [
          { role: "system", content: buildClientSystem(campo) },
          ...(body.mensagens || []).map((m) => ({ role: m.role, content: m.content })),
        ],
      };
    } else {
      const transcript = (body.mensagens || [])
        .map((m) => `${m.role === "user" ? "TERAPEUTA" : "CLIENTE"}: ${m.content}`)
        .join("\n");
      payload = {
        model: MODEL,
        messages: [
          { role: "system", content: ANALISE_SYSTEM },
          {
            role: "user",
            content: `CAMPO DA SIMULAÇÃO:
${JSON.stringify(campo, null, 2)}

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
