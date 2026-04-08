import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ALQUIMISTA_SYSTEM_PROMPT = `Você é o Alquimista de Conteúdo Oracular da Casa Orácula.

Seu papel é transformar trechos de livros em conteúdos simbólicos formativos.

Processo:
1. Extrair o símbolo central do trecho (arquétipos, conflitos, movimentos da psique)
2. Traduzir psicologicamente (que tensão humana está presente?)
3. Conectar à experiência existencial da leitora
4. Gerar formatos pedagógicos distintos

Estilo: claro, simbólico, acessível, contemplativo.
Evitar: linguagem acadêmica, explicações longas, conceitos técnicos sem tradução.
O conteúdo deve parecer uma conversa íntima, uma reflexão profunda, uma travessia simbólica.`;

function extractSection(fullText: string, tag: string): string {
  const regex = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, "i");
  const match = fullText.match(regex);
  return match ? match[1].trim() : "";
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: isAdmin } = await supabase.rpc("is_admin", { _user_id: user.id });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { livro, capitulo_trecho, ciclo_id, semana_numero } = await req.json();

    if (!livro || !capitulo_trecho) {
      return new Response(JSON.stringify({ error: "Livro e capítulo/trecho são obrigatórios" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- Step 1: Generate content via Lovable AI Gateway ---
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const userPrompt = `Livro: "${livro}"
Trecho/Capítulo: "${capitulo_trecho}"

Gere os 4 conteúdos abaixo, separados pelas tags indicadas. Cada conteúdo deve ser autônomo.

<PODCAST>
Crie um roteiro de podcast de 4-8 minutos com:
- Abertura simbólica (30s)
- Contexto do trecho (1min)
- Reflexão psicológica (2-3min)
- Aplicação na vida (1-2min)
- Pergunta contemplativa (30s)
- Encerramento (30s)
Escreva como texto falado, pronto para gravação.
</PODCAST>

<CARTA>
Crie uma Carta da Semana: texto breve e poético que apresenta um símbolo, uma reflexão e uma pergunta interior. Tom contemplativo e inspirador. Máximo 200 palavras.
</CARTA>

<PERGUNTA>
Crie UMA pergunta contemplativa profunda que ajude a leitora a refletir sobre sua própria jornada a partir deste trecho. Apenas a pergunta, sem explicação.
</PERGUNTA>

<PRATICA>
Crie uma prática terapêutica simples (escrita reflexiva, visualização simbólica ou auto-observação) inspirada no símbolo central do trecho. Inclua: nome da prática, duração sugerida e instruções passo a passo.
</PRATICA>`;

    const aiResponse = await fetch("https://ai.lovable.dev/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-5-mini",
        messages: [
          { role: "system", content: ALQUIMISTA_SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 4000,
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      throw new Error(`AI error [${aiResponse.status}]: ${errText}`);
    }

    const aiData = await aiResponse.json();
    const fullText = aiData.choices?.[0]?.message?.content || "";

    const podcast_roteiro = extractSection(fullText, "PODCAST");
    const carta_semana = extractSection(fullText, "CARTA");
    const pergunta_contemplativa = extractSection(fullText, "PERGUNTA");
    const pratica_terapeutica = extractSection(fullText, "PRATICA");

    // --- Step 2: Generate TTS for podcast ---
    let podcast_audio_url: string | null = null;
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");

    if (ELEVENLABS_API_KEY && podcast_roteiro) {
      try {
        const voiceId = "FGY2WhTYpPnrIDTdsKH5";
        const ttsResponse = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
          {
            method: "POST",
            headers: {
              "xi-api-key": ELEVENLABS_API_KEY,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text: podcast_roteiro,
              model_id: "eleven_multilingual_v2",
              voice_settings: {
                stability: 0.6,
                similarity_boost: 0.75,
                style: 0.3,
                use_speaker_boost: true,
                speed: 0.92,
              },
            }),
          }
        );

        if (ttsResponse.ok) {
          const audioBuffer = await ttsResponse.arrayBuffer();
          const audioBytes = new Uint8Array(audioBuffer);

          const serviceClient = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
          );

          const fileName = `clube-semana/podcast_${Date.now()}.mp3`;
          const { error: uploadError } = await serviceClient.storage
            .from("audios")
            .upload(fileName, audioBytes, { contentType: "audio/mpeg", upsert: true });

          if (!uploadError) {
            const { data: publicUrl } = serviceClient.storage
              .from("audios")
              .getPublicUrl(fileName);
            podcast_audio_url = publicUrl.publicUrl;
          }
        } else {
          console.warn("TTS generation failed, continuing without audio:", await ttsResponse.text());
        }
      } catch (ttsErr) {
        console.warn("TTS error (non-blocking):", ttsErr);
      }
    }

    // --- Step 3: Save to database ---
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: record, error: insertError } = await serviceClient
      .from("clube_livro_semana")
      .insert({
        ciclo_id: ciclo_id || null,
        semana_numero: semana_numero || 1,
        livro,
        capitulo_trecho,
        podcast_roteiro,
        podcast_audio_url,
        carta_semana,
        pergunta_contemplativa,
        pratica_terapeutica,
        status: "rascunho",
        gerado_por: user.id,
      })
      .select()
      .single();

    if (insertError) throw new Error(`Insert error: ${insertError.message}`);

    return new Response(JSON.stringify({ success: true, record }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("gerar-semana-clube error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
