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

    const { client_id } = await req.json();
    if (!client_id) throw new Error("client_id is required");

    const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Gather client data
    const [clienteRes, journeysRes, patternsRes, sessionsRes] = await Promise.all([
      sb.from("clientes").select("nome, archetypal_profile_json").eq("id", client_id).single(),
      sb.from("journeys").select("id").eq("client_id", client_id).limit(1),
      sb.from("client_pattern_stats").select("pattern_type, pattern_name, occurrence_count").eq("client_id", client_id).order("occurrence_count", { ascending: false }).limit(20),
      sb.from("sessions").select("id, district_id, created_at, checkin_state, checkin_notes").eq("client_id", client_id).order("created_at", { ascending: false }).limit(10),
    ]);

    let districtsData: any[] = [];
    if (journeysRes.data?.length) {
      const { data: jd } = await sb
        .from("journey_districts")
        .select("district_id, state, sessions_count, notes")
        .eq("journey_id", journeysRes.data[0].id);

      if (jd?.length) {
        const distIds = jd.map((j: any) => j.district_id);
        const { data: dists } = await sb.from("districts").select("id, nome").in("id", distIds);
        const nameMap = Object.fromEntries((dists || []).map((d: any) => [d.id, d.nome]));
        districtsData = jd.map((j: any) => ({
          nome: nameMap[j.district_id] || "Desconhecido",
          state: j.state,
          sessions_count: j.sessions_count,
          notes: j.notes,
        }));
      }
    }

    const ativos = districtsData.filter((d: any) => d.state === "ativo");
    const integrados = districtsData.filter((d: any) => d.state === "integrado");
    const inativos = districtsData.filter((d: any) => d.state === "inativo");
    const patterns = patternsRes.data || [];
    const archProfile = clienteRes.data?.archetypal_profile_json as any;

    const contextSummary = `
CLIENTE: ${clienteRes.data?.nome || "Desconhecido"}
DISTRITOS ATIVOS (${ativos.length}): ${ativos.map((d: any) => d.nome).join(", ") || "nenhum"}
DISTRITOS INTEGRADOS (${integrados.length}): ${integrados.map((d: any) => d.nome).join(", ") || "nenhum"}
DISTRITOS INATIVOS (${inativos.length}): ${inativos.map((d: any) => d.nome).join(", ") || "nenhum"}
PADRÕES RECORRENTES: ${patterns.slice(0, 8).map((p: any) => `${p.pattern_name} (${p.pattern_type}, ${p.occurrence_count}x)`).join("; ") || "nenhum"}
ARQUÉTIPO PREDOMINANTE: ${archProfile?.arquetipo_predominante?.nome || "não identificado"}
ARQUÉTIPO SOMBRA: ${archProfile?.arquetipo_sombra?.nome || "não identificado"}
ÚLTIMAS SESSÕES: ${(sessionsRes.data || []).slice(0, 5).map((s: any) => `${new Date(s.created_at).toLocaleDateString("pt-BR")} - checkin: ${s.checkin_state || "?"}`).join("; ") || "nenhuma"}
NOTAS DOS DISTRITOS ATIVOS: ${ativos.filter((d: any) => d.notes).map((d: any) => `${d.nome}: ${d.notes}`).join("; ") || "sem notas"}
`;

    const systemPrompt = `Você é a Voz da CidaDELA, uma inteligência simbólica que observa o mapa psíquico de uma cliente em terapia simbólica. Você NÃO diagnostica. Você fala em linguagem de hipótese ("parece", "sugere", "pode indicar"). Nunca use termos clínicos diagnósticos (DSM, CID). Mantenha o tom poético mas preciso. Responda SEMPRE em JSON com exatamente 3 campos:

{
  "voz_cidadela": "Um parágrafo de 2-4 frases descrevendo o estado geral da psique com base nos distritos ativos/inativos e padrões",
  "proximo_limiar": "Uma sugestão de Porta, Distrito ou Travessia como próximo passo, com breve justificativa simbólica",
  "conexoes_simbolicas": ["Array de 2-3 insights curtos correlacionando elementos (torres, portas, arquétipos, labirintos)"]
}

IMPORTANTE: Use linguagem simbólica, não clínica. Mantenha cada insight em no máximo 2 frases. Não invente dados que não estão no contexto.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: contextSummary },
        ],
        temperature: 0.7,
        max_tokens: 800,
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

    // Parse JSON from AI response (may be wrapped in markdown code block)
    let parsed;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = {
        voz_cidadela: content,
        proximo_limiar: "Não foi possível gerar sugestão neste momento.",
        conexoes_simbolicas: [],
      };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("mapa-vivo-insights error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
