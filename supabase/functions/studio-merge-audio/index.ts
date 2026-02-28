import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function downloadAudio(url: string): Promise<Uint8Array> {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Failed to download: ${url}`);
  return new Uint8Array(await resp.arrayBuffer());
}

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

function concatBuffers(buffers: Uint8Array[]): Uint8Array {
  const totalLength = buffers.reduce((sum, b) => sum + b.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const buf of buffers) {
    result.set(buf, offset);
    offset += buf.length;
  }
  return result;
}

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

    const { data: episode, error: epError } = await serviceClient
      .from("studio_episodes")
      .select("audio_narradora_url, audio_oracular_url, roteiro_completo, formato, vinheta_abertura_url, vinheta_encerramento_url")
      .eq("id", episodeId)
      .single();

    if (epError || !episode) throw new Error("Episode not found");
    if (!episode.audio_narradora_url || !episode.audio_oracular_url) {
      throw new Error("Both narradora and oracular audio are required");
    }

    // Parse script voice order
    const blocks: { voice: string }[] = [];
    const regex = /\[(NARRADORA|VOZ_ORACULAR)\]/gi;
    let match;
    while ((match = regex.exec(episode.roteiro_completo || "")) !== null) {
      blocks.push({ voice: match[1].toUpperCase() });
    }
    if (blocks.length === 0) {
      blocks.push({ voice: "NARRADORA" }, { voice: "VOZ_ORACULAR" });
    }

    // Download all audio files in parallel
    const downloadPromises: Promise<Uint8Array>[] = [
      downloadAudio(episode.audio_narradora_url),
      downloadAudio(episode.audio_oracular_url),
    ];
    if (episode.vinheta_abertura_url) downloadPromises.push(downloadAudio(episode.vinheta_abertura_url));
    if (episode.vinheta_encerramento_url) downloadPromises.push(downloadAudio(episode.vinheta_encerramento_url));

    const downloaded = await Promise.all(downloadPromises);
    const narradoraBuffer = downloaded[0];
    const oracularBuffer = downloaded[1];
    const vinhetaAberturaBuffer = episode.vinheta_abertura_url ? downloaded[2] : null;
    const vinhetaEncerramentoBuffer = episode.vinheta_encerramento_url ? downloaded[episode.vinheta_abertura_url ? 3 : 2] : null;

    console.log(`Downloaded: narradora=${narradoraBuffer.length}b, oracular=${oracularBuffer.length}b`);

    // Split and interleave voice segments
    const narradoraBlockCount = blocks.filter(b => b.voice === "NARRADORA").length;
    const oracularBlockCount = blocks.filter(b => b.voice === "VOZ_ORACULAR").length;
    const narradoraSegments = splitBuffer(narradoraBuffer, narradoraBlockCount);
    const oracularSegments = splitBuffer(oracularBuffer, oracularBlockCount);

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

    // Build final: vinheta_abertura + interleaved voices + vinheta_encerramento
    const finalParts: Uint8Array[] = [];
    if (vinhetaAberturaBuffer) finalParts.push(vinhetaAberturaBuffer);
    finalParts.push(...orderedSegments);
    if (vinhetaEncerramentoBuffer) finalParts.push(vinhetaEncerramentoBuffer);

    const finalBuffer = concatBuffers(finalParts);
    console.log(`Final audio: ${finalBuffer.length} bytes (${finalParts.length} parts)`);

    // Upload
    const fileName = `studio/${episodeId}/final_${Date.now()}.mp3`;
    const { error: uploadError } = await serviceClient.storage
      .from("audios")
      .upload(fileName, finalBuffer, { contentType: "audio/mpeg", upsert: true });

    if (uploadError) throw new Error(`Upload error: ${uploadError.message}`);

    const { data: publicUrl } = serviceClient.storage.from("audios").getPublicUrl(fileName);

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
