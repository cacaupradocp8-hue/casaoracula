import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface BussolaInput {
  client_id: string;
  session_id?: string;
  trigger_type: "ferramenta" | "tiragem" | "sessao" | "manual";
  fase_jornada?: "inicio" | "travessia" | "integracao";
  modo_sessao?: "oracula" | "livre";
  last_tool_id?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify user
    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const input: BussolaInput = await req.json();
    const { client_id, session_id, trigger_type, fase_jornada, modo_sessao, last_tool_id } = input;

    if (!client_id) {
      return new Response(JSON.stringify({ error: "client_id obrigatório" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. Gather client state
    const [cityStateRes, archStateRes, toolsRes, flowsRes, toolDistrictsRes, rulesRes] = await Promise.all([
      supabase.from("client_city_state").select("*").eq("client_id", client_id).maybeSingle(),
      supabase.from("client_archetype_state").select("*").eq("client_id", client_id).maybeSingle(),
      supabase.from("tools").select("id, nome, categoria_metodo, proximo_passo_id, nivel, ambiente, slug, funcao_principal, quando_usar").eq("ativa", true).order("ordem"),
      supabase.from("co_tool_flows").select("*").order("ordem"),
      supabase.from("tool_districts").select("tool_id, district_id, tipo, district:city_districts(id, nome)"),
      supabase.from("cartographer_rules").select("*").eq("ativa", true).order("prioridade", { ascending: false }),
    ]);

    const cityState = cityStateRes.data;
    const archState = archStateRes.data;
    const tools = toolsRes.data || [];
    const flows = flowsRes.data || [];
    const toolDistricts = toolDistrictsRes.data || [];
    const rules = rulesRes.data || [];

    // Build lookup maps
    const toolById = new Map(tools.map((t: any) => [t.id, t]));
    const toolPrincipalDistrict = new Map<string, string>();
    for (const td of toolDistricts) {
      if (td.tipo === "principal" && (td as any).district?.nome) {
        toolPrincipalDistrict.set(td.tool_id, (td as any).district.nome);
      }
    }

    // 2. Determine phase
    const phase = fase_jornada || inferPhase(cityState, tools);

    // Build slug lookup
    const toolBySlug = new Map(tools.map((t: any) => [t.slug, t]));
    const lastTool = last_tool_id ? toolById.get(last_tool_id) : null;

    // 3. Try cartographer_rules first (database-driven rules)
    let toolPrincipal: any = null;
    let toolComplementar: any = null;
    let distritoSugerido = cityState?.distrito_ativo || null;
    let perguntaFromRule: string | null = null;
    let ritualFromRule: string | null = null;
    let confiancaFromRule: number | null = null;

    const matchedRule = matchRule(rules, {
      distrito: distritoSugerido,
      arquetipo: archState?.arquitipo_regente_id || null,
      torre: null,
      porta: null,
      ferramenta_origem_slug: lastTool?.slug || null,
      fase_jornada: phase,
    });

    if (matchedRule) {
      toolPrincipal = toolBySlug.get(matchedRule.ferramenta_principal_slug) || null;
      toolComplementar = matchedRule.ferramenta_complementar_slug
        ? toolBySlug.get(matchedRule.ferramenta_complementar_slug) || null
        : null;
      if (matchedRule.pergunta) perguntaFromRule = matchedRule.pergunta;
      if (matchedRule.ritual) ritualFromRule = matchedRule.ritual;
      confiancaFromRule = matchedRule.confianca_base;
    }

    // Fallback: Rule 1 — last tool's principal district
    if (!distritoSugerido && last_tool_id && toolPrincipalDistrict.has(last_tool_id)) {
      distritoSugerido = toolPrincipalDistrict.get(last_tool_id)!;
    }

    // Fallback: proximo_passo from methodology
    if (!toolPrincipal && lastTool?.proximo_passo_id) {
      toolPrincipal = toolById.get(lastTool.proximo_passo_id) || null;
    }

    // Fallback: phase-based selection
    if (!toolPrincipal) {
      toolPrincipal = selectByPhase(phase, tools, cityState);
    }

    // Fallback: complementar from flows
    if (toolPrincipal && !toolComplementar) {
      const complementarFlow = flows.find(
        (f: any) => f.tool_origem_id === toolPrincipal.id && f.tipo === "complementar"
      );
      if (complementarFlow) {
        toolComplementar = toolById.get(complementarFlow.tool_destino_id) || null;
      }
    }

    // 5. Generate clinical question (rule override or fallback)
    const pergunta = perguntaFromRule || generateQuestion(phase, distritoSugerido, archState);

    // 6. Suggest ritual (rule override or fallback)
    const ritual = ritualFromRule || suggestRitual(phase, distritoSugerido);

    // 7. Calculate confidence (rule override or fallback)
    const confianca = confiancaFromRule || calculateConfidence(
      toolPrincipal,
      distritoSugerido,
      last_tool_id,
      phase
    );

    // 8. Save engine record
    const { data: engineData, error: engineError } = await supabase
      .from("cartographer_engine")
      .insert({
        client_id,
        session_id: session_id || null,
        therapist_id: user.id,
        trigger_type,
        fase_jornada: phase,
        modo_sessao: modo_sessao || "oracula",
        distrito_ativo: distritoSugerido,
        torre_ativa: null,
        porta_ativa: null,
        arquetipo_regente_id: archState?.arquitipo_regente_id || null,
        input_snapshot: { last_tool_id, cityState, archState },
      })
      .select("id")
      .single();

    if (engineError) {
      console.error("Engine insert error:", engineError);
      return new Response(JSON.stringify({ error: "Erro ao criar motor" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 9. Save recommendation
    const { data: recoData, error: recoError } = await supabase
      .from("cartographer_recommendations")
      .insert({
        engine_id: engineData.id,
        tool_principal_id: toolPrincipal?.id || null,
        tool_complementar_id: toolComplementar?.id || null,
        distrito_sugerido: distritoSugerido,
        arquetipo_sugerido: archState?.arquitipo_regente_id || null,
        pergunta_sugerida: pergunta,
        ritual_sugerido: ritual,
        confianca,
      })
      .select("*")
      .single();

    if (recoError) {
      console.error("Recommendation insert error:", recoError);
    }

    const result = {
      engine_id: engineData.id,
      recommendation_id: recoData?.id,
      distrito_sugerido: distritoSugerido,
      tool_principal: toolPrincipal ? { id: toolPrincipal.id, nome: toolPrincipal.nome, slug: toolPrincipal.slug } : null,
      tool_complementar: toolComplementar ? { id: toolComplementar.id, nome: toolComplementar.nome, slug: toolComplementar.slug } : null,
      pergunta_sugerida: pergunta,
      ritual_sugerido: ritual,
      confianca,
      fase_jornada: phase,
      modo_sessao: modo_sessao || "oracula",
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Bússola error:", error);
    return new Response(JSON.stringify({ error: "Erro interno" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

// --- Helper functions ---

function inferPhase(cityState: any, tools: any[]): string {
  if (!cityState || !cityState.ultima_ferramenta_id) return "inicio";
  
  const lastTool = tools.find((t: any) => t.id === cityState.ultima_ferramenta_id);
  if (!lastTool) return "inicio";

  const cat = lastTool.categoria_metodo;
  if (["diagnostico_simbolico"].includes(cat)) return "inicio";
  if (["conducao_terapeutica", "leitura_profunda", "estruturas_sobrevivencia", "identidade_arquetipica"].includes(cat)) return "travessia";
  if (["integracao", "cartografia_jornada"].includes(cat)) return "integracao";
  return "travessia";
}

function selectByPhase(phase: string, tools: any[], cityState: any): any {
  const catMap: Record<string, string[]> = {
    inicio: ["diagnostico_simbolico"],
    travessia: ["conducao_terapeutica", "leitura_profunda", "estruturas_sobrevivencia"],
    integracao: ["integracao", "cartografia_jornada"],
  };

  const categories = catMap[phase] || catMap.travessia;
  const candidates = tools.filter(
    (t: any) => categories.includes(t.categoria_metodo) && t.ambiente === "maquinas" && t.id !== cityState?.ultima_ferramenta_id
  );

  return candidates[0] || null;
}

function generateQuestion(phase: string, distrito: string | null, archState: any): string {
  const questions: Record<string, string[]> = {
    inicio: [
      "O que traz essa mulher até aqui, agora?",
      "Qual o campo emocional predominante neste momento?",
      "O que ela já tentou fazer com isso que sente?",
    ],
    travessia: [
      "O que está sendo evitado nesta jornada?",
      "Que imagem surge quando ela pensa no que precisa enfrentar?",
      "Onde esse padrão aparece no cotidiano?",
    ],
    integracao: [
      "O que ela aprendeu sobre si mesma neste percurso?",
      "Que gesto simbólico poderia marcar esta passagem?",
      "O que ela leva consigo desta travessia?",
    ],
  };

  const pool = questions[phase] || questions.travessia;
  return pool[Math.floor(Math.random() * pool.length)];
}

function suggestRitual(phase: string, distrito: string | null): string {
  const rituals: Record<string, string[]> = {
    inicio: [
      "Ritual de Abertura do Campo: acender uma vela e nomear a intenção",
      "Gesto de chegada: respiração com as mãos no coração",
    ],
    travessia: [
      "Ritual da Travessia: escrever o medo numa folha e dobrá-la",
      "Gesto do limiar: cruzar simbolicamente um portal imaginado",
    ],
    integracao: [
      "Ritual de Integração: desenhar o símbolo que surgiu na jornada",
      "Gesto de plantio: escolher uma semente para o novo ciclo",
    ],
  };

  const pool = rituals[phase] || rituals.travessia;
  return pool[Math.floor(Math.random() * pool.length)];
}

function calculateConfidence(
  toolPrincipal: any,
  distrito: string | null,
  lastToolId: string | undefined,
  phase: string
): number {
  let score = 50;

  // Has next step from methodology → high confidence
  if (toolPrincipal && lastToolId) {
    score += 25;
  }

  // Has district context
  if (distrito) score += 10;

  // Clear phase
  if (phase !== "inicio") score += 5;

  return Math.min(score, 95);
}

interface RuleContext {
  distrito: string | null;
  arquetipo: string | null;
  torre: string | null;
  porta: string | null;
  ferramenta_origem_slug: string | null;
  fase_jornada: string;
}

function matchRule(rules: any[], ctx: RuleContext): any | null {
  // 1. Collect all matching rules
  const matched = rules.filter((rule) => {
    if (rule.distrito && rule.distrito !== ctx.distrito) return false;
    if (rule.arquetipo && rule.arquetipo !== ctx.arquetipo) return false;
    if (rule.torre && rule.torre !== ctx.torre) return false;
    if (rule.porta && rule.porta !== ctx.porta) return false;
    if (rule.ferramenta_origem_slug && rule.ferramenta_origem_slug !== ctx.ferramenta_origem_slug) return false;
    if (rule.fase_jornada && rule.fase_jornada !== ctx.fase_jornada) return false;
    return true;
  });

  if (matched.length === 0) return null;

  // 2. Sort by priority DESC, then confidence DESC
  matched.sort((a, b) => {
    const prioDiff = (b.prioridade || 0) - (a.prioridade || 0);
    if (prioDiff !== 0) return prioDiff;
    return (b.confianca_base || 0) - (a.confianca_base || 0);
  });

  // 3. Return best match
  return matched[0];
}
