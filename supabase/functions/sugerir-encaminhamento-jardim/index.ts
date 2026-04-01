import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Não autenticada");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) throw new Error("Não autenticada");

    const { cliente_id, distrito_id, ferramenta_id, checkin_state, insight, notas } = await req.json();
    if (!cliente_id) throw new Error("cliente_id obrigatório");

    // Gather context in parallel
    const [
      clienteRes,
      cidadelaRes,
      orientacoesRes,
      distritoRes,
      ferramentaRes,
    ] = await Promise.all([
      supabase.from("clientes").select("nome, cartografia_sessao").eq("id", cliente_id).single(),
      supabase.from("client_city_state").select("*").eq("client_id", cliente_id).maybeSingle(),
      supabase.from("co_orientacoes").select("tipo, titulo, mensagem, status, created_at")
        .eq("cliente_id", cliente_id).eq("terapeuta_id", user.id)
        .order("created_at", { ascending: false }).limit(5),
      distrito_id
        ? supabase.from("districts").select("nome, descricao").eq("id", distrito_id).single()
        : Promise.resolve({ data: null }),
      ferramenta_id
        ? supabase.from("tools").select("nome, descricao").eq("id", ferramenta_id).single()
        : Promise.resolve({ data: null }),
    ]);

    const clienteNome = clienteRes.data?.nome || "a cliente";
    const cartografia = clienteRes.data?.cartografia_sessao;
    const cidadela = cidadelaRes.data;
    const orientacoesAnteriores = orientacoesRes.data || [];
    const distritoNome = distritoRes.data?.nome;
    const ferramentaNome = ferramentaRes.data?.nome;

    // Build context for AI
    const orientacoesTexto = orientacoesAnteriores.length > 0
      ? orientacoesAnteriores.map(o => `- [${o.tipo}] ${o.titulo || ""}: ${o.mensagem?.slice(0, 80)} (${o.status})`).join("\n")
      : "Nenhuma orientação anterior enviada.";

    const prompt = `Você é uma assistente clínica simbólica do Método Orácula.
Sua função é sugerir encaminhamentos para o Jardim da Heroína da cliente após uma sessão terapêutica.

REGRAS ÉTICAS OBRIGATÓRIAS:
- Use linguagem simbólica, ética e não-diagnóstica
- Não repita práticas já enviadas recentemente
- Priorize sustentação se a cliente está em estado frágil
- Não acelere processos — respeite o tempo psíquico
- Fale como se fosse uma colega sábia sugerindo caminhos, não uma máquina

CONTEXTO DA SESSÃO:
- Cliente: ${clienteNome}
- Estado de presença (check-in): ${checkin_state || "não informado"}
- Distrito trabalhado: ${distritoNome || "não definido"}
- Ferramenta utilizada: ${ferramentaNome || "nenhuma"}
- Insight registrado: ${insight || "nenhum"}
- Notas da sessão: ${notas || "nenhuma"}
${cidadela?.distrito_ativo ? `- Distrito ativo na CidaDELA: ${cidadela.distrito_ativo}` : ""}
${cartografia ? `- Cartografia da cliente: ${JSON.stringify(cartografia).slice(0, 300)}` : ""}

ORIENTAÇÕES JÁ ENVIADAS ANTERIORMENTE:
${orientacoesTexto}

GERAR SUGESTÃO com os seguintes 5 blocos:
1. pratica_sugerida: nome e breve descrição de uma prática
2. escuta_sugerida: tipo de escuta/meditação recomendada
3. territorio_foco: território simbólico para a cliente observar entre sessões
4. reflexao_sugerida: uma pergunta-mãe ou convite reflexivo
5. mensagem_final_sugerida: mensagem acolhedora da terapeuta para a cliente (2-3 frases)
6. justificativa_clinica: breve explicação para a terapeuta de por que essas sugestões (2-3 frases, linguagem profissional)

Retorne APENAS o JSON, sem markdown.`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY não configurada");

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "Você é uma assistente clínica simbólica. Responda sempre em JSON válido, sem markdown." },
          { role: "user", content: prompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "sugerir_encaminhamento",
            description: "Retorna sugestões de encaminhamento para o Jardim da Heroína",
            parameters: {
              type: "object",
              properties: {
                pratica_sugerida: { type: "string", description: "Nome e descrição da prática sugerida" },
                escuta_sugerida: { type: "string", description: "Tipo de escuta/meditação recomendada" },
                territorio_foco: { type: "string", description: "Território simbólico para observar entre sessões" },
                reflexao_sugerida: { type: "string", description: "Pergunta-mãe ou convite reflexivo" },
                mensagem_final_sugerida: { type: "string", description: "Mensagem acolhedora para a cliente" },
                justificativa_clinica: { type: "string", description: "Explicação profissional para a terapeuta" },
              },
              required: ["pratica_sugerida", "escuta_sugerida", "territorio_foco", "reflexao_sugerida", "mensagem_final_sugerida", "justificativa_clinica"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "sugerir_encaminhamento" } },
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições atingido. Tente novamente em alguns instantes." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA esgotados." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await aiResponse.text();
      console.error("AI gateway error:", status, errText);
      throw new Error("Erro na IA");
    }

    const aiData = await aiResponse.json();
    let sugestao: any;

    // Extract from tool call
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      sugestao = typeof toolCall.function.arguments === "string"
        ? JSON.parse(toolCall.function.arguments)
        : toolCall.function.arguments;
    } else {
      // Fallback: try to parse content
      const content = aiData.choices?.[0]?.message?.content || "";
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      sugestao = JSON.parse(cleaned);
    }

    return new Response(JSON.stringify({ sugestao }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("sugerir-encaminhamento-jardim error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
