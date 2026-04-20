// SYNTHEIA — Detectores Clínicos
// Detecta padrões: estagnacao, dissociacao, evitacao, fusao
// Persiste em co_detectores_eventos

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type DetectorTipo = "estagnacao" | "dissociacao" | "evitacao" | "fusao";
type Intensidade = "baixa" | "media" | "alta";
type Origem = "jardim" | "sessao" | "ia";

interface Detector {
  tipo: DetectorTipo;
  intensidade: Intensidade;
  descricao: string;
  evidencias: string[];
}

interface RequestBody {
  client_user_id: string;
  texto: string;
  contexto: "jardim" | "sessao";
  session_id?: string | null;
}

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

// ---------- Heurísticas determinísticas ----------
function analisarHeuristicas(textoRaw: string): Detector[] {
  const texto = textoRaw.toLowerCase();
  const palavras = texto.split(/\s+/).filter(Boolean);
  const total = Math.max(palavras.length, 1);
  const detectores: Detector[] = [];

  // ESTAGNAÇÃO — marcadores de repetição/cristalização
  const estagMarkers = [
    "sempre",
    "nunca",
    "de novo",
    "outra vez",
    "já sei",
    "ja sei",
    "como sempre",
    "a mesma coisa",
    "mesma coisa",
    "tudo igual",
  ];
  const estagHits = estagMarkers.filter((m) => texto.includes(m));
  if (estagHits.length > 0) {
    const intensidade: Intensidade =
      estagHits.length >= 3 ? "alta" : estagHits.length === 2 ? "media" : "baixa";
    detectores.push({
      tipo: "estagnacao",
      intensidade,
      descricao: "Padrão de repetição e cristalização discursiva",
      evidencias: estagHits,
    });
  }

  // DISSOCIAÇÃO — racionalização sem afeto
  const emocoes = [
    "sinto",
    "senti",
    "medo",
    "raiva",
    "tristeza",
    "alegria",
    "amor",
    "vergonha",
    "culpa",
    "dor",
    "angústia",
    "angustia",
    "ansiedade",
    "saudade",
    "ódio",
    "odio",
    "felicidade",
    "vazio",
    "doí",
    "doi",
    "choro",
    "chorei",
  ];
  const racional = [
    "acho que",
    "penso que",
    "logicamente",
    "racional",
    "objetivamente",
    "tecnicamente",
    "em teoria",
    "fato é",
    "fato e",
    "na verdade",
  ];
  const emoHits = emocoes.filter((m) => texto.includes(m)).length;
  const racHits = racional.filter((m) => texto.includes(m)).length;
  if (total > 25 && emoHits === 0 && racHits >= 1) {
    detectores.push({
      tipo: "dissociacao",
      intensidade: racHits >= 3 ? "alta" : "media",
      descricao: "Discurso racional extenso sem marcadores afetivos",
      evidencias: racional.filter((m) => texto.includes(m)),
    });
  } else if (total > 40 && emoHits === 0) {
    detectores.push({
      tipo: "dissociacao",
      intensidade: "baixa",
      descricao: "Texto longo com ausência de vocabulário emocional",
      evidencias: [],
    });
  }

  // EVITAÇÃO — superficialidade / fuga
  const evitMarkers = [
    "não quero falar",
    "nao quero falar",
    "deixa pra lá",
    "deixa pra la",
    "tanto faz",
    "sei lá",
    "sei la",
    "não importa",
    "nao importa",
    "não sei",
    "nao sei",
    "não interessa",
    "nao interessa",
    "outra coisa",
    "mudando de assunto",
  ];
  const evitHits = evitMarkers.filter((m) => texto.includes(m));
  const muitoCurto = total < 12;
  if (evitHits.length > 0 || muitoCurto) {
    const intensidade: Intensidade =
      evitHits.length >= 2 ? "alta" : evitHits.length === 1 ? "media" : "baixa";
    detectores.push({
      tipo: "evitacao",
      intensidade,
      descricao: muitoCurto
        ? "Resposta excessivamente curta — possível superficialidade"
        : "Marcadores de fuga ou desinteresse temático",
      evidencias: evitHits,
    });
  }

  // FUSÃO — alta intensidade emocional repetida
  const intensidadeMarkers = [
    "muito",
    "demais",
    "insuportável",
    "insuportavel",
    "horrível",
    "horrivel",
    "desespero",
    "explodir",
    "morrer",
    "não aguento",
    "nao aguento",
    "!!",
    "!!!",
  ];
  const fusHits = intensidadeMarkers.filter((m) => texto.includes(m));
  if (fusHits.length >= 2 && emoHits >= 2) {
    detectores.push({
      tipo: "fusao",
      intensidade: fusHits.length >= 4 ? "alta" : "media",
      descricao: "Intensidade emocional elevada com repetição afetiva",
      evidencias: fusHits,
    });
  } else if (fusHits.length >= 3) {
    detectores.push({
      tipo: "fusao",
      intensidade: "baixa",
      descricao: "Linguagem absoluta repetida (possível fusão emergente)",
      evidencias: fusHits,
    });
  }

  return detectores;
}

