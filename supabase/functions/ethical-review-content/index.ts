import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ============================================
// ETHICAL REVIEW CONTENT — Ateliê de Conteúdo
// Edge Function for ethical/clinical review of content
// ============================================

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface EthicalReviewRequest {
  conteudo: string;
  contexto?: string;
}

interface ReviewSection {
  pontos_seguros: string[];
  pontos_atencao: string[];
  sugestoes_ajuste: string[];
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
    const { conteudo, contexto }: EthicalReviewRequest = await req.json();

    // Validate required fields
    if (!conteudo) {
      return new Response(
        JSON.stringify({ error: "Campo obrigatório: conteudo" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[ethical-review-content] Starting ethical review`);

    // Get ethical review template
    const { data: template } = await supabase
      .from("templates")
      .select("system_prompt, action_prompt")
      .eq("name", "Casa Orácula — Revisão Ética")
      .eq("ativo", true)
      .single();

    if (!template) {
      console.error("[ethical-review-content] Ethical review template not found");
      return new Response(
        JSON.stringify({ error: "Template de revisão ética não encontrado" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Replace template variables
    const userPrompt = template.action_prompt
      .replace(/\{\{conteudo\}\}/g, conteudo)
      .replace(/\{\{contexto\}\}/g, contexto || "Nenhum contexto adicional fornecido");

    // Call OpenAI API
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      console.error("[ethical-review-content] OPENAI_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "OPENAI_API_KEY não configurada" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: template.system_prompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.5, // Lower for more consistent ethical reviews
        max_tokens: 2048,
      }),
    });

    // Handle API errors
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[ethical-review-content] AI error ${response.status}:`, errorText);

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
        JSON.stringify({ error: `Erro na revisão ética: ${response.status}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error("[ethical-review-content] Empty response from AI");
      return new Response(
        JSON.stringify({ error: "Resposta vazia da IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse review into structured sections
    const review = parseEthicalReview(content);

    console.log(`[ethical-review-content] Success - Review completed`);

    // Return response
    return new Response(
      JSON.stringify({
        raw_content: content,
        review,
        usage: data.usage,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("[ethical-review-content] Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Erro desconhecido",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Helper function to parse ethical review into structured sections
function parseEthicalReview(content: string): ReviewSection {
  const review: ReviewSection = {
    pontos_seguros: [],
    pontos_atencao: [],
    sugestoes_ajuste: [],
  };

  // Extract sections using regex
  const segurosMatch = content.match(/###?\s*✅\s*PONTOS ÉTICOS SEGUROS\s*\n([\s\S]*?)(?=###?\s*⚠️|$)/i);
  const atencaoMatch = content.match(/###?\s*⚠️\s*PONTOS DE ATENÇÃO\s*\n([\s\S]*?)(?=###?\s*💡|$)/i);
  const sugestoesMatch = content.match(/###?\s*💡\s*SUGESTÕES DE AJUSTE\s*\n([\s\S]*?)$/i);

  // Parse bullet points from each section
  if (segurosMatch) {
    review.pontos_seguros = extractBulletPoints(segurosMatch[1]);
  }
  if (atencaoMatch) {
    review.pontos_atencao = extractBulletPoints(atencaoMatch[1]);
  }
  if (sugestoesMatch) {
    review.sugestoes_ajuste = extractBulletPoints(sugestoesMatch[1]);
  }

  return review;
}

// Extract bullet points from text
function extractBulletPoints(text: string): string[] {
  const lines = text.split('\n');
  const points: string[] = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    // Match lines starting with -, *, •, or numbered lists
    if (trimmed.match(/^[-*•]\s+/) || trimmed.match(/^\d+[.)]\s+/)) {
      const cleaned = trimmed.replace(/^[-*•]\s+/, '').replace(/^\d+[.)]\s+/, '').trim();
      if (cleaned) {
        points.push(cleaned);
      }
    }
  }
  
  return points;
}
