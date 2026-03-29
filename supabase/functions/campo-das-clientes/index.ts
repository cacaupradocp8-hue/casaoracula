import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY not configured");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase config missing");

    const { therapist_id } = await req.json();
    if (!therapist_id) throw new Error("therapist_id is required");

    const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. All clients for this therapist
    const { data: clientes } = await sb
      .from("clientes")
      .select("id, nome, status, archetypal_profile_json")
      .eq("terapeuta_id", therapist_id);

    if (!clientes || clientes.length === 0) {
      return new Response(JSON.stringify({
        total_clientes: 0,
        distritos_frequentes: [],
        arquetipos_dominantes: [],
        padroes_recorrentes: [],
        insights_ia: null,
        recomendacoes: [],
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const clientIds = clientes.map((c: any) => c.id);

    // 2. Gather collective data in parallel
    const [cityStatesRes, patternsRes, sessionsRes, toolUsageRes, journeyDistrictsRes] = await Promise.all([
      sb.from("client_city_state").select("client_id, distrito_ativo, arquetipo_ativo").in("client_id", clientIds),
      sb.from("client_pattern_stats").select("client_id, pattern_type, pattern_name, occurrence_count").in("client_id", clientIds).order("occurrence_count", { ascending: false }).limit(100),
      sb.from("sessions").select("id, client_id, district_id, created_at, checkin_state").in("client_id", clientIds).order("created_at", { ascending: false }).limit(200),
      sb.from("co_tool_usage").select("tool_id, session_id, client_id").in("client_id", clientIds).limit(200),
      sb.from("journey_districts").select("journey_id, district_id, state, sessions_count").limit(500),
    ]);

    // 3. Aggregate districts
    const distritoCounts: Record<string, number> = {};
    (cityStatesRes.data || []).forEach((s: any) => {
      if (s.distrito_ativo) distritoCounts[s.distrito_ativo] = (distritoCounts[s.distrito_ativo] || 0) + 1;
    });
    const distritos_frequentes = Object.entries(distritoCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([nome, count]) => ({ nome, count }));

    // 4. Aggregate archetypes
    const archCounts: Record<string, number> = {};
    clientes.forEach((c: any) => {
      const arch = c.archetypal_profile_json as any;
      const nome = arch?.arquetipo_predominante?.nome;
      if (nome) archCounts[nome] = (archCounts[nome] || 0) + 1;
    });
    const arquetipos_dominantes = Object.entries(archCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([nome, count]) => ({ nome, count }));

    // 5. Aggregate patterns
    const patternAgg: Record<string, number> = {};
    (patternsRes.data || []).forEach((p: any) => {
      const key = `${p.pattern_type}::${p.pattern_name}`;
      patternAgg[key] = (patternAgg[key] || 0) + p.occurrence_count;
    });
    const padroes_recorrentes = Object.entries(patternAgg)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([key, count]) => {
        const [type, name] = key.split("::");
        return { type, name, count };
      });

    // 6. Aggregate tool usage
    const toolCounts: Record<string, number> = {};
    (toolUsageRes.data || []).forEach((t: any) => {
      if (t.tool_id) toolCounts[t.tool_id] = (toolCounts[t.tool_id] || 0) + 1;
    });

    // 7. Aggregate journey states
    const stateAgg = { ativo: 0, integrado: 0, inativo: 0 };
    (journeyDistrictsRes.data || []).forEach((jd: any) => {
      if (jd.state === "ativo") stateAgg.ativo++;
      else if (jd.state === "integrado") stateAgg.integrado++;
      else stateAgg.inativo++;
    });

    // 8. Checkin states
    const checkinCounts: Record<string, number> = {};
    (sessionsRes.data || []).forEach((s: any) => {
      if (s.checkin_state) checkinCounts[s.checkin_state] = (checkinCounts[s.checkin_state] || 0) + 1;
    });

    // Build context for AI
    const contextSummary = `
TOTAL CLIENTES: ${clientes.length}
STATUS: ${clientes.filter((c: any) => c.status === 'ativo').length} ativas, ${clientes.filter((c: any) => c.status !== 'ativo').length} outras

DISTRITOS MAIS FREQUENTES: ${distritos_frequentes.slice(0, 8).map(d => `${d.nome} (${d.count})`).join(", ") || "nenhum"}

ARQUÉTIPOS DOMINANTES: ${arquetipos_dominantes.slice(0, 6).map(a => `${a.nome} (${a.count})`).join(", ") || "nenhum"}

PADRÕES RECORRENTES: ${padroes_recorrentes.slice(0, 10).map(p => `${p.name} [${p.type}] (${p.count}x)`).join("; ") || "nenhum"}

ESTADOS DE CHECKIN: ${Object.entries(checkinCounts).sort((a, b) => b[1] - a[1]).map(([s, c]) => `${s}: ${c}`).join(", ") || "nenhum"}

JORNADAS: ${stateAgg.ativo} distritos ativos, ${stateAgg.integrado} integrados, ${stateAgg.inativo} inativos
`;

    const systemPrompt = `Você é a Voz Sistêmica da CidaDELA, uma inteligência simbólica que analisa o CAMPO COLETIVO das clientes de uma terapeuta. Você NÃO diagnostica. Você fala em linguagem de hipótese ("parece", "sugere", "pode indicar"). Nunca use termos clínicos diagnósticos. Mantenha o tom poético mas preciso. Responda SEMPRE em JSON:

{
  "visao_do_campo": "Parágrafo de 3-5 frases descrevendo o panorama coletivo das clientes — distritos dominantes, padrões emocionais recorrentes, energia geral do campo",
  "padroes_coletivos": ["Array de 3-4 padrões coletivos identificados, cada um em 1-2 frases"],
  "alertas_campo": ["Array de 1-2 alertas sobre travas coletivas, riscos de projeção ou saturação em distritos"],
  "recomendacoes": [
    {"tipo": "grupo", "titulo": "...", "descricao": "sugestão de prática em grupo"},
    {"tipo": "tema", "titulo": "...", "descricao": "tema para encontro ou clube do livro"},
    {"tipo": "ferramenta", "titulo": "...", "descricao": "ferramenta que funciona melhor com este público"}
  ],
  "pergunta_reflexiva": "Uma pergunta-mãe para a terapeuta refletir sobre seu campo"
}

IMPORTANTE: Use linguagem simbólica, não clínica. Não invente dados.`;

    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: contextSummary },
        ],
        temperature: 0.7,
        max_tokens: 1200,
      }),
    });

    let insights_ia = null;
    if (aiResponse.ok) {
      const aiResult = await aiResponse.json();
      const content = aiResult.choices?.[0]?.message?.content || "{}";
      try {
        const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        insights_ia = JSON.parse(cleaned);
      } catch {
        insights_ia = { visao_do_campo: content, padroes_coletivos: [], alertas_campo: [], recomendacoes: [], pergunta_reflexiva: "" };
      }
    }

    return new Response(JSON.stringify({
      total_clientes: clientes.length,
      clientes_ativas: clientes.filter((c: any) => c.status === "ativo").length,
      distritos_frequentes,
      arquetipos_dominantes,
      padroes_recorrentes,
      checkin_states: checkinCounts,
      journey_states: stateAgg,
      insights_ia,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("campo-das-clientes error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
