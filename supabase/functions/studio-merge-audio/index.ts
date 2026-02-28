import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const userId = claimsData.claims.sub;
    const { data: isAdmin } = await supabase.rpc("is_admin", { _user_id: userId });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { episodeId } = await req.json();
    if (!episodeId) throw new Error("episodeId is required");

    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch episode
    const { data: episode, error: epError } = await serviceClient
      .from("studio_episodes")
      .select("audio_narradora_url, audio_oracular_url, roteiro_completo, formato")
      .eq("id", episodeId)
      .single();

    if (epError || !episode) throw new Error("Episode not found");
    if (!episode.audio_narradora_url || !episode.audio_oracular_url) {
      throw new Error("Both narradora and oracular audio are required");
    }

    // Parse script to determine voice order
    const blocks: { voice: string }[] = [];
    const regex = /\[(NARRADORA|VOZ_ORACULAR)\]/gi;
    let match;
    while ((match = regex.exec(episode.roteiro_completo || "")) !== null) {
      blocks.push({ voice: match[1].toUpperCase() });
    }

    // If no blocks found or not dialogue, just concatenate narradora + oracular
    if (blocks.length === 0) {
      blocks.push({ voice: "NARRADORA" }, { voice: "VOZ_ORACULAR" });
    }

    // Download both audio files
    console.log("Downloading narradora audio...");
    const narradoraResp = await fetch(episode.audio_narradora_url);
    if (!narradoraResp.ok) throw new Error("Failed to download narradora audio");
    const narradoraBuffer = new Uint8Array(await narradoraResp.arrayBuffer());

    console.log("Downloading oracular audio...");
    const oracularResp = await fetch(episode.audio_oracular_url);
    if (!oracularResp.ok) throw new Error("Failed to download oracular audio");
    const oracularBuffer = new Uint8Array(await oracularResp.arrayBuffer());

    // For MP3 byte-level concatenation we need to split each audio into
    // roughly equal segments based on the number of blocks for each voice.
    // Count blocks per voice
    const narradoraBlockCount = blocks.filter(b => b.voice === "NARRADORA").length;
    const oracularBlockCount = blocks.filter(b => b.voice === "VOZ_ORACULAR").length;

    // Split audio buffer into N roughly equal segments
    function splitBuffer(buffer: Uint8Array, segments: number): Uint8Array[] {
      if (segments <= 0) return [];
      const segmentSize = Math.floor(buffer.length / segments);
      const parts: Uint8Array[] = [];
      for (let i = 0; i < segments; i++) {
        const start = i * segmentSize;
        const end = i === segments - 1 ? buffer.length : (i + 1) * segmentSize;
        parts.push(buffer.slice(start, end));
      }
      return parts;
    }

    const narradoraSegments = splitBuffer(narradoraBuffer, narradoraBlockCount);
    const oracularSegments = splitBuffer(oracularBuffer, oracularBlockCount);

    // Interleave segments according to script order
    let narrIdx = 0;
    let oracIdx = 0;
    const orderedSegments: Uint8Array[] = [];

    for (const block of blocks) {
      if (block.voice === "NARRADORA" && narrIdx < narradoraSegments.length) {
        orderedSegments.push(narradoraSegments[narrIdx++]);
      } else if (block.voice === "VOZ_ORACULAR" && oracIdx < oracularSegments.length) {
        orderedSegments.push(oracularSegments[oracIdx++]);
      }
    }

    // Concatenate all segments
    const totalLength = orderedSegments.reduce((sum, s) => sum + s.length, 0);
    const finalBuffer = new Uint8Array(totalLength);
    let offset = 0;
    for (const segment of orderedSegments) {
      finalBuffer.set(segment, offset);
      offset += segment.length;
    }

    console.log(`Final audio: ${finalBuffer.length} bytes from ${orderedSegments.length} segments`);

    // Upload final audio
    const fileName = `studio/${episodeId}/final_${Date.now()}.mp3`;
    const { error: uploadError } = await serviceClient.storage
      .from("audios")
      .upload(fileName, finalBuffer, {
        contentType: "audio/mpeg",
        upsert: true,
      });

    if (uploadError) throw new Error(`Upload error: ${uploadError.message}`);

    const { data: publicUrl } = serviceClient.storage
      .from("audios")
      .getPublicUrl(fileName);

    // Update episode with final URL
    await serviceClient
      .from("studio_episodes")
      .update({ audio_final_url: publicUrl.publicUrl })
      .eq("id", episodeId);

    return new Response(JSON.stringify({ url: publicUrl.publicUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("studio-merge-audio error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
