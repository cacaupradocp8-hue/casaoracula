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

    // Build encounter descriptions in Portuguese for the prompt
    const encounterDescriptions = encontros.map((e: any, i: number) => {
      const title = e.titulo || `Encontro ${e.numero}`;
      const phase = e.fase || '';
      const theme = e.tema_central || '';
      return `"${title}" (${phase}): ${theme}`;
    }).join('\n');

    const tensionText = tensoes.slice(0, 3).join(', ');
    const archetypeText = arquetipos.slice(0, 4).join(', ');
    const mainTitle = estrutura.titulo_pedagogico || livro_titulo;

    const imagePrompt = `Crie um infográfico panorâmico horizontal ilustrado no estilo de um MAPA DE JORNADA VISUAL, exatamente como os infográficos do NotebookLM sobre livros de psicologia arquetípica.

FORMATO OBRIGATÓRIO: Paisagem (landscape), proporção 16:9, largura muito maior que altura. Preencher TODO o canvas sem margens vazias.

TÍTULO PRINCIPAL no topo, grande, elegante, em fonte serif decorativa sobre fundo claro:
"${mainTitle}"
Subtítulo menor abaixo: "${livro_titulo}"

LAYOUT — NÃO usar cards, caixas ou grids. O infográfico é UMA ilustração contínua com cenas que fluem organicamente da esquerda para a direita, como um mural narrativo. Os textos descritivos ficam INTEGRADOS na ilustração, posicionados ao lado ou sobre as cenas — não dentro de caixas.

CONTEÚDO — ${encontros.length} seções temáticas distribuídas pelo canvas:
${encounterDescriptions}

${tensionText ? `TENSÕES CENTRAIS para representar visualmente: ${tensionText}` : ''}
${archetypeText ? `CAMPOS ARQUETÍPICOS presentes: ${archetypeText}` : ''}

ELEMENTOS VISUAIS OBRIGATÓRIOS:
- Árvores antigas com raízes e galhos que conectam as seções
- Silhuetas femininas místicas (sem rostos realistas) — figuras encapuzadas, em meditação, dançando
- Animais simbólicos: lobas, corujas, serpentes, cervos
- Portas antigas, caminhos, clareiras iluminadas pela lua
- Pergaminhos e rolos com textos curtos em português
- Vegetação abundante: vinhas, flores, raízes, folhas
- Partículas luminosas como vagalumes

PALETA DE CORES: fundo creme/osso claro (#F5F0E8), marrom escuro para textos, verde floresta profundo, sépia quente, bordô suave, dourado para detalhes e acentos. Iluminação etérea com luar.

ESTILO: Ilustração digital detalhada com traços artísticos, misturando aquarela com arte digital. Cada seção tem uma cena ilustrada única que se funde organicamente com a próxima através de elementos naturais (raízes, caminhos, água).

RODAPÉ: faixa decorativa fina na base com "✦ Método de Leitura Oracular — Casa Orácula ✦"

TODO texto visível deve estar em PORTUGUÊS BRASILEIRO correto.

PROIBIDO: composições verticais ou quadradas, cards/caixas/grids, rostos humanos realistas, cores neon, espaços vazios grandes, estilo corporativo/moderno.

Ultra alta resolução, qualidade profissional de infográfico ilustrado.`;

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
