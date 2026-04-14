import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
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

    // Authenticate user
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await anonClient.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Não autenticada" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch user's cidadela estado
    const { data: estado } = await supabase
      .from("user_cidadela_estado")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    // Fetch user profile for context
    const { data: profile } = await supabase
      .from("profiles")
      .select("nome, portal")
      .eq("id", user.id)
      .single();

    // Fetch recent training progress
    const { data: recentProgress } = await supabase
      .from("co_sim_progress")
      .select("case_id, step_id, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      // Fallback sem IA
      return new Response(JSON.stringify(buildFallbackStep(estado)), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `Você é Sintheya, a inteligência orquestradora da Casa Orácula. Você organiza o pensamento clínico e orienta a jornada da usuária. Seu tom é direto, profissional e acolhedor — sem misticismo vago.

Analise o estado atual da usuária e sugira o próximo passo mais coerente.

MÓDULOS DISPONÍVEIS:
- "treinamento": Sala de Treinamento (prática com casos clínicos fictícios)
- "clube": Clube de Leitura (travessias simbólicas com livros)
- "sessao": Casa das Máquinas (condução de sessões clínicas reais)
- "cartografia": Cartografia Psíquica (autoconhecimento e mapeamento)

REGRAS:
- Se a usuária nunca fez cartografia → sugerir cartografia
- Se tem distrito ativo mas poucas competências → sugerir treinamento
- Se tem boa taxa de acerto (>70%) → sugerir avançar no clube ou sessão
- Se taxa baixa (<50%) → sugerir mais treinamento
- Se está há muito tempo sem atividade → sugerir retorno suave

Retorne EXATAMENTE este JSON (sem markdown):
{
  "proxima_acao": "treinamento" | "clube" | "sessao" | "cartografia",
  "sugestao": "texto curto e direto (1-2 frases)",
  "ferramenta": "nome da ferramenta sugerida ou null",
  "urgencia": "baixa" | "media" | "alta"
}`;

    const userContext = JSON.stringify({
      voz: estado?.voz || null,
      distrito_atual: estado?.distrito_atual || null,
      distritos_ativados: estado?.distritos_ativados || [],
      competencias: estado?.competencias || {},
      historico_travessias: (estado?.historico_travessias || []).length,
      ultimo_movimento: estado?.ultimo_movimento || null,
      portal: profile?.portal || "visitante",
      treinos_recentes: (recentProgress || []).length,
    });

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Estado da usuária:\n${userContext}\n\nQual o próximo passo mais coerente?` },
        ],
        temperature: 1,
        max_completion_tokens: 300,
      }),
    });

    if (!aiResponse.ok) {
      console.error("AI gateway error:", aiResponse.status, await aiResponse.text());
      return new Response(JSON.stringify(buildFallbackStep(estado)), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    let content = aiData.choices?.[0]?.message?.content || "";
    content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    try {
      const result = JSON.parse(content);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch {
      console.error("Failed to parse AI response:", content);
      return new Response(JSON.stringify(buildFallbackStep(estado)), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (e) {
    console.error("sintheya-next-step error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function buildFallbackStep(estado: any) {
  if (!estado || !estado.distrito_atual) {
    return {
      proxima_acao: "cartografia",
      sugestao: "Inicie sua jornada pela Cartografia Psíquica para revelar sua CidaDELA.",
      ferramenta: "Cartografia Psíquica Orácula",
      urgencia: "alta",
    };
  }

  const comp = estado.competencias || {};
  const totalTentativas = Object.values(comp).reduce(
    (sum: number, c: any) => sum + (c?.tentativas || 0), 0
  );
  const totalAcertos = Object.values(comp).reduce(
    (sum: number, c: any) => sum + (c?.acertos || 0), 0
  );
  const taxa = totalTentativas > 0 ? totalAcertos / totalTentativas : 0;

  if (totalTentativas < 3) {
    return {
      proxima_acao: "treinamento",
      sugestao: `Pratique sua leitura clínica no distrito "${estado.distrito_atual}".`,
      ferramenta: null,
      urgencia: "media",
    };
  }

  if (taxa >= 0.7) {
    return {
      proxima_acao: "clube",
      sugestao: "Você está pronta para avançar na sua travessia.",
      ferramenta: null,
      urgencia: "baixa",
    };
  }

  return {
    proxima_acao: "treinamento",
    sugestao: "Refine sua leitura clínica com mais casos práticos.",
    ferramenta: null,
    urgencia: "media",
  };
}
