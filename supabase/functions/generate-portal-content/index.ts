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
  save_draft?: boolean;
  status?: "rascunho" | "revisado" | "publicado";
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
    const { 
      jornada, portal, objetivo, ideias_chave, tom, duracao, template_id,
      save_draft = false,
      status = "rascunho"
    }: GenerateRequest = await req.json();

    // Validate required fields
    if (!jornada || !portal || !objetivo || !ideias_chave || !tom) {
      return new Response(
        JSON.stringify({ error: "Campos obrigatórios: jornada, portal, objetivo, ideias_chave, tom" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Track which template was used
    let usedTemplateId: string | null = null;

    // Get template from templates table
    let systemPrompt = "";
    let actionPrompt = "";
    
    if (template_id) {
      const { data: template } = await supabase
        .from("templates")
        .select("id, system_prompt, action_prompt")
        .eq("id", template_id)
        .eq("ativo", true)
        .single();
      if (template) {
        systemPrompt = template.system_prompt;
        actionPrompt = template.action_prompt;
        usedTemplateId = template.id;
      }
    } else {
      // Get default template
      const { data: defaultTemplate } = await supabase
        .from("templates")
        .select("id, system_prompt, action_prompt")
        .eq("is_default", true)
        .eq("ativo", true)
        .single();
      if (defaultTemplate) {
        systemPrompt = defaultTemplate.system_prompt;
        actionPrompt = defaultTemplate.action_prompt;
        usedTemplateId = defaultTemplate.id;
      }
    }

    // Fallback if no template found
    if (!systemPrompt) {
      systemPrompt = `Você está atuando como Agente de Desenvolvimento de Conteúdo da Casa Orácula.

Sua função é transformar a matéria-prima autoral fornecida em um Portal/Aula completo, seguindo rigorosamente o MÉTODO FORMATIVO DA CASA ORÁCULA.

Priorize coerência com os pilares: Jornada simbólica, Pareto 80/20, Psicologia profunda aplicada e Autoeficácia.

REGRAS OBRIGATÓRIAS:
- Não resumir livros.
- Não citar autores.
- Não usar linguagem diagnóstica ou determinista.
- Não usar academicismo excessivo.
- Não invalidar dor emocional.
- Manter profundidade com clareza.
- Sustentar aplicabilidade prática.
- Garantir separação ética entre processo pessoal e prática profissional.
- Escrever em português brasileiro, com tom ${tom}.`;
    }

    // Replace placeholders in action prompt
    let userPrompt = actionPrompt || `DADOS DE ENTRADA:
- Jornada: {{jornada}}
- Nome do Portal: {{portal}}
- Objetivo do Portal: {{objetivo}}
- Ideias-chave (matéria-prima autoral): {{ideias_chave}}
- Tom desejado: {{tom}}
- Duração sugerida: {{duracao}}

ENTREGAR EXATAMENTE NA ESTRUTURA ABAIXO:

------------------------------------------------------------

PORTAL: {{portal}}
JORNADA: {{jornada}}

### 1) SENTIDO DA JORNADA
- Contextualize simbolicamente onde este portal se insere na jornada.
- Explique o tipo de maturidade psíquica convocada.
- Inclua uma pergunta de entrada potente.

### 2) ESSÊNCIA 80/20
- Defina o núcleo vivo do tema.
- Explique a tensão psíquica central.
- Liste 3 verdades práticas e aplicáveis.
- Inclua uma frase-guia forte e memorável.

### 3) RAIZ PSÍQUICA
- Nomeie o arquétipo ativado.
- Explique o movimento psíquico envolvido.
- Ofereça uma imagem simbólica organizadora.
- Evite teoria acadêmica extensa.

### 4) TRADUÇÃO PROFISSIONAL

AULA:
- Conceito-matriz
- Objetivo pedagógico claro
- Vivência prática estruturada
- Pergunta final de fechamento

SESSÃO:
- Tema recorrente que pode emergir
- Pergunta de acesso
- Resistência provável
- Cuidado ético explícito

CÍRCULO / PALESTRA:
- Imagem ou símbolo de abertura
- Narrativa organizadora
- Convite à ação
- Encerramento ritual simples

### 5) APLICAÇÃO PESSOAL
- Onde isso pode atuar na vida da aluna?
- Que padrão comportamental observar?
- Qual gesto concreto e possível para a semana?

### 6) PRÁTICA DE AUTOEFICÁCIA
- Criar uma micro-vitória executável em 10–20 minutos.
- Explicar como a aluna saberá que funcionou.
- Garantir sensação de competência e progresso real.

### 7) REGISTRO ÉTICO
- Orientação para o Jardim da Psique (campo pessoal).
- Orientação para o Jardim da Heroína (campo profissional).
- Reforçar linguagem não diagnóstica e não determinista.

------------------------------------------------------------

FORMATO:
- Texto pronto para colar no portal.
- Seções bem separadas.
- Linguagem profunda, clara e aplicável.
- Sem floreios vazios.

FINALIZE com um pequeno parágrafo de integração que convide à prática e responsabilidade interna.`;

    // Replace template variables
    userPrompt = userPrompt
      .replace(/\{\{jornada\}\}/g, jornada)
      .replace(/\{\{portal\}\}/g, portal)
      .replace(/\{\{objetivo\}\}/g, objetivo)
      .replace(/\{\{ideias_chave\}\}/g, ideias_chave)
      .replace(/\{\{tom\}\}/g, tom)
      .replace(/\{\{duracao\}\}/g, duracao || "não especificada");

    console.log(`[generate-portal-content] Generating content for portal: ${portal}`);

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

    // Auto-save as draft if requested
    let savedDraft = null;
    if (save_draft) {
      const { data: draft, error: draftError } = await supabase
        .from("atelie_conteudos")
        .insert({
          template_id: usedTemplateId,
          jornada,
          portal,
          objetivo,
          ideias_chave,
          tom,
          duracao,
          conteudo_gerado: sections,
          status,
          created_by: user.id,
        })
        .select()
        .single();

      if (draftError) {
        console.error("[generate-portal-content] Error saving draft:", draftError);
      } else {
        savedDraft = draft;
        console.log(`[generate-portal-content] Draft saved with id: ${draft.id}`);
      }
    }

    // Return response
    return new Response(
      JSON.stringify({
        raw_content: content,
        sections,
        usage: data.usage,
        draft: savedDraft,
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
