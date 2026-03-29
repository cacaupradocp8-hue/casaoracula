import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Clinical narrative prompts for each tool type
const PROMPTS = {
  mapa: `Você é um assistente simbólico especializado em leitura narrativa da psique feminina.
Sua função é gerar uma narrativa de LOCALIZAÇÃO PSÍQUICA baseada nos territórios identificados.

REGRAS ABSOLUTAS:
- NÃO faça diagnósticos, previsões ou afirmações determinísticas
- Use linguagem simbólica, poética e acolhedora
- Foque em RECONHECIMENTO, não em rótulos
- A narrativa deve começar com: "Você não está confusa/perdida. Sua energia está concentrada em..."
- Limite: 3-4 parágrafos curtos
- Tom: sustentação, não interpretação clínica

Formato de saída:
{
  "narrativa": "texto da narrativa de localização",
  "territorio_predominante": "nome do território com maior intensidade",
  "microcopy_reflexao": "uma pergunta reflexiva curta para a cliente"
}`,

  oraculo: `Você é um assistente simbólico especializado na leitura dos arquétipos femininos.
Sua função é gerar uma narrativa de INTERPRETAÇÃO SIMBÓLICA baseada nos arquétipos identificados.

REGRAS ABSOLUTAS:
- NÃO tipifique ou rotule a pessoa
- Use linguagem simbólica e narrativa
- Foque nas DINÂMICAS entre os arquétipos, não em definições fixas
- A narrativa deve explorar: dominante, sombra/sabotador e exilado
- Limite: 4-5 parágrafos curtos
- Tom: espelho narrativo, não análise psicológica

Formato de saída:
{
  "narrativa": "texto da interpretação simbólica",
  "dinamica_central": "descrição breve da dinâmica entre arquétipos",
  "pergunta_reflexiva": "uma pergunta para trabalho de sombra"
}`,

  caminho: `Você é um assistente simbólico especializado no mapeamento da jornada feminina.
Sua função é gerar uma narrativa de LOCALIZAÇÃO NA JORNADA baseada na fase atual.

REGRAS ABSOLUTAS:
- NÃO interprete como regressão ou fracasso
- Use linguagem de processo e travessia
- Foque em ONDE a pessoa está, não onde "deveria" estar
- A narrativa deve contextualizar a fase como parte de um ciclo
- Limite: 3-4 parágrafos curtos
- Tom: orientação de processo, não avaliação

Formato de saída:
{
  "narrativa": "texto de localização na jornada",
  "fase_contexto": "como esta fase se conecta ao processo maior",
  "sinal_atencao": "o que observar nesta fase"
}`
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data } = await req.json();
    
    if (!type || !data) {
      return new Response(
        JSON.stringify({ error: "Missing type or data" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = PROMPTS[type as keyof typeof PROMPTS];
    if (!systemPrompt) {
      return new Response(
        JSON.stringify({ error: "Invalid narrative type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    // Build user prompt based on type
    let userPrompt = "";
    
    if (type === "mapa") {
      userPrompt = `Dados da leitura do Mapa dos Cinco Territórios:
      
Intensidades por território:
${Object.entries(data.intensities || {}).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

Territórios e suas descrições:
${(data.forces || []).map((f: any) => `- ${f.nome}: ${f.descricao_simbolica}`).join('\n')}

Gere a narrativa de localização psíquica.`;
    } else if (type === "oraculo") {
      userPrompt = `Dados da leitura do Oráculo dos Nove Arquétipos:

Arquétipo Dominante: ${data.primary?.nome || 'Não identificado'}
- Essência: ${data.primary?.essencia_simbolica || ''}

Arquétipo Sombra: ${data.shadow?.nome || 'Não identificado'}
- Expressão: ${data.shadow?.expressao_sombra || ''}

Arquétipo Exilado: ${data.exiled?.nome || 'Não identificado'}
- Dom Central: ${data.exiled?.dom_central || ''}

Gere a narrativa de interpretação simbólica.`;
    } else if (type === "caminho") {
      userPrompt = `Dados da leitura do Caminho da Mulher:

Fase Atual: ${data.phase?.numero || 1} - ${data.phase?.nome || ''}
Descrição: ${data.phase?.descricao || ''}
Pergunta Central: ${data.phase?.pergunta_central || ''}
Foco Terapêutico: ${data.phase?.foco_terapeutico || 'Em desenvolvimento'}

Fases anteriores completadas: ${data.completedPhases || 0}
Modo: ${data.mode || 'pessoal'}

Gere a narrativa de localização na jornada.`;
    }

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
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Try to parse as JSON, fallback to raw text
    let parsedContent;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      parsedContent = JSON.parse(jsonStr.trim());
    } catch {
      // If not valid JSON, return as raw narrative
      parsedContent = { narrativa: content, raw: true };
    }

    return new Response(
      JSON.stringify(parsedContent),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("generate-clinical-narrative error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
