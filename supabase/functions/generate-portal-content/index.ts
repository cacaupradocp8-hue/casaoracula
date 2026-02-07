import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ============================================
// GENERATE PORTAL CONTENT — Ateliê de Conteúdo
// Edge Function for generating course content using AI
// ============================================

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface GenerateRequest {
  jornada: string;
  portal: string;
  objetivo: string;
  ideias_chave: string;
  tom: string;
  duracao?: string;
  template_id?: string;
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
    const { jornada, portal, objetivo, ideias_chave, tom, duracao, template_id }: GenerateRequest = await req.json();

    // Validate required fields
    if (!jornada || !portal || !objetivo || !ideias_chave || !tom) {
      return new Response(
        JSON.stringify({ error: "Campos obrigatórios: jornada, portal, objetivo, ideias_chave, tom" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get template (default if not specified)
    let templateContent = "";
    if (template_id) {
      const { data: template } = await supabase
        .from("atelie_templates")
        .select("template_content")
        .eq("id", template_id)
        .single();
      if (template) {
        templateContent = template.template_content;
      }
    } else {
      const { data: defaultTemplate } = await supabase
        .from("atelie_templates")
        .select("template_content")
        .eq("is_default", true)
        .single();
      if (defaultTemplate) {
        templateContent = defaultTemplate.template_content;
      }
    }

    console.log(`[generate-portal-content] Generating content for portal: ${portal}`);

    // Build the prompt
    const systemPrompt = `Você é uma especialista em criação de conteúdo pedagógico para formação terapêutica e simbólica.

Você cria Portais/Aulas para a Casa Orácula, uma escola de formação em Terapia Arquetípica e Narroterapia Oracular.

REGRAS ABSOLUTAS:
- NÃO resumir livros
- NÃO citar autores
- NÃO usar linguagem diagnóstica ou determinista
- Sustentar profundidade com clareza
- Incluir prática possível, aplicação profissional e cuidado ético
- Escrever em português brasileiro, com tom ${tom}

${templateContent}`;

    const userPrompt = `Crie um Portal/Aula completo com os seguintes dados:

**Jornada:** ${jornada}
**Portal:** ${portal}
**Objetivo do Portal:** ${objetivo}
**Ideias-chave (matéria-prima autoral):** ${ideias_chave}
**Tom desejado:** ${tom}
${duracao ? `**Duração sugerida:** ${duracao}` : ""}

Gere o conteúdo seguindo EXATAMENTE o formato do template, com todas as 7 seções.`;

    // Call Lovable AI Gateway
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("[generate-portal-content] LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY não configurada" }),
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
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 4096,
      }),
    });

    // Handle API errors
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[generate-portal-content] AI error ${response.status}:`, errorText);

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
        JSON.stringify({ error: `Erro na geração: ${response.status}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error("[generate-portal-content] Empty response from AI");
      return new Response(
        JSON.stringify({ error: "Resposta vazia da IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse content into sections
    const sections = parseContentToSections(content);

    console.log(`[generate-portal-content] Success - Generated ${Object.keys(sections).length} sections`);

    // Return response
    return new Response(
      JSON.stringify({
        raw_content: content,
        sections,
        usage: data.usage,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("[generate-portal-content] Error:", error);
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
    { key: "registro_etico", pattern: /###?\s*7\)\s*REGISTRO ÉTICO.*\n([\s\S]*?)$/i },
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
