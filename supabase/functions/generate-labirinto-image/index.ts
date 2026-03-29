import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GenerateRequest {
  porta_id: string;
  symbolic_focus?: string;
  preview_only?: boolean;
}

// Mapping door numbers to symbolic elements for image generation
const DOOR_SYMBOLIC_MAP: Record<number, string> = {
  1: "threshold doorway with golden light emerging from darkness, archetypal passage",
  2: "sacred fire and volcanic energy, transformative rage as red-golden flames",
  3: "deep stillness, void space with subtle starlight, contemplative emptiness",
  4: "veiled figure in shadow, hidden vulnerability, protective cocoon",
  5: "dark waters reflecting moonlight, tears becoming rivers, grief as passage",
  6: "heavy chains dissolving into light, burden transforming into freedom",
  7: "labyrinthine corridors with distant golden glow, courage in darkness",
  8: "single tree in vast landscape, solitary mountain peak, noble isolation",
  9: "magnetic pull of twin flames, longing as golden thread connecting worlds",
  10: "open hands releasing birds, surrender as flowering, letting go",
  11: "tight grip loosening, fortress walls crumbling into garden",
  12: "bowed figure finding inner strength, humility as power",
  13: "lightning breaking through storm, wild untamed energy, liberation",
  14: "sacred vessel, temple of flesh, embodied wisdom as golden anatomy",
  15: "sound waves becoming visible light, throat chakra radiating truth",
  16: "reflective pool showing depths, mirror within mirror, self-recognition",
  17: "shadow dancing with light, integration of dark and bright aspects",
  18: "many faces dissolving into authentic essence, persona releasing",
  19: "translucent curtains between worlds, liminal space, thin places",
  20: "second threshold, deeper passage, spiral descent into mystery",
  21: "downward spiral staircase, cave mouth, journey to underworld",
  22: "phoenix emerging from ashes, egg cracking open, dawn breaking",
  23: "tree of life with deep roots, ancestral spirits as starlight",
  24: "womb space, cosmic mother, nurturing darkness that births light",
  25: "young maiden with ancient eyes, innocence meeting wisdom",
  26: "two figures mirroring each other, sisterhood as sacred bond",
  27: "sacred union of opposites, eros as divine force, passion and devotion",
  28: "wild woman with moon crown, untamed feminine power, natural magic",
  29: "healing hands emanating light, medicine woman, restoration",
  30: "wise crone with starlit eyes, elder wisdom, completion of cycle",
  31: "goddess figure emerging from cosmic waters, divine feminine",
  32: "luminous child in garden of wonder, innocence protected",
  33: "third eye opening, inner knowing as golden light, psychic vision",
  34: "moon phases, spiral of time, eternal return, seasonal wheel",
  35: "caterpillar becoming butterfly, alchemical vessel, metamorphosis",
  36: "pregnant emptiness, black hole with golden rim, fertile nothing",
  37: "overflowing chalice, abundance as natural state, fullness",
  38: "puzzle pieces becoming whole, fragments uniting, completion",
  39: "homecoming light, spiral returning to center, journey completed",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY not configured");
    }

    const { porta_id, symbolic_focus, preview_only } = await req.json() as GenerateRequest;

    if (!porta_id) {
      return new Response(
        JSON.stringify({ error: "porta_id é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Fetch the door data
    const { data: porta, error: portaError } = await supabase
      .from("labirinto_portas")
      .select("id, numero, nome, symbolic_focus, cena_narrativa, eixo_psiquico")
      .eq("id", porta_id)
      .single();

    if (portaError || !porta) {
      console.error("Error fetching porta:", portaError);
      return new Response(
        JSON.stringify({ error: "Porta não encontrada" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch the master visual prompt
    const { data: settingsData, error: settingsError } = await supabase
      .from("ai_global_settings")
      .select("valor")
      .eq("chave", "oracle_visual_master_prompt")
      .eq("ativo", true)
      .single();

    if (settingsError || !settingsData) {
      console.error("Error fetching master prompt:", settingsError);
      throw new Error("Prompt-mãe visual não encontrado");
    }

    const masterPrompt = settingsData.valor;

    // Get symbolic description for this door
    const symbolicDescription = 
      symbolic_focus || 
      DOOR_SYMBOLIC_MAP[porta.numero] || 
      `${porta.nome.replace("Porta ", "").replace("da ", "").replace("do ", "")} as archetypal symbol`;

    // Build the full prompt
    const fullPrompt = `${masterPrompt}

Central symbolic element: ${symbolicDescription}.
Door number ${porta.numero} of 39 in a symbolic labyrinth of the feminine psyche.
${porta.eixo_psiquico ? `Psychological axis: ${porta.eixo_psiquico}.` : ""}
${porta.cena_narrativa ? `Narrative scene essence: ${porta.cena_narrativa.substring(0, 200)}...` : ""}
The doorway emerges as a mystical portal, integrated organically into an abstract archetypal landscape.
Square format, 1:1 aspect ratio. Ultra high resolution. No text, no words, no letters.`;

    console.log(`Generating image for Porta ${porta.numero}: ${porta.nome}`);
    console.log("Prompt:", fullPrompt.substring(0, 300) + "...");

    // Call OpenAI DALL-E 3 API
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: fullPrompt,
        n: 1,
        size: "1024x1024",
        response_format: "b64_json",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições atingido. Aguarde alguns minutos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiData = await response.json();
    const imageData = aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageData) {
      console.error("No image in response:", JSON.stringify(aiData));
      throw new Error("Nenhuma imagem gerada");
    }

    if (preview_only) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          image_base64: imageData,
          porta_id,
          porta_nome: porta.nome,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Upload to Supabase Storage
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    const fileName = `labirinto/porta_${porta.numero}_${Date.now()}.png`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("oracle-images")
      .upload(fileName, binaryData, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error("Erro ao salvar imagem no storage");
    }

    const { data: urlData } = supabase.storage
      .from("oracle-images")
      .getPublicUrl(fileName);

    const imageUrl = urlData.publicUrl;

    // Update the door with the generated image
    const { error: updateError } = await supabase
      .from("labirinto_portas")
      .update({
        ai_generated_image_url: imageUrl,
        symbolic_focus: symbolicDescription.substring(0, 100),
      })
      .eq("id", porta_id);

    if (updateError) {
      console.error("Update error:", updateError);
      throw new Error("Erro ao atualizar porta com imagem");
    }

    console.log(`Porta ${porta.numero} image generated and saved:`, imageUrl);

    return new Response(
      JSON.stringify({
        success: true,
        image_url: imageUrl,
        porta_id,
        porta_numero: porta.numero,
        porta_nome: porta.nome,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in generate-labirinto-image:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
