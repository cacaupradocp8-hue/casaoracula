// SYNTHEIA — Detectores Clínicos
// Detecta padrões: estagnacao, dissociacao, evitacao, fusao
// Persiste em co_detectores_eventos
//
// Hardenings v2:
//  - origem agora classifica como 'heuristica' | 'ia' | 'hibrido'
//  - valida vínculo terapeuta ↔ cliente antes de inserir
//  - dedupe por hash(payload) na janela de 10 min
//  - dissociacao: thresholds mais conservadores (anti falso-positivo)
//  - fusao: marcadores sensíveis ('morrer', 'não aguento') só contam
//    junto de marcadores afetivos explícitos (anti alarme indevido)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type DetectorTipo = "estagnacao" | "dissociacao" | "evitacao" | "fusao";
type Intensidade = "baixa" | "media" | "alta";
type Origem = "heuristica" | "ia" | "hibrido";

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
const DEDUP_WINDOW_MINUTES = 10;

// ---------- Hash determinístico curto (SHA-256, 16 hex chars) ----------
async function shortHash(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  const hex = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hex.slice(0, 16);
}

function normalizeForHash(texto: string): string {
  return texto
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

// ---------- Mapa Vivo (estado longitudinal derivado) ----------
async function refreshMapaVivo(supabase: any, clientUserId: string) {
  const [{ data: dets }, { data: ints }] = await Promise.all([
    supabase
      .from("co_detectores_eventos")
      .select("detector_tipo, intensidade, created_at")
      .eq("client_user_id", clientUserId)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("co_intervencoes")
      .select("tipo, houve_deslocamento, created_at")
      .eq("client_user_id", clientUserId)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const dList = (dets ?? []) as Array<{ detector_tipo: string; intensidade: string }>;
  const iList = (ints ?? []) as Array<{ tipo: string; houve_deslocamento: boolean }>;

  const cnt = (t: string) => dList.filter((d) => d.detector_tipo === t).length;
  const high = (t: string) =>
    dList.some((d) => d.detector_tipo === t && d.intensidade === "alta");
  const desloc = iList.filter((i) => i.houve_deslocamento).length;
  const totalInts = iList.length;

  let eixo_movimento: "estagnacao" | "oscilacao" | "deslocamento" = "estagnacao";
  if (desloc >= 2) eixo_movimento = "deslocamento";
  else if (desloc === 1 || cnt("estagnacao") <= 1) eixo_movimento = "oscilacao";
  else if (cnt("estagnacao") >= 3 || high("estagnacao")) eixo_movimento = "estagnacao";

  let presenca_emocional: "baixa" | "parcial" | "integrada" = "parcial";
  if (high("dissociacao") || cnt("dissociacao") >= 3) presenca_emocional = "baixa";
  else if (desloc >= 2 && cnt("dissociacao") === 0) presenca_emocional = "integrada";

  let eixo_confronto: "evita" | "oscila" | "sustenta" = "oscila";
  if (high("evitacao") || cnt("evitacao") >= 3) eixo_confronto = "evita";
  else if (desloc >= 2) eixo_confronto = "sustenta";

  let regulacao: "desorganizada" | "instavel" | "regulada" = "instavel";
  if (high("fusao") || cnt("fusao") >= 3) regulacao = "desorganizada";
  else if (totalInts >= 2 && desloc / Math.max(totalInts, 1) >= 0.5) regulacao = "regulada";

  await supabase
    .from("co_mapa_vivo")
    .upsert(
      {
        client_user_id: clientUserId,
        eixo_movimento,
        presenca_emocional,
        eixo_confronto,
        regulacao,
      },
      { onConflict: "client_user_id" },
    );
}

// ---------- Heurísticas determinísticas ----------
function analisarHeuristicas(textoRaw: string): Detector[] {
  const texto = textoRaw.toLowerCase();
  const palavras = texto.split(/\s+/).filter(Boolean);
  const total = Math.max(palavras.length, 1);
  const detectores: Detector[] = [];

  // ESTAGNAÇÃO — repetição/cristalização
  const estagMarkers = [
    "sempre", "nunca", "de novo", "outra vez", "já sei", "ja sei",
    "como sempre", "a mesma coisa", "mesma coisa", "tudo igual",
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

  // Vocabulário afetivo (compartilhado)
  const emocoes = [
    "sinto", "senti", "medo", "raiva", "tristeza", "alegria", "amor",
    "vergonha", "culpa", "dor", "angústia", "angustia", "ansiedade",
    "saudade", "ódio", "odio", "felicidade", "vazio", "doí", "doi",
    "choro", "chorei", "chorar",
  ];
  const racional = [
    "acho que", "penso que", "logicamente", "racional", "objetivamente",
    "tecnicamente", "em teoria", "fato é", "fato e", "na verdade",
  ];
  const emoHits = emocoes.filter((m) => texto.includes(m)).length;
  const racHits = racional.filter((m) => texto.includes(m)).length;

  // DISSOCIAÇÃO — CONSERVADORA
  // Só dispara em texto longo o bastante (>=60 palavras), com zero afeto
  // E múltiplos marcadores de racionalização. Intensidade nunca "alta"
  // sem confirmação da IA — heurística limita a "media".
  // Texto curto/médio sem afeto NÃO marca (estilo de escrita ≠ dissociação).
  if (total >= 60 && emoHits === 0 && racHits >= 3) {
    detectores.push({
      tipo: "dissociacao",
      intensidade: "media",
      descricao:
        "Texto extenso com múltiplos marcadores racionais e ausência de vocabulário afetivo",
      evidencias: racional.filter((m) => texto.includes(m)),
    });
  } else if (total >= 100 && emoHits === 0 && racHits >= 1) {
    detectores.push({
      tipo: "dissociacao",
      intensidade: "baixa",
      descricao: "Texto longo (>100 palavras) sem marcadores afetivos",
      evidencias: racional.filter((m) => texto.includes(m)),
    });
  }

  // EVITAÇÃO — superficialidade / fuga
  const evitMarkers = [
    "não quero falar", "nao quero falar", "deixa pra lá", "deixa pra la",
    "tanto faz", "sei lá", "sei la", "não importa", "nao importa",
    "não sei", "nao sei", "não interessa", "nao interessa",
    "outra coisa", "mudando de assunto",
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

  // FUSÃO — REVISADA com cuidado para marcadores sensíveis
  //
  // Separamos:
  //   - intensidade GENÉRICA (segura: muito, demais, !!, etc.)
  //   - intensidade SENSÍVEL (morrer, não aguento, desespero, explodir)
  //
  // Marcadores sensíveis SOZINHOS não disparam alerta — exigem
  // contexto afetivo claro (>=2 marcadores emocionais) E coocorrência
  // com outro marcador genérico. Isso evita alarme por uso figurado
  // ("morro de rir", "não aguento de saudade boa", etc.).
  const intensidadeGenerica = [
    "muito", "demais", "horrível", "horrivel", "insuportável", "insuportavel",
    "!!", "!!!",
  ];
  const intensidadeSensivel = [
    "morrer", "não aguento", "nao aguento", "desespero", "explodir",
  ];
  const genHits = intensidadeGenerica.filter((m) => texto.includes(m));
  const sensHits = intensidadeSensivel.filter((m) => texto.includes(m));
  const todasFusHits = [...genHits, ...sensHits];

  // Caso 1 — fusão clara: muitos marcadores genéricos + afeto explícito
  if (genHits.length >= 2 && emoHits >= 2) {
    const intensidade: Intensidade =
      genHits.length + sensHits.length >= 4 ? "alta" : "media";
    detectores.push({
      tipo: "fusao",
      intensidade,
      descricao: "Intensidade emocional elevada com repetição afetiva",
      evidencias: todasFusHits,
    });
  }
  // Caso 2 — sensível: só dispara com afeto E confirmação genérica
  else if (sensHits.length >= 1 && emoHits >= 2 && genHits.length >= 1) {
    detectores.push({
      tipo: "fusao",
      intensidade: "media",
      descricao:
        "Marcadores de alta intensidade contextualizados em campo afetivo explícito",
      evidencias: todasFusHits,
    });
  }
  // Caso 3 — eco linguístico (genéricos repetidos sem afeto): baixa, informativo
  else if (genHits.length >= 3) {
    detectores.push({
      tipo: "fusao",
      intensidade: "baixa",
      descricao: "Linguagem absoluta repetida (possível fusão emergente)",
      evidencias: genHits,
    });
  }

  return detectores;
}

// ---------- Refinamento opcional via IA ----------
async function refinarComIA(
  texto: string,
  baseline: Detector[],
): Promise<{ detectores: Detector[]; usouIA: boolean }> {
  if (!LOVABLE_API_KEY) return { detectores: baseline, usouIA: false };

  const system = `Você é uma analista clínica simbólica. Analise o texto da cliente e identifique padrões de:
- estagnacao (repetição cristalizada)
- dissociacao (ausência de afeto, racionalização) — SEJA CONSERVADORA, estilo racional ≠ dissociação
- evitacao (fuga de tema, superficialidade)
- fusao (intensidade emocional não regulada) — marcadores como "morrer" podem ser figurados; exija contexto afetivo claro

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
      return { detectores: baseline, usouIA: false };
    }

    const data = await resp.json();
    const call = data?.choices?.[0]?.message?.tool_calls?.[0];
    if (!call?.function?.arguments) return { detectores: baseline, usouIA: false };
    const parsed = JSON.parse(call.function.arguments);
    if (Array.isArray(parsed.detectores)) {
      return { detectores: parsed.detectores, usouIA: true };
    }
    return { detectores: baseline, usouIA: false };
  } catch (err) {
    console.warn("IA refinement erro:", err);
    return { detectores: baseline, usouIA: false };
  }
}

// ---------- Validação de vínculo terapeuta ↔ cliente ----------
async function isLinkedTherapist(
  supabase: any,
  therapistUserId: string,
  clientUserId: string,
): Promise<boolean> {
  // Caminho 1: terapeuta atua via tabela `clientes` (terapeuta_id + client_user_id)
  const { data: cli } = await supabase
    .from("clientes")
    .select("id")
    .eq("terapeuta_id", therapistUserId)
    .eq("client_user_id", clientUserId)
    .eq("status", "ativo")
    .limit(1)
    .maybeSingle();
  if (cli) return true;

  // Caminho 2: vínculo direto via co_jardins ativo (cliente é o próprio user)
  const { data: jardim } = await supabase
    .from("co_jardins")
    .select("id")
    .eq("therapist_user_id", therapistUserId)
    .eq("client_user_id", clientUserId)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();
  if (jardim) return true;

  // Caminho 3: o próprio cliente está escrevendo no seu jardim (auto-análise)
  if (therapistUserId === clientUserId) {
    const { data: ownJardim } = await supabase
      .from("co_jardins")
      .select("id")
      .eq("client_user_id", clientUserId)
      .eq("status", "active")
      .limit(1)
      .maybeSingle();
    if (ownJardim) return true;
  }

  return false;
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
    const callerUserId = claimData.claims.sub as string;

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

    // ---- Validação de vínculo ----
    const linked = await isLinkedTherapist(supabase, callerUserId, client_user_id);
    if (!linked) {
      return new Response(
        JSON.stringify({
          error:
            "Sem vínculo ativo entre solicitante e cliente. Detector não registrado.",
        }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }
    // therapist_user_id = quem detém o caso clínico (não o caller, se for o próprio cliente)
    let therapistUserId = callerUserId;
    if (callerUserId === client_user_id) {
      const { data: jardim } = await supabase
        .from("co_jardins")
        .select("therapist_user_id")
        .eq("client_user_id", client_user_id)
        .eq("status", "active")
        .limit(1)
        .maybeSingle();
      if (jardim?.therapist_user_id) therapistUserId = jardim.therapist_user_id;
    }

    // ---- Dedup: hash do payload ----
    const payloadHash = await shortHash(
      `${contexto}|${session_id ?? ""}|${normalizeForHash(texto)}`,
    );
    const sinceIso = new Date(
      Date.now() - DEDUP_WINDOW_MINUTES * 60 * 1000,
    ).toISOString();
    const { data: dup } = await supabase
      .from("co_detectores_eventos")
      .select("id, created_at")
      .eq("client_user_id", client_user_id)
      .eq("contexto", contexto)
      .eq("payload_hash", payloadHash)
      .gte("created_at", sinceIso)
      .limit(1)
      .maybeSingle();

    if (dup) {
      return new Response(
        JSON.stringify({
          ok: true,
          deduped: true,
          message: `Texto idêntico já analisado nos últimos ${DEDUP_WINDOW_MINUTES} min`,
          referencia_id: dup.id,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // 1. Heurística
    const baseline = analisarHeuristicas(texto);

    // 2. Refinamento opcional via IA
    const { detectores: detectoresFinais, usouIA } = baseline.length > 0
      ? await refinarComIA(texto, baseline)
      : { detectores: baseline, usouIA: false };

    // 3. Classificação de origem
    //   - heuristica: só baseline, IA não opinou
    //   - ia: nada na baseline, mas IA inferiu (raro — baseline.length===0 nem chama IA)
    //   - hibrido: baseline existia E IA refinou/ajustou
    const origem: Origem =
      usouIA && baseline.length > 0 ? "hibrido"
        : usouIA ? "ia"
        : "heuristica";

    // 4. Persistir em co_detectores_eventos
    const rowsToInsert = detectoresFinais.map((d) => ({
      client_user_id,
      therapist_user_id: therapistUserId,
      session_id: session_id ?? null,
      detector_tipo: d.tipo,
      intensidade: d.intensidade,
      origem,
      contexto,
      payload_hash: payloadHash,
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

    // 5. Atualizar co_mapa_vivo
    try {
      await refreshMapaVivo(supabase, client_user_id);
    } catch (mapaErr) {
      console.error("Falha ao atualizar co_mapa_vivo:", mapaErr);
    }

    return new Response(
      JSON.stringify({
        ok: true,
        contexto,
        origem,
        total: detectoresFinais.length,
        detectores: detectoresFinais,
        registros_salvos: inserted.length,
        payload_hash: payloadHash,
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
