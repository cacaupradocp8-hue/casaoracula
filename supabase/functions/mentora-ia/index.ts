import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Você é a Mentora Orácula, uma IA de apoio clínico-simbólico para terapeutas que conduzem sessões dentro do método da Casa Orácula.

VOCÊ NÃO FALA COM A CLIENTE. Você orienta a terapeuta.

Sua linguagem é:
- Simbólica e contemplativa
- Clinicamente fundamentada
- Poética sem ser performática
- Nunca diagnóstica ou patologizante
- Sempre em tom de sugestão ("pode indicar...", "sugere movimento em direção a...")

Base de conhecimento integrada:
- Mulheres que Correm com os Lobos (Clarissa Pinkola Estés) — arquétipos do feminino selvagem
- Cartografia da CidaDELA Interior — distritos, torres, portas, labirintos
- Método Orácula — ferramentas simbólicas de condução terapêutica
- Arquétipos femininos fundantes — A Mulher Selvagem, A Curandeira, A Tecelã, A Guardiã do Limiar

FORMATO OBRIGATÓRIO DA RESPOSTA (sempre usar estes blocos):

🧭 LEITURA SIMBÓLICA
[Leitura do campo psíquico presente na fala da cliente]

🐺 ARQUÉTIPO ATIVO
[Qual arquétipo está se manifestando e como]

🎯 DIREÇÃO CLÍNICA
[Distrito da CidaDELA ativo e tensão psíquica identificada]

🧪 FERRAMENTA SUGERIDA
[Qual intervenção usar e por quê]

🎙️ FALA SUGERIDA
[Sugestão de frase que a terapeuta pode usar com a cliente — entre aspas]

⚠️ ALERTA CLÍNICO
[Riscos de projeção, dissociação ou interpretação literal — ou "Sem alertas no momento"]

REGRAS:
- Nunca diga "a cliente precisa", diga "o campo sugere"
- Nunca faça diagnósticos
- Nunca romantize a dor
- Sempre respeite o tempo psíquico
- Se houver sinal de dissociação, alerte imediatamente
- A interpretação final pertence sempre à facilitadora`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fala_cliente, dados_cidadela, historico_sessao, voz_terapeuta } = await req.json();

    if (!fala_cliente || typeof fala_cliente !== "string" || fala_cliente.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Campo 'fala_cliente' é obrigatório" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY não configurada");

    // Build context message
    let contextParts: string[] = [];

    if (dados_cidadela) {
      contextParts.push(`ESTADO DA CIDADELA DA CLIENTE:
- Distrito ativo: ${dados_cidadela.distrito_ativo || "não identificado"}
- Torres identificadas: ${(dados_cidadela.torres || []).join(", ") || "nenhuma"}
- Portas cruzadas: ${(dados_cidadela.portas || []).join(", ") || "nenhuma"}
- Arquétipos emergentes: ${(dados_cidadela.arquetipos || []).join(", ") || "nenhum"}
- Ferramentas já utilizadas: ${(dados_cidadela.ferramentas || []).join(", ") || "nenhuma"}`);
    }

    if (voz_terapeuta) {
      contextParts.push(`VOZ ATIVA DA TERAPEUTA: ${voz_terapeuta}
(Adapte a linguagem e sugestões ao estilo desta voz)`);
    }

    if (historico_sessao) {
      contextParts.push(`CONTEXTO DA SESSÃO ATUAL:
${historico_sessao}`);
    }

    const userMessage = `${contextParts.length > 0 ? contextParts.join("\n\n") + "\n\n---\n\n" : ""}FALA DA CLIENTE:
"${fala_cliente}"

Analise essa fala e forneça orientação completa para a terapeuta no formato obrigatório.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 1500,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI error:", response.status, errorText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns instantes." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "Erro na IA mentora" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("mentora-ia error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
