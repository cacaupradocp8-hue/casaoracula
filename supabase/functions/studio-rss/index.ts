import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );

    const { data: episodes } = await supabase
      .from("studio_episodes")
      .select("*")
      .eq("status", "published")
      .in("visibility", ["public", "public_full"])
      .order("published_at", { ascending: false })
      .limit(100);

    const items = (episodes || []).map((ep: any) => {
      const audioUrl = ep.visibility === "public_full" ? (ep.audio_full_url || ep.audio_public_url) : ep.audio_public_url;
      const description = ep.visibility === "public_full" ? (ep.roteiro_completo || ep.versao_resumida) : ep.versao_resumida;
      
      return `
    <item>
      <title><![CDATA[${ep.titulo || ep.livro}]]></title>
      <description><![CDATA[${(description || ep.descricao || "").substring(0, 4000)}]]></description>
      <pubDate>${new Date(ep.published_at || ep.created_at).toUTCString()}</pubDate>
      <guid isPermaLink="false">${ep.id}</guid>
      ${audioUrl ? `<enclosure url="${audioUrl}" type="audio/mpeg" />` : ""}
    </item>`;
    }).join("\n");

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title>Estúdio Oracular — Casa Orácula</title>
    <description>Leituras terapêuticas simbólicas para formação e prática clínica.</description>
    <language>pt-br</language>
    <link>https://casaoracula.lovable.app</link>
    <image>
      <url>https://casaoracula.lovable.app/lovable-uploads/logo.png</url>
      <title>Estúdio Oracular</title>
      <link>https://casaoracula.lovable.app</link>
    </image>
    ${items}
  </channel>
</rss>`;

    return new Response(rss, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (e) {
    console.error("studio-rss error:", e);
    return new Response("<error>Failed to generate RSS</error>", {
      status: 500,
      headers: { "Content-Type": "application/xml" },
    });
  }
});
