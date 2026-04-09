import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Você é uma especialista em facilitação de grupos terapêuticos simbólicos da Casa Orácula.

Seu papel é criar roteiros terapêuticos completos para encontros de grupo baseados em livros.

REGRAS INVIOLÁVEIS:
- Não transformar em aula teórica
- Não explicar o livro
- Não interpretar as participantes
- Foco em experiência + escuta
- Linguagem simples e aplicável
- Arquétipo é campo, não rótulo
- Sem tom acadêmico ou motivacional

Responda EXCLUSIVAMENTE em JSON válido, sem markdown, sem backticks.`;

interface GrupoTerapeutico {
  intencao_encontro: string;
  campo_psiquico_ativado: string;
  estrutura_encontro: {
    abertura: { duracao: string; objetivo: string; orientacao: string };
    ativacao: { duracao: string; objetivo: string; orientacao: string };
    compartilhamento: { duracao: string; objetivo: string; orientacao: string };
    aprofundamento: { duracao: string; objetivo: string; orientacao: string };
    integracao: { duracao: string; objetivo: string; orientacao: string };
    fechamento: { duracao: string; objetivo: string; orientacao: string };
  };
  perguntas_conducao: string[];
  dinamica_principal: { nome: string; descricao: string; instrucoes: string };
  variacoes_grupo: {
    pequeno: string;
    medio: string;
    grande: string;
  };
  alerta_grupo: string[];
  sinais_campo: string[];
  erros_comuns: string[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: isAdmin } = await supabase.rpc("is_admin", { _user_id: user.id });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { lab_id, livro_titulo, livro_autor, tema_simbolico, essencia_lab } = await req.json();

    if (!lab_id || !livro_titulo) {
      return new Response(JSON.stringify({ error: "lab_id e livro_titulo são obrigatórios" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const userPrompt = `Livro: "${livro_titulo}"${livro_autor ? ` de ${livro_autor}` : ""}
${tema_simbolico ? `Tema Simbólico: ${tema_simbolico}` : ""}
${essencia_lab ? `Essência do Lab: ${essencia_lab}` : ""}

Crie um roteiro terapêutico completo para um encontro de grupo (90–120 min) baseado neste livro.

Retorne um JSON com esta estrutura EXATA:
{
  "intencao_encontro": "o que esse encontro ativa internamente",
  "campo_psiquico_ativado": "qual conflito simbólico está em jogo",
  "estrutura_encontro": {
    "abertura": { "duracao": "10–15 min", "objetivo": "...", "orientacao": "..." },
    "ativacao": { "duracao": "20 min", "objetivo": "...", "orientacao": "..." },
    "compartilhamento": { "duracao": "30–40 min", "objetivo": "...", "orientacao": "..." },
    "aprofundamento": { "duracao": "20–30 min", "objetivo": "...", "orientacao": "..." },
    "integracao": { "duracao": "15–20 min", "objetivo": "...", "orientacao": "..." },
    "fechamento": { "duracao": "5–10 min", "objetivo": "...", "orientacao": "..." }
  },
  "perguntas_conducao": ["3 a 5 perguntas abertas, sem interpretação psicológica"],
  "dinamica_principal": {
    "nome": "nome da prática simbólica",
    "descricao": "descrição breve",
    "instrucoes": "passo a passo aplicável sem materiais complexos"
  },
  "variacoes_grupo": {
    "pequeno": "orientações para até 6 pessoas",
    "medio": "orientações para 7–15 pessoas",
    "grande": "orientações para 15+ pessoas"
  },
  "alerta_grupo": ["o que evitar durante condução"],
  "sinais_campo": ["indicadores comportamentais das participantes"],
  "erros_comuns": ["lista objetiva de falhas de condução"]
}`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 1,
        max_completion_tokens: 4000,
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit excedido. Aguarde e tente novamente." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI error [${aiResponse.status}]: ${errText}`);
    }

    const aiData = await aiResponse.json();
    let rawContent = aiData.choices?.[0]?.message?.content || "";

    // Clean markdown fences if present
    rawContent = rawContent.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();

    let grupoData: GrupoTerapeutico;
    try {
      grupoData = JSON.parse(rawContent);
    } catch {
      throw new Error("A IA retornou conteúdo inválido. Tente novamente.");
    }

    // Save to season_labs
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error: updateError } = await serviceClient
      .from("season_labs")
      .update({
        grupo_terapeutico: grupoData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", lab_id);

    if (updateError) throw new Error(`Update error: ${updateError.message}`);

    return new Response(JSON.stringify({ success: true, grupo_terapeutico: grupoData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("gerar-grupo-terapeutico error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