// ---------- Refinamento opcional via IA ----------
async function refinarComIA(
  texto: string,
  baseline: Detector[],
): Promise<Detector[]> {
  if (!LOVABLE_API_KEY) return baseline;

  const system = `Você é uma analista clínica simbólica. Analise o texto da cliente e identifique padrões de:
- estagnacao (repetição cristalizada)
- dissociacao (ausência de afeto, racionalização)
- evitacao (fuga de tema, superficialidade)
- fusao (intensidade emocional não regulada)

Retorne APENAS via tool call. Seja conservadora — não invente padrões. Use a baseline heurística como referência mas pode ajustar intensidade ou remover falsos positivos.`;

  const tool = {
    type: "function",
    function: {
      name: "registrar_detectores",
      description: "Registra padrões clínicos detectados no texto",
      parameters: {
        type: "object",
        properties: {
          detectores: {
            type: "array",
            items: {
              type: "object",
              properties: {
                tipo: {
                  type: "string",
                  enum: ["estagnacao", "dissociacao", "evitacao", "fusao"],
                },
                intensidade: {
                  type: "string",
                  enum: ["baixa", "media", "alta"],
                },
                descricao: { type: "string" },
                evidencias: { type: "array", items: { type: "string" } },
              },
              required: ["tipo", "intensidade", "descricao"],
              additionalProperties: false,
            },
          },
        },
        required: ["detectores"],
        additionalProperties: false,
      },
    },
  };

  try {
    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: system },
          {
            role: "user",
            content: `TEXTO:\n"""${texto}"""\n\nBASELINE HEURÍSTICA:\n${JSON.stringify(baseline, null, 2)}`,
          },
        ],
        tools: [tool],
        tool_choice: { type: "function", function: { name: "registrar_detectores" } },
      }),
    });

    if (!resp.ok) {
      console.warn("IA refinement falhou:", resp.status);
      return baseline;
    }

    const data = await resp.json();
    const call = data?.choices?.[0]?.message?.tool_calls?.[0];
    if (!call?.function?.arguments) return baseline;
    const parsed = JSON.parse(call.function.arguments);
    if (Array.isArray(parsed.detectores) && parsed.detectores.length > 0) {
      return parsed.detectores;
    }
    return baseline;
  } catch (err) {
    console.warn("IA refinement erro:", err);
    return baseline;
  }
}

// ---------- Handler ----------
Deno.serve(async (req) => {
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
      { global: { headers: { Authorization: authHeader } } },
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimData, error: claimErr } = await supabase.auth.getClaims(token);
    if (claimErr || !claimData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const therapistUserId = claimData.claims.sub as string;

    const body = (await req.json()) as Partial<RequestBody>;
    const { client_user_id, texto, contexto, session_id } = body;

    if (
      !client_user_id ||
      typeof client_user_id !== "string" ||
      !texto ||
      typeof texto !== "string" ||
      texto.trim().length < 3 ||
      (contexto !== "jardim" && contexto !== "sessao")
    ) {
      return new Response(
        JSON.stringify({
          error:
            "Parâmetros inválidos: client_user_id, texto (>=3 chars) e contexto (jardim|sessao) são obrigatórios",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // 1. Heurística
    const baseline = analisarHeuristicas(texto);

    // 2. Refinamento opcional via IA (não bloqueante se falhar)
    const detectoresFinais = baseline.length > 0
      ? await refinarComIA(texto, baseline)
      : baseline;

    // 3. Persistir em co_detectores_eventos
    const origem: Origem = "ia";
    const rowsToInsert = detectoresFinais.map((d) => ({
      client_user_id,
      therapist_user_id: therapistUserId,
      session_id: session_id ?? null,
      detector_tipo: d.tipo,
      intensidade: d.intensidade,
      origem,
      descricao: d.descricao +
        (d.evidencias && d.evidencias.length > 0
          ? ` — evidências: ${d.evidencias.join(", ")}`
          : ""),
    }));

    let inserted: unknown[] = [];
    if (rowsToInsert.length > 0) {
      const { data, error } = await supabase
        .from("co_detectores_eventos")
        .insert(rowsToInsert)
        .select();
      if (error) {
        console.error("Erro ao inserir detectores:", error);
        return new Response(
          JSON.stringify({
            error: "Falha ao salvar detectores",
            detail: error.message,
            detectores: detectoresFinais,
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      inserted = data ?? [];
    }

    return new Response(
      JSON.stringify({
        ok: true,
        contexto,
        total: detectoresFinais.length,
        detectores: detectoresFinais,
        registros_salvos: inserted.length,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    console.error("syntheia-detectores erro:", err);
    return new Response(
      JSON.stringify({ error: "Erro interno", detail: String(err) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
