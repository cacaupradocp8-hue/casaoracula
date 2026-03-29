import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Usuário não autenticado" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = user.id;

    // 1. Gather feedback data (last 50 interactions)
    const { data: feedbacks } = await supabase
      .from("co_mentora_feedback")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);

    // 2. Gather session data
    const { data: sessions } = await supabase
      .from("sessoes_casa_maquinas")
      .select("*")
      .eq("owner_id", userId)
      .order("created_at", { ascending: false })
      .limit(30);

    // 3. Gather tool usage from co_city_history
    const { data: toolHistory } = await supabase
      .from("co_city_history")
      .select("tool_id, distrito, evento, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    // 4. Build analysis context
    const feedbackList = feedbacks || [];
    const sessionList = sessions || [];

    const totalSugestoes = feedbackList.length;
    const sugestoesUsadas = feedbackList.filter(f => f.sugestao_utilizada).length;
    const taxaAceitacao = totalSugestoes > 0 ? Math.round((sugestoesUsadas / totalSugestoes) * 100) : 0;

    // Count tool preferences
    const toolCounts: Record<string, number> = {};
    const toolIgnored: Record<string, number> = {};
    const districtCounts: Record<string, number> = {};

    for (const f of feedbackList) {
      if (f.ferramenta_escolhida) {
        toolCounts[f.ferramenta_escolhida] = (toolCounts[f.ferramenta_escolhida] || 0) + 1;
      }
      if (f.ferramenta_sugerida && !f.sugestao_utilizada) {
        toolIgnored[f.ferramenta_sugerida] = (toolIgnored[f.ferramenta_sugerida] || 0) + 1;
      }
    }

    for (const h of (toolHistory || [])) {
      if (h.distrito) {
        districtCounts[h.distrito] = (districtCounts[h.distrito] || 0) + 1;
      }
    }

    const ferramentasPreferidas = Object.entries(toolCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name);

    const ferramentasEvitadas = Object.entries(toolIgnored)
      .filter(([name]) => !toolCounts[name])
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name]) => name);

    const distritosFrequentes = Object.entries(districtCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name);

    // 5. Use AI to generate profile analysis
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY não configurada");

    const analysisPrompt = `Analise o perfil de condução clínica desta terapeuta com base nos dados abaixo.

DADOS:
- Total de sessões: ${sessionList.length}
- Total de consultas à mentora: ${totalSugestoes}
- Taxa de aceitação de sugestões: ${taxaAceitacao}%
- Ferramentas mais usadas: ${ferramentasPreferidas.join(", ") || "dados insuficientes"}
- Ferramentas evitadas: ${ferramentasEvitadas.join(", ") || "nenhuma padrão"}
- Distritos frequentes: ${distritosFrequentes.join(", ") || "dados insuficientes"}

Retorne um JSON com EXATAMENTE esta estrutura (sem markdown, sem code blocks):
{
  "estilo_conducao": "exploratório|diretivo|contemplativo|integrativo",
  "linguagem": "simbólica|direta|poética|clínica",
  "nivel_profundidade": "superficial|médio|profundo|imersivo",
  "padrao_decisao": "intuitivo|analítico|guiado|autônomo",
  "pontos_fortes": ["máximo 3 itens curtos"],
  "pontos_cegos": ["máximo 3 itens curtos"],
  "insight_sessao": "Uma frase contemplativa de feedback para a terapeuta sobre seu estilo de condução. Não diagnóstica. Tom de mentora."
}

Se dados insuficientes, use valores padrão sensatos e diga no insight que o perfil está em construção.`;

    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "Você é uma IA analítica que perfila terapeutas. Retorne SOMENTE JSON válido, sem markdown." },
          { role: "user", content: analysisPrompt },
        ],
        temperature: 0.5,
        max_tokens: 600,
      }),
    });

    if (!aiResponse.ok) {
      console.error("OpenAI error:", await aiResponse.text());
      throw new Error("Erro na análise de perfil");
    }

    const aiData = await aiResponse.json();
    const rawContent = aiData.choices?.[0]?.message?.content || "{}";
    
    // Clean potential markdown wrapping
    const cleanJson = rawContent.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    let profileData;
    try {
      profileData = JSON.parse(cleanJson);
    } catch {
      profileData = {
        estilo_conducao: "exploratório",
        linguagem: "simbólica",
        nivel_profundidade: "médio",
        padrao_decisao: "intuitivo",
        pontos_fortes: ["Perfil em construção"],
        pontos_cegos: ["Dados insuficientes"],
        insight_sessao: "Seu perfil de condução está sendo construído. Continue utilizando as ferramentas para que a Mentora aprenda seu estilo.",
      };
    }

    // 6. Upsert profile
    const { error: upsertError } = await supabase
      .from("co_therapist_profile")
      .upsert({
        user_id: userId,
        estilo_conducao: profileData.estilo_conducao,
        linguagem: profileData.linguagem,
        nivel_profundidade: profileData.nivel_profundidade,
        padrao_decisao: profileData.padrao_decisao,
        ferramentas_preferidas: ferramentasPreferidas,
        ferramentas_evitadas: ferramentasEvitadas,
        distritos_frequentes: distritosFrequentes,
        pontos_fortes: profileData.pontos_fortes || [],
        pontos_cegos: profileData.pontos_cegos || [],
        total_sessoes: sessionList.length,
        total_consultas_mentora: totalSugestoes,
        tendencias_json: {
          taxa_aceitacao: taxaAceitacao,
          tool_counts: toolCounts,
          district_counts: districtCounts,
        },
        ultima_analise: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

    if (upsertError) {
      console.error("Upsert error:", upsertError);
      throw upsertError;
    }

    // 7. Generate insight if enough data
    if (profileData.insight_sessao && totalSugestoes >= 3) {
      await supabase.from("co_mentora_insights").insert({
        user_id: userId,
        tipo: "perfil",
        titulo: "Reflexão sobre seu estilo de condução",
        descricao: profileData.insight_sessao,
        baseado_em: { sessoes: sessionList.length, consultas: totalSugestoes },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      profile: profileData,
      stats: { totalSessoes: sessionList.length, totalConsultas: totalSugestoes, taxaAceitacao },
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-therapist-profile error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
