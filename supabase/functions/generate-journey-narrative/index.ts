import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type NarrativeType = "sintese" | "relatorio" | "devolutiva" | "fechamento";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY not configured");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase config missing");

    const { client_id, narrative_type = "relatorio" } = await req.json() as { client_id: string; narrative_type?: NarrativeType };
    if (!client_id) throw new Error("client_id is required");

    const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Gather comprehensive journey data
    const [clienteRes, journeysRes, patternsRes, sessionsRes, cidadelaRes, towersRes, cartoRes, snapshotsRes] = await Promise.all([
      sb.from("clientes").select("nome, data_inicio, archetypal_profile_json, codigo_interno").eq("id", client_id).single(),
      sb.from("journeys").select("id").eq("client_id", client_id).limit(1),
      sb.from("client_pattern_stats").select("pattern_type, pattern_name, occurrence_count").eq("client_id", client_id).order("occurrence_count", { ascending: false }).limit(30),
      sb.from("sessions").select("id, district_id, created_at, checkin_state, insight, tool_id, task").eq("client_id", client_id).order("created_at", { ascending: true }),
      sb.from("client_cidadela_map").select("*").eq("client_id", client_id).limit(1),
      sb.from("towers").select("tower_primary, tower_secondary, created_at").eq("client_id", client_id).order("created_at", { ascending: false }).limit(10),
      sb.from("cartographies").select("scores_json, classification_json, date").eq("client_id", client_id).order("date", { ascending: false }).limit(1),
      sb.from("archetypal_profile_snapshots").select("dominant_archetype, shadow_archetype, psychic_movement, evolution_call, generated_at").eq("client_id", client_id).order("generated_at", { ascending: false }).limit(3),
    ]);

    // Journey districts
    let districtsData: any[] = [];
    let stateChanges: any[] = [];
    if (journeysRes.data?.length) {
      const journeyId = journeysRes.data[0].id;
      const [jdRes, scRes] = await Promise.all([
        sb.from("journey_districts").select("district_id, state, sessions_count, last_session_at, notes").eq("journey_id", journeyId),
        sb.from("district_state_changes").select("district_id, from_state, to_state, reason, created_at").eq("client_id", client_id).order("created_at", { ascending: true }),
      ]);

      if (jdRes.data?.length) {
        const distIds = jdRes.data.map((j: any) => j.district_id);
        const { data: dists } = await sb.from("districts").select("id, nome, descricao").in("id", distIds);
        const nameMap = Object.fromEntries((dists || []).map((d: any) => [d.id, { nome: d.nome, descricao: d.descricao }]));
        districtsData = jdRes.data.map((j: any) => ({
          nome: nameMap[j.district_id]?.nome || "Desconhecido",
          descricao: nameMap[j.district_id]?.descricao || "",
          state: j.state,
          sessions_count: j.sessions_count,
          last_session_at: j.last_session_at,
          notes: j.notes,
        }));
      }
      stateChanges = scRes.data || [];
    }

    const sessions = sessionsRes.data || [];
    const patterns = patternsRes.data || [];
    const cidadela = cidadelaRes.data?.[0] || cidadelaRes.data;
    const archProfile = clienteRes.data?.archetypal_profile_json as any;
    const cartoData = cartoRes.data?.[0];
    const snapshots = snapshotsRes.data || [];

    // Build towers set
    const torreSet = new Set<string>();
    (towersRes.data || []).forEach((t: any) => {
      if (t.tower_primary) torreSet.add(t.tower_primary);
      if (t.tower_secondary) torreSet.add(t.tower_secondary);
    });

    const ativos = districtsData.filter((d: any) => d.state === "ativo");
    const integrados = districtsData.filter((d: any) => d.state === "integrado");
    const inativos = districtsData.filter((d: any) => d.state === "inativo");

    // Insights from sessions
    const allInsights = sessions.filter((s: any) => s.insight).map((s: any) => ({
      date: new Date(s.created_at).toLocaleDateString("pt-BR"),
      insight: s.insight,
    }));

    // Integration transitions
    const integrationEvents = stateChanges.filter((sc: any) => sc.to_state === "integrado");

    // Build comprehensive context
    const contextData = `
CLIENTE: ${clienteRes.data?.nome || "Desconhecido"}
INÍCIO DA JORNADA: ${clienteRes.data?.data_inicio ? new Date(clienteRes.data.data_inicio).toLocaleDateString("pt-BR") : "não registrado"}
TOTAL DE SESSÕES: ${sessions.length}
PRIMEIRA SESSÃO: ${sessions.length > 0 ? new Date(sessions[0].created_at).toLocaleDateString("pt-BR") : "—"}
ÚLTIMA SESSÃO: ${sessions.length > 0 ? new Date(sessions[sessions.length - 1].created_at).toLocaleDateString("pt-BR") : "—"}

MAPA DA CIDADELA:
- Distritos Ativos (${ativos.length}): ${ativos.map((d: any) => `${d.nome} (${d.sessions_count} sessões)`).join(", ") || "nenhum"}
- Distritos Integrados (${integrados.length}): ${integrados.map((d: any) => d.nome).join(", ") || "nenhum"}
- Distritos Inativos (${inativos.length}): ${inativos.map((d: any) => d.nome).join(", ") || "nenhum"}

TORRES IDENTIFICADAS: ${[...torreSet].join(", ") || "nenhuma"}
PORTAS CRUZADAS: ${(cidadela as any)?.portas_cruzadas?.join(", ") || "nenhuma"}
LABIRINTOS VISITADOS: ${(cidadela as any)?.labirintos_visitados?.join(", ") || "nenhum"}
FERRAMENTAS UTILIZADAS: ${(cidadela as any)?.ferramentas_utilizadas?.join(", ") || "nenhuma"}

PADRÕES RECORRENTES (top 10):
${patterns.slice(0, 10).map((p: any) => `- ${p.pattern_name} (${p.pattern_type}, ${p.occurrence_count}x)`).join("\n") || "nenhum padrão registrado"}

ARQUÉTIPO PREDOMINANTE: ${archProfile?.arquetipo_predominante?.nome || snapshots[0]?.dominant_archetype || "não identificado"}
ARQUÉTIPO EM SOMBRA: ${archProfile?.arquetipo_sombra?.nome || snapshots[0]?.shadow_archetype || "não identificado"}
MOVIMENTO PSÍQUICO: ${snapshots[0]?.psychic_movement || "não registrado"}
CHAMADO EVOLUTIVO: ${archProfile?.chamado_evolutivo || snapshots[0]?.evolution_call || "não registrado"}

CARTOGRAFIA PSÍQUICA:
${cartoData ? Object.entries(cartoData.scores_json as Record<string, number>).map(([k, v]) => `- ${k}: ${v}/100 (${(cartoData.classification_json as any)?.[k] || "—"})`).join("\n") : "sem cartografia registrada"}

TRANSIÇÕES DE INTEGRAÇÃO:
${integrationEvents.map((e: any) => `- ${new Date(e.created_at).toLocaleDateString("pt-BR")}: ${e.reason || "integração registrada"}`).join("\n") || "nenhuma transição registrada"}

INSIGHTS CLÍNICOS (últimos 8):
${allInsights.slice(-8).map((i: any) => `- ${i.date}: "${i.insight}"`).join("\n") || "nenhum insight registrado"}

NOTAS DOS DISTRITOS ATIVOS:
${ativos.filter((d: any) => d.notes).map((d: any) => `- ${d.nome}: ${d.notes}`).join("\n") || "sem notas"}

EVOLUÇÃO ARQUETÍPICA (snapshots):
${snapshots.map((s: any) => `- ${new Date(s.generated_at).toLocaleDateString("pt-BR")}: Predominante=${s.dominant_archetype || "?"}, Sombra=${s.shadow_archetype || "?"}`).join("\n") || "sem histórico"}
`;

    const narrativePrompts: Record<NarrativeType, { system: string; responseFormat: string }> = {
      sintese: {
        system: `Você é o Guardião da Jornada Terapêutica da Casa Orácula. Gere uma SÍNTESE BREVE da jornada da cliente. Use linguagem simbólica, ética, não-diagnóstica e contemplativa. Use expressões como "o mapa mostra recorrência em...", "a jornada sugere um movimento em direção a...", "houve permanência mais longa em...". NUNCA use diagnóstico fechado, afirmações absolutas ou rótulos patologizantes. Máximo 4-5 frases.`,
        responseFormat: `{"sintese": "texto da síntese breve", "fase_atual": "nome da fase atual da jornada (ex: 'Travessia das Torres', 'Integração do Labirinto')", "proximo_horizonte": "uma frase sobre o próximo movimento possível"}`,
      },
      relatorio: {
        system: `Você é o Guardião da Jornada Terapêutica da Casa Orácula. Gere um RELATÓRIO NARRATIVO COMPLETO da jornada da cliente. Use linguagem simbólica, ética, não-diagnóstica e contemplativa. A narrativa deve cobrir: 1) Ponto de Partida — onde a jornada começou; 2) Movimentos Principais — distritos e símbolos predominantes; 3) Repetições — padrões recorrentes; 4) Momentos de Virada — sessões ou ferramentas que marcaram mudança; 5) Integração — territórios que se reorganizaram; 6) Próximo Horizonte — movimento simbólico que se abre. NUNCA use diagnóstico fechado ou rótulos patologizantes. Use linguagem de hipótese.`,
        responseFormat: `{"ponto_partida": "parágrafo sobre o início", "movimentos_principais": "parágrafo sobre os movimentos", "repeticoes": "parágrafo sobre padrões", "momentos_virada": "parágrafo sobre viradas", "integracao": "parágrafo sobre integrações", "proximo_horizonte": "parágrafo sobre o próximo passo", "titulo_narrativo": "título poético para esta fase da jornada"}`,
      },
      devolutiva: {
        system: `Você é o Guardião da Jornada Terapêutica da Casa Orácula. Gere uma DEVOLUTIVA SIMBÓLICA que a terapeuta pode adaptar para apresentar à cliente. Tom: acolhedor, claro, profundo, sem jargão técnico. A devolutiva deve celebrar o caminho percorrido, nomear simbolicamente os territórios visitados, e apontar com delicadeza o que se abre adiante. NUNCA use diagnóstico, termos clínicos ou linguagem determinista. Escreva em segunda pessoa ("você"), como se falasse diretamente com a cliente.`,
        responseFormat: `{"abertura": "parágrafo de acolhimento", "caminho_percorrido": "parágrafo descrevendo a travessia em linguagem poética e acessível", "o_que_se_revela": "parágrafo sobre o que está emergindo", "convite": "parágrafo final com convite simbólico para a próxima fase", "frase_ancora": "uma frase curta e marcante que resuma a jornada"}`,
      },
      fechamento: {
        system: `Você é o Guardião da Jornada Terapêutica da Casa Orácula. Gere um FECHAMENTO DE CICLO TERAPÊUTICO. O fechamento deve honrar a travessia realizada, nomear as integrações conquistadas, reconhecer o que permanece em movimento e abrir espaço para o que vem. Tom: solene mas caloroso, poético mas preciso. NUNCA use diagnóstico ou termos patologizantes. Use linguagem simbólica e de hipótese.`,
        responseFormat: `{"honra_travessia": "parágrafo honrando o caminho percorrido", "integracoes": "parágrafo sobre o que foi integrado", "em_movimento": "parágrafo sobre o que permanece ativo", "abertura_futuro": "parágrafo sobre o que se abre", "benção_simbolica": "uma frase de encerramento simbólico e poético"}`,
      },
    };

    const config = narrativePrompts[narrative_type];

    const systemPrompt = `${config.system}

Responda SEMPRE em JSON válido no seguinte formato:
${config.responseFormat}

REGRAS:
- Não invente dados que não estejam no contexto
- Use apenas linguagem simbólica e de hipótese
- Cada campo deve ter entre 2-5 frases
- Mantenha coerência com o método da CidaDELA Interior
- Os 12 distritos são territórios psíquicos, não lugares físicos
- Torres são padrões de defesa, Portas são limiares emocionais, Labirintos são ciclos de repetição
- Integração significa que a cliente conseguiu reconhecer e habitar um território com presença`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: contextData },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Tente novamente em alguns instantes." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA esgotados." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const aiResult = await response.json();
    const content = aiResult.choices?.[0]?.message?.content || "{}";

    let parsed;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { error: "Não foi possível gerar a narrativa neste momento.", raw: content };
    }

    return new Response(JSON.stringify({
      type: narrative_type,
      narrative: parsed,
      metadata: {
        total_sessions: sessions.length,
        districts_active: ativos.length,
        districts_integrated: integrados.length,
        generated_at: new Date().toISOString(),
        client_name: clienteRes.data?.nome || "",
      },
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-journey-narrative error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
