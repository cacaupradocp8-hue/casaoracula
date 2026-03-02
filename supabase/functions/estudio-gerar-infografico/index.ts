import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase config missing");

    const { estrutura, livro_titulo, project_id } = await req.json();

    if (!estrutura || !livro_titulo) throw new Error("Dados insuficientes");

    // Build a rich prompt from the pedagogical structure
    const encontros = estrutura.encontros || [];
    const tensoes = estrutura.tensoes_centrais || [];
    const arquetipos = estrutura.arquetipos_envolvidos || [];

    const fasesText = encontros.map((e: any) => 
      `Phase ${e.numero}: "${e.titulo}" (${e.fase}) - ${e.tema_central}`
    ).join(". ");

    const imagePrompt = `Create a premium illustrated infographic in a mystical, archetypal art style. Landscape format 16:9 aspect ratio.

Title: "${estrutura.titulo_pedagogico || livro_titulo}"
Subtitle: "Método de Leitura Oracular"

The infographic should have:
- A panoramic illustrated scene split into ${encontros.length} visual sections flowing left to right
- Each section represents a phase of symbolic journey: ${fasesText}
- Central symbolic motifs: ${arquetipos.slice(0, 4).join(", ")}
- Core tensions illustrated symbolically: ${tensoes.slice(0, 3).join(", ")}
- Art style: rich, organic illustrations with flowing vines, trees, mystical creatures, archetypal feminine figures
- Color palette: deep forest greens, warm earth browns, muted golds, bone whites, soft indigo
- Each phase has a small title label and brief description text
- Bottom center: a comparison box showing two states (connected vs disconnected)
- Footer bar with "Método de Leitura Oracular — Casa Orácula"
- NO realistic human faces. Use silhouettes, symbolic figures, animals (wolves, owls, serpents)
- Ritualistic and contemplative mood
- Ultra high resolution, professional infographic quality

This is inspired by Jungian archetypal psychology applied to "${livro_titulo}". The visual narrative should flow like a journey map through symbolic transformation.`;

    console.log("Generating infographic image...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [
          { role: "user", content: imagePrompt },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições atingido. Tente novamente em alguns minutos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA esgotados." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("Erro ao gerar imagem");
    }

    const data = await response.json();
    const imageBase64 = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageBase64) {
      throw new Error("Nenhuma imagem foi gerada");
    }

    // Upload to storage
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Extract base64 data
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    const fileName = `infograficos/${project_id || crypto.randomUUID()}_${Date.now()}.png`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("content-images")
      .upload(fileName, binaryData, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error("Erro ao salvar imagem");
    }

    const { data: urlData } = supabaseAdmin.storage
      .from("content-images")
      .getPublicUrl(fileName);

    console.log("Infographic generated and uploaded:", urlData.publicUrl);

    return new Response(JSON.stringify({ 
      image_url: urlData.publicUrl,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("estudio-gerar-infografico error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
