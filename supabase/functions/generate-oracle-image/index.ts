import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GenerateRequest {
  card_id?: string;
  symbolic_focus: string;
  preview_only?: boolean; // If true, return base64 only without saving
}

serve(async (req) => {
  // Handle CORS preflight
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

    const { card_id, symbolic_focus, preview_only } = await req.json() as GenerateRequest;

    if (!symbolic_focus) {
      return new Response(
        JSON.stringify({ error: "symbolic_focus é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

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

    // Get symbolic focus description
    const { data: focusData } = await supabase
      .from("oracle_symbolic_focuses")
      .select("descricao")
      .eq("nome", symbolic_focus)
      .single();

    const focusDescription = focusData?.descricao || symbolic_focus;

    // Combine master prompt with symbolic focus
    const fullPrompt = `${masterPrompt}

Central symbolic element: ${symbolic_focus}. ${focusDescription}.
The ${symbolic_focus} emerges from the composition as the primary focal point, integrated organically into the abstract archetypal landscape.
Square format, 1:1 aspect ratio. Ultra high resolution.`;

    console.log("Generating oracle image with prompt:", fullPrompt);

    // Call OpenAI DALL-E 3 API for image generation
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
          JSON.stringify({ error: "Limite de requisições atingido. Tente novamente em alguns minutos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes. Adicione créditos ao workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiData = await response.json();
    console.log("AI response received");

    // Extract image from response
    const imageData = aiData.data?.[0]?.b64_json;

    if (!imageData) {
      console.error("No image in response:", JSON.stringify(aiData));
      throw new Error("Nenhuma imagem gerada");
    }

    // If preview only, return base64 directly
    if (preview_only) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          image_base64: imageData,
          symbolic_focus,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Upload to Supabase Storage
    if (!card_id) {
      return new Response(
        JSON.stringify({ error: "card_id é obrigatório para salvar a imagem" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Convert base64 to blob
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    const fileName = `cards/${card_id}_${Date.now()}.png`;

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

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("oracle-images")
      .getPublicUrl(fileName);

    const imageUrl = urlData.publicUrl;

    // Update the oracle card with the generated image
    const { error: updateError } = await supabase
      .from("oracle_cards")
      .update({
        ai_generated_image_url: imageUrl,
        symbolic_focus: symbolic_focus,
        main_image_url: imageUrl, // Also set as main image
      })
      .eq("id", card_id);

    if (updateError) {
      console.error("Update error:", updateError);
      throw new Error("Erro ao atualizar carta com imagem");
    }

    console.log("Oracle card image generated and saved:", imageUrl);

    return new Response(
      JSON.stringify({
        success: true,
        image_url: imageUrl,
        card_id,
        symbolic_focus,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in generate-oracle-image:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
