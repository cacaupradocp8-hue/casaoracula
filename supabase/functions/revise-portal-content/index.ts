import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ============================================
// REVISE PORTAL CONTENT — Ateliê de Conteúdo
// Edge Function for revising/refining generated content
// ============================================

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ReviseRequest {
  aula_original: string;
  tipo_revisao: string;
  conteudo_id?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Autenticação necessária" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify user is admin
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Usuário não autenticado" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check admin role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("portal")
      .eq("user_id", user.id)
      .single();

    if (roleData?.portal !== "admin") {
      return new Response(
        JSON.stringify({ error: "Acesso restrito a administradores" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request
    const { aula_original, tipo_revisao, conteudo_id }: ReviseRequest = await req.json();

    // Validate required fields
    if (!aula_original || !tipo_revisao) {
      return new Response(
        JSON.stringify({ error: "Campos obrigatórios: aula_original, tipo_revisao" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[revise-portal-content] Starting revision with focus: ${tipo_revisao}`);

    // Get revision template
    const { data: template } = await supabase
      .from("templates")
      .select("system_prompt, action_prompt")
      .eq("name", "Casa Orácula — Revisão Pedagógica")
      .eq("ativo", true)
      .single();

    if (!template) {
      console.error("[revise-portal-content] Revision template not found");
      return new Response(
        JSON.stringify({ error: "Template de revisão não encontrado" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Replace template variables
    const userPrompt = template.action_prompt
      .replace(/\{\{aula_original\}\}/g, aula_original)
      .replace(/\{\{tipo_revisao\}\}/g, tipo_revisao);

    // Call OpenAI API
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      console.error("[revise-portal-content] OPENAI_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "OPENAI_API_KEY não configurada" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: template.system_prompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.6, // Slightly lower for more consistent revisions
        max_tokens: 4096,
      }),
    });

    // Handle API errors
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[revise-portal-content] AI error ${response.status}:`, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Aguarde e tente novamente." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes. Adicione créditos ao workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: `Erro na revisão: ${response.status}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error("[revise-portal-content] Empty response from AI");
      return new Response(
        JSON.stringify({ error: "Resposta vazia da IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse revised content into sections
    const sections = parseContentToSections(content);

    console.log(`[revise-portal-content] Success - Revised ${Object.keys(sections).length} sections`);

    // Update existing content if conteudo_id provided
    if (conteudo_id) {
      const { error: updateError } = await supabase
        .from("atelie_conteudos")
        .update({
          conteudo_gerado: sections,
          status: "revisado",
          updated_at: new Date().toISOString(),
        })
        .eq("id", conteudo_id);

      if (updateError) {
        console.error("[revise-portal-content] Error updating content:", updateError);
      } else {
        console.log(`[revise-portal-content] Content ${conteudo_id} updated to 'revisado'`);
      }
    }

    // Return response
    return new Response(
      JSON.stringify({
        raw_content: content,
        sections,
        usage: data.usage,
        tipo_revisao,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("[revise-portal-content] Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Erro desconhecido",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Helper function to parse content into sections
function parseContentToSections(content: string): Record<string, string> {
  const sections: Record<string, string> = {};
  
  // Define section markers
  const sectionPatterns = [
    { key: "sentido_jornada", pattern: /###?\s*1\)\s*SENTIDO DA JORNADA\s*\n([\s\S]*?)(?=###?\s*2\)|$)/i },
    { key: "essencia_80_20", pattern: /###?\s*2\)\s*ESSÊNCIA 80\/20\s*\n([\s\S]*?)(?=###?\s*3\)|$)/i },
    { key: "raiz_psiquica", pattern: /###?\s*3\)\s*RAIZ PSÍQUICA\s*\n([\s\S]*?)(?=###?\s*4\)|$)/i },
    { key: "traducao_profissional", pattern: /###?\s*4\)\s*TRADUÇÃO PROFISSIONAL\s*\n([\s\S]*?)(?=###?\s*5\)|$)/i },
    { key: "aplicacao_pessoal", pattern: /###?\s*5\)\s*APLICAÇÃO PESSOAL\s*\n([\s\S]*?)(?=###?\s*6\)|$)/i },
    { key: "pratica_autoeficacia", pattern: /###?\s*6\)\s*PRÁTICA DE AUTOEFICÁCIA\s*\n([\s\S]*?)(?=###?\s*7\)|$)/i },
    { key: "registro_etico", pattern: /###?\s*7\)\s*REGISTRO ÉTICO.*\n([\s\S]*?)(?=###?\s*AJUSTES|$)/i },
    { key: "ajustes_realizados", pattern: /###?\s*AJUSTES REALIZADOS.*\n([\s\S]*?)$/i },
  ];

  for (const { key, pattern } of sectionPatterns) {
    const match = content.match(pattern);
    if (match) {
      sections[key] = match[1].trim();
    }
  }

  // If parsing fails, store the whole content
  if (Object.keys(sections).length === 0) {
    sections["conteudo_completo"] = content;
  }

  return sections;
}
