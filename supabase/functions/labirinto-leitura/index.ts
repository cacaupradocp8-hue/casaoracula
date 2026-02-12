import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Edge function para gerar leitura simbólica do Labirinto das 39 Portas
 * Usa IA de forma controlada - sem interpretação, diagnóstico ou soluções
 */
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth validation
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { porta_nome, porta_focus } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // System prompt rigorosamente controlado
    const systemPrompt = `Você é um leitor simbólico do Labirinto das 39 Portas.

REGRAS ABSOLUTAS:
- NÃO interprete
- NÃO diagnostique  
- NÃO ofereça soluções ou conselhos
- NÃO mencione trauma, bloqueio, cura, problema ou doença
- NÃO use linguagem terapêutica clínica
- NÃO faça perguntas direcionadas

ESTILO:
- Use linguagem poética clara e aberta
- Gere textos curtos (3-5 parágrafos)
- Termine sempre com UMA pergunta aberta, sem direcionamento
- Mantenha tom contemplativo e simbólico
- Evite explicações - prefira imagens

Este app não fornece diagnósticos, conselhos ou interpretações terapêuticas.`;

    const userPrompt = `Gere uma leitura simbólica sobre o tema "${porta_focus || porta_nome}".

Contexto: Esta é uma porta do Labirinto que trabalha com o campo de "${porta_nome}".

A leitura deve:
1. Evocar uma cena ou imagem simbólica relacionada ao tema
2. Falar sobre a experiência interna sem explicá-la
3. Terminar com uma pergunta aberta que convide à reflexão`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 500,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns minutos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos de IA esgotados." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Erro ao gerar leitura");
    }

    const data = await response.json();
    const leitura = data.choices?.[0]?.message?.content || "";

    return new Response(
      JSON.stringify({ leitura }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("labirinto-leitura error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
