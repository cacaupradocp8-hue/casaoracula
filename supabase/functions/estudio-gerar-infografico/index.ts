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

    const { estrutura, livro_titulo, project_id, reference_image_url } = await req.json();

    if (!estrutura || !livro_titulo) throw new Error("Dados insuficientes");

    const encontros = estrutura.encontros || [];
    const tensoes = estrutura.tensoes_centrais || [];
    const arquetipos = estrutura.arquetipos_envolvidos || [];

    // Pre-compute SHORT labels - max 4-5 words each to avoid AI text errors
    const mainTitle = (estrutura.titulo_pedagogico || livroTitulo).substring(0, 50);
    const subtitle = livroTitulo.substring(0, 40);
    
    // Build very short scene labels (just number + short title)
    const sceneLabels = encontros.slice(0, 6).map((e: any) => {
      const num = e.numero || '';
      const title = (e.titulo || '').substring(0, 25);
      return `${num}. ${title}`;
    }).join(' | ');

    const phaseLabels = encontros.slice(0, 6).map((e: any) => {
      return (e.fase || '').substring(0, 15);
    }).join(' → ');

    const tensionShort = tensoes.slice(0, 2).map((t: string) => t.substring(0, 20)).join(' × ');
    const archetypeShort = arquetipos.slice(0, 3).map((a: string) => a.substring(0, 15)).join(', ');

    const imagePrompt = `Create a single WIDE PANORAMIC horizontal illustrated infographic (16:9 landscape ratio, width much larger than height).

STYLE: Hand-painted watercolor and ink illustration. Dark mystical aesthetic with rich botanical details. Colors: deep black (#0A0A0A) background fading to dark forest green (#1F3D3A), with gold (#C6A75E) accents, bone white (#F5F0E8) for text areas, and warm sepia tones. Ethereal moonlight illumination throughout.

COMPOSITION: One continuous illustrated landscape flowing LEFT to RIGHT across the entire canvas. NO cards, NO boxes, NO grids, NO separated sections. Scenes blend into each other through organic transitions: ancient tree roots, winding forest paths, flowing rivers, climbing vines.

VISUAL ELEMENTS throughout the landscape:
- Ancient twisted trees with golden leaves connecting scenes
- Hooded feminine silhouettes (no realistic faces) in meditation, walking, or ritual poses
- Symbolic animals: wolves, owls, serpents woven into the landscape
- Ancient doorways and stone arches marking transitions between scenes
- Glowing fireflies and golden particles floating in the air
- Parchment scrolls and aged paper fragments with text
- Moon phases in the sky marking progression
- Dense vegetation: moss, ferns, wildflowers, mushrooms

TEXT PLACEMENT (CRITICAL - use EXACT text below, no changes):
- Top center on an elegant parchment banner: "${mainTitle}"
- Smaller subtitle below: "${subtitle}"
- ${encontros.length} small aged parchment labels placed along the journey path, each with SHORT text: ${sceneLabels}
- Phase progression shown as a subtle golden thread: ${phaseLabels}
${tensionShort ? `- One small scroll near center with: "${tensionShort}"` : ''}
${archetypeShort ? `- Delicate golden text near bottom: "${archetypeShort}"` : ''}
- Bottom decorative strip: "✦ Casa Orácula ✦"

CRITICAL TEXT RULES:
- Copy ALL text EXACTLY as provided above - do not translate, rephrase or invent new text
- Keep text SHORT - never more than 5 words per label
- Text must be LEGIBLE against dark backgrounds (use light/gold colors)
- Use elegant serif typography style

FORBIDDEN: vertical orientation, square format, modern/corporate style, bright neon colors, realistic human faces, large empty spaces, card layouts, grid layouts, separated boxes.

Ultra high resolution, professional quality.`;

    console.log("Generating infographic image with pro model...");

    // Build the message content - optionally include reference image
    const messageContent: any[] = [{ type: "text", text: imagePrompt }];
    
    if (reference_image_url) {
      messageContent.push({
        type: "image_url",
        image_url: { url: reference_image_url }
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-pro-image-preview",
        messages: [
          { role: "user", content: messageContent },
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
