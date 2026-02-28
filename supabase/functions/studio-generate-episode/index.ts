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

    const { livro, capitulo, eixoId, textoBase, intencaoTerapeutica, visibility, formato } = await req.json();

    // Fetch active method blocks
    const { data: blocks } = await supabase
      .from("studio_method_blocks")
      .select("nome, instrucao")
      .eq("ativo", true)
      .order("ordem");

    // Fetch axis
    let axisInstructions = "";
    if (eixoId) {
      const { data: axis } = await supabase
        .from("studio_method_axes")
        .select("nome, instrucao_especifica")
        .eq("id", eixoId)
        .single();
      if (axis) {
        axisInstructions = `\n\n## EIXO: ${axis.nome}\n${axis.instrucao_especifica}`;
      }
    }

    const methodStructure = (blocks || [])
      .map((b: any, i: number) => `${i + 1}. ${b.nome}: ${b.instrucao}`)
      .join("\n");

    const isDialogo = formato === "dialogo";

    const dialogoInstructions = isDialogo ? `

## FORMATO: DIÁLOGO ORACULAR
O roteiro deve ser dividido em DUAS VOZES claramente marcadas:

[NARRADORA]
Texto da Narradora...

[VOZ_ORACULAR]
Texto da Voz Oracular...

### NARRADORA conduz:
- Abertura do campo
- Conexões pessoais e sensíveis
- Perguntas reflexivas
- Transições entre temas
- Encerramento

### VOZ ORACULAR conduz:
- Sínteses didáticas
- Explicações conceituais
- Aplicação do eixo arquetípico
- Estrutura analítica
- Conteúdo formativo denso

Alterne entre as duas vozes de forma natural, como uma conversa profunda entre duas mulheres sábias.
Cada bloco deve começar com [NARRADORA] ou [VOZ_ORACULAR] em linha separada.
` : "";

    const systemPrompt = `Você é a Mestra Oracular da Casa Orácula, especialista em leitura terapêutica simbólica.
Seu papel é criar roteiros de aulas-álbum oraculares seguindo o Método Casa Orácula de Leitura Terapêutica.

## ESTRUTURA BASE DO MÉTODO
${methodStructure}
${axisInstructions}
${dialogoInstructions}

## RESTRIÇÕES
- Não resumir o livro
- Não repetir o autor
- Não usar linguagem motivacional
- Arquétipo é campo, não rótulo
- Tom: profundo, ético, humano, sem misticismo performático
- Linguagem falada, natural, pronta para gravação de áudio
- Frases curtas e pontuação clara
- Evitar exagero místico
- Tom reflexivo e didático

## OUTPUT
Gere DOIS textos separados por "---VERSAO_RESUMIDA---":
1. ROTEIRO COMPLETO (para membros exclusivos)
2. VERSÃO RESUMIDA (para público, ~30% do conteúdo, mantendo essência)`;

    const userPrompt = `Livro: ${livro}
Capítulo: ${capitulo}
Intenção Terapêutica: ${intencaoTerapeutica}
Visibilidade: ${visibility}
Formato: ${isDialogo ? "Diálogo Oracular (duas vozes)" : "Narrativo Único"}

Texto base / Ideias-chave:
${textoBase}

Gere o roteiro completo e a versão resumida.`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (status === 402) return new Response(JSON.stringify({ error: "Payment required" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI gateway error: ${status}`);
    }

    const aiData = await aiResponse.json();
    const fullText = aiData.choices?.[0]?.message?.content || "";

    let roteiroCompleto = fullText;
    let versaoResumida = "";

    const separator = "---VERSAO_RESUMIDA---";
    if (fullText.includes(separator)) {
      const parts = fullText.split(separator);
      roteiroCompleto = parts[0].trim();
      versaoResumida = parts[1].trim();
    }

    return new Response(JSON.stringify({ roteiroCompleto, versaoResumida }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("studio-generate-episode error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
