import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TIPO_LABELS: Record<string, string> = {
  sessao_individual: "Sessão Individual",
  experiencia_grupo: "Experiência de Grupo",
  ritual: "Ritual",
  produto_programa: "Produto / Programa",
  aula_conteudo: "Aula / Conteúdo",
};

const PUBLICO_LABELS: Record<string, string> = {
  mulher_individual: "Mulher individual",
  grupo_mulheres: "Grupo de mulheres",
  publico_profissional: "Público profissional",
};

const MOMENTO_LABELS: Record<string, string> = {
  inicio: "Início",
  crise_transicao: "Crise / Transição",
  integracao: "Integração",
  fechamento: "Fechamento",
};

const TEMPO_LABELS: Record<string, string> = {
  "30min": "30 minutos",
  "50min": "50 minutos",
  "90min": "90 minutos",
  jornada_multipla: "Jornada multi-sessão",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tipo, publico_alvo, momento_jornada, tempo_disponivel, tema_principal } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Você é SYNTHEIA, uma ferramenta profissional de apoio simbólico para terapeutas, psicólogas, mentoras e facilitadoras.

Sua função é gerar estruturas práticas e aplicáveis para contextos terapêuticos reais.

REGRAS ABSOLUTAS:
- Nunca fale diretamente com clientes
- Nunca ofereça diagnósticos
- Nunca gere inspiração abstrata sem passos concretos
- Use linguagem simbólica mas sóbria
- Seja profissional, ancorada e respeitosa com a responsabilidade clínica

NÚCLEOS INTERNOS (use automaticamente, não exponha):
- Ferramenteira: execução prática (sessões, rituais, exercícios)
- Archétypos: estrutura (produtos, programas, serviços)
- Aracne & Arcano: linguagem simbólica (arquétipos, metáforas, narrativas)

FORMATO DE RESPOSTA (JSON estrito):
{
  "titulo": "Título curto e evocativo para esta criação",
  "chave_simbolica": "Uma metáfora ou imagem arquetípica central (1-2 linhas)",
  "intencao_terapeutica": "O que esta estrutura apoia emocional ou simbolicamente",
  "estrutura_pratica": "Estrutura passo-a-passo com bullet points, tempos sugeridos, sequência clara. Use markdown.",
  "suporte_linguagem": "Perguntas-chave, frases de sustentação, o que NÃO forçar ou interpretar. Use markdown.",
  "fechamento_integracao": "Sugestão de fechamento seguro, âncora simbólica opcional"
}`;

    const userPrompt = `Crie uma estrutura para:

TIPO: ${TIPO_LABELS[tipo] || tipo}
PÚBLICO-ALVO: ${PUBLICO_LABELS[publico_alvo] || publico_alvo}
MOMENTO DA JORNADA: ${MOMENTO_LABELS[momento_jornada] || momento_jornada}
TEMPO DISPONÍVEL: ${TEMPO_LABELS[tempo_disponivel] || tempo_disponivel}
TEMA PRINCIPAL: ${tema_principal}

Responda APENAS com o JSON no formato especificado, sem texto adicional.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns minutos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes. Adicione créditos à sua conta." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Erro ao gerar conteúdo" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in response");
    }

    // Parse JSON from response (handle potential markdown code blocks)
    let parsed;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      parsed = JSON.parse(jsonMatch[1].trim());
    } catch (e) {
      console.error("Failed to parse JSON:", content);
      throw new Error("Failed to parse AI response");
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("syntheia-generate error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
