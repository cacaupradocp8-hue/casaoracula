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

    const imagePrompt = `Create a WIDE PANORAMIC illustrated mind-map infographic, 16:9 landscape format. This is NOT a card or poster — it is a VISUAL JOURNEY MAP with interconnected illustrated scenes flowing horizontally from left to right.

TITLE (large, elegant, centered at top): "${estrutura.titulo_pedagogico || livro_titulo}"
SUBTITLE: "Método de Leitura Oracular — ${livro_titulo}"

LAYOUT STRUCTURE — CRITICAL:
- The entire image is ONE continuous panoramic illustration, like a narrative mural or story map
- The background is a continuous mystical landscape: enchanted forests, ancient paths, moonlit clearings, mystical doorways
- There are ${encontros.length} MAJOR VISUAL SCENES arranged left-to-right, each representing a phase of the journey
- Scenes flow into each other organically through paths, vines, roots, rivers — NO hard borders or card frames
- Each scene has a TITLE LABEL and a SHORT DESCRIPTION overlaid on scroll/parchment elements
- Between scenes, symbolic creatures or objects serve as visual bridges (wolves, owls, serpents, keys, doors)

THE ${encontros.length} SCENES (left to right):
${encontros.map((e: any, i: number) => `Scene ${i + 1}: "${e.titulo}" — Phase: ${e.fase}. Theme: ${e.tema_central}. Visual motif: symbolic scene representing this transformation stage.`).join('\n')}

SYMBOLIC ELEMENTS TO INCLUDE:
- Archetypal fields: ${arquetipos.slice(0, 4).join(', ')}
- Central tensions (shown as contrasting visual pairs): ${tensoes.slice(0, 3).join(', ')}
- At bottom center: a comparison area showing two psychic states side by side (connected vs disconnected)

ART STYLE — MANDATORY:
- Rich, organic watercolor-style illustrations with flowing botanical elements (vines, ancient trees, roots, flowers)
- Mystical feminine silhouettes (NO realistic faces) — hooded figures, dancing silhouettes, seated meditation poses
- Symbolic animals: wolves, owls, serpents, deer
- Parchment scroll overlays for text labels
- Color palette: warm earth tones (bone white, sepia, warm browns), deep forest greens, muted burgundy, soft gold accents
- Ethereal lighting with moonlight and firefly-like particles
- Overall mood: contemplative, ritualistic, archetypal — like an illustrated fairy tale map

DO NOT create:
- Flat cards, grids, or boxed layouts
- Modern/corporate infographic styles
- Realistic human faces
- Bright neon colors

Footer banner: "✦ Método de Leitura Oracular — Casa Orácula ✦"

Ultra high resolution, professional illustrated mind-map infographic quality.`;

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
