import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { bucket, path, base64, contentType } = await req.json();
    if (!bucket || !path || !base64) {
      return new Response(JSON.stringify({ error: "missing params" }), { status: 400, headers: corsHeaders });
    }
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    const bin = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, bin, { contentType: contentType || "audio/mpeg", upsert: true });
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return new Response(JSON.stringify({ url: data.publicUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: corsHeaders });
  }
});
