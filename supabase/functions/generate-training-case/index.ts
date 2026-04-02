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
    // Auth check - only admins
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

    // Verify admin
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await anonClient.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Não autenticada" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("portal")
      .eq("user_id", user.id)
      .single();

    if (roleData?.portal !== "admin") {
      return new Response(JSON.stringify({ error: "Acesso restrito a administradores" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { tema, tipo, nivel } = await req.json();

    if (!tema || !tipo || !nivel) {
      return new Response(JSON.stringify({ error: "tema, tipo e nivel são obrigatórios" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: "OPENAI_API_KEY não configurada" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `Você é uma supervisora clínica do Método Orácula — uma abordagem terapêutica simbólica baseada em arquétipos femininos, CidaDELA e leitura simbólica.

Sua tarefa é criar um caso de estudo para o Simulador Interativo de Condução Terapêutica.

REGRAS:
- O caso deve ser realista e pedagogicamente rico
- As opções devem ter feedback simbólico e pedagógico (nunca binário certo/errado)
- O feedback deve ensinar sem punir
- A linguagem deve ser clínica mas acessível
- O tipo "${tipo}" define o contexto: "individual" = sessão individual, "grupo" = círculo de mulheres/grupo terapêutico, "misto" = ambos
- Nível ${nivel}: ${nivel === 1 ? 'básico, situações mais claras' : nivel === 2 ? 'intermediário, nuances maiores' : 'avançado, alta complexidade clínica'}

Retorne EXATAMENTE este JSON (sem markdown, sem backticks):
{
  "titulo": "título do caso (frase curta e evocativa)",
  "descricao": "descrição do cenário clínico (2-3 frases)",
  "leitura_mentora": "leitura simbólica profunda da situação (3-4 frases)",
  "ferramenta_sugerida": "nome da ferramenta do Método Orácula sugerida",
  "steps": [
    {
      "ordem": 1,
      "situacao_texto": "fala da cliente ou descrição da situação (1-2 frases, entre aspas se for fala direta)",
      "pergunta": "pergunta para a facilitadora (ex: 'O que você faz?')",
      "objetivo_oculto": "o que esta etapa avalia na facilitadora",
      "opcoes": [
        {
          "texto_opcao": "descrição da ação da facilitadora",
          "tipo_resultado": "correto",
          "feedback_texto": "consequência emocional/relacional da escolha (2-3 frases)",
          "explicacao_simbolica": "leitura simbólica da dinâmica ativada (2-3 frases)",
          "ordem": 1
        },
        {
          "texto_opcao": "...",
          "tipo_resultado": "parcial",
          "feedback_texto": "...",
          "explicacao_simbolica": "...",
          "ordem": 2
        },
        {
          "texto_opcao": "...",
          "tipo_resultado": "erro",
          "feedback_texto": "...",
          "explicacao_simbolica": "...",
          "ordem": 3
        }
      ]
    }
  ]
}`;

    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Crie um caso de estudo sobre o tema: "${tema}"` },
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("OpenAI error:", aiResponse.status, errText);
      return new Response(JSON.stringify({ error: "Erro ao gerar caso com IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    let content = aiData.choices?.[0]?.message?.content || "";
    
    // Clean markdown fences if present
    content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    let caseData;
    try {
      caseData = JSON.parse(content);
    } catch {
      console.error("Failed to parse AI response:", content);
      return new Response(JSON.stringify({ error: "IA retornou formato inválido. Tente novamente." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get next ordem
    const { data: lastCase } = await supabase
      .from("co_sim_cases")
      .select("ordem")
      .order("ordem", { ascending: false })
      .limit(1)
      .single();

    const nextOrdem = (lastCase?.ordem || 0) + 1;

    // Insert case
    const { data: newCase, error: caseError } = await supabase
      .from("co_sim_cases")
      .insert({
        titulo: caseData.titulo,
        descricao: caseData.descricao,
        nivel: Number(nivel),
        tipo,
        ativo: true,
        ordem: nextOrdem,
        leitura_mentora: caseData.leitura_mentora,
        ferramenta_sugerida: caseData.ferramenta_sugerida,
      })
      .select()
      .single();

    if (caseError) {
      console.error("Insert case error:", caseError);
      return new Response(JSON.stringify({ error: "Erro ao salvar caso" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Insert steps and options
    for (const step of caseData.steps || []) {
      const { data: newStep, error: stepError } = await supabase
        .from("co_sim_steps")
        .insert({
          case_id: newCase.id,
          ordem: step.ordem,
          situacao_texto: step.situacao_texto,
          pergunta: step.pergunta,
          objetivo_oculto: step.objetivo_oculto || null,
        })
        .select()
        .single();

      if (stepError) {
        console.error("Insert step error:", stepError);
        continue;
      }

      for (const opt of step.opcoes || []) {
        await supabase.from("co_sim_options").insert({
          step_id: newStep.id,
          texto_opcao: opt.texto_opcao,
          tipo_resultado: opt.tipo_resultado,
          feedback_texto: opt.feedback_texto,
          explicacao_simbolica: opt.explicacao_simbolica || null,
          proximo_step_id: null,
          ordem: opt.ordem,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        case_id: newCase.id,
        titulo: newCase.titulo,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    console.error("generate-training-case error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
