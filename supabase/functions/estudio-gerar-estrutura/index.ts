import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { livro_titulo, livro_autor, livro_texto, publico_alvo, jornada, estacao_simbolica, num_encontros } = await req.json();

    if (!livro_titulo) throw new Error("Título do livro é obrigatório");

    const systemPrompt = `Você é uma pedagoga simbólica especialista no Método de Leitura Oracular da Casa Orácula.

Seu papel é criar uma ESTRUTURA PEDAGÓGICA completa para um grupo de leitura simbólica baseado em um livro.

REGRAS ABSOLUTAS:
- Arquétipo é campo, NÃO rótulo
- Não resumir o livro literalmente
- Não usar linguagem motivacional ou acadêmica
- Não criar identidades arquetípicas fixas
- Foco em tensões psíquicas, não em conteúdo informativo
- Cada encontro deve ter abertura ritual e encerramento ritual
- Incluir alertas clínicos quando necessário
- O núcleo 80/20 identifica onde está a força transformadora real do livro

Retorne um JSON estruturado com exatamente estes campos:
{
  "titulo_pedagogico": "string - título do programa de leitura",
  "essencia_8020": "string - o núcleo transformador do livro (2-3 parágrafos)",
  "tensoes_centrais": ["array de strings - as tensões psíquicas principais"],
  "arquetipos_envolvidos": ["array de strings - campos arquetípicos presentes"],
  "mapa_simbolico": "string - descrição do mapa simbólico do livro",
  "encontros": [
    {
      "numero": 1,
      "titulo": "string",
      "fase": "Chamado | Ruptura | Reorganização | Integração",
      "tema_central": "string",
      "abertura_ritual": "string - sugestão de abertura",
      "perguntas_guiadas": ["array de 3-5 perguntas terapêuticas"],
      "aplicacao_profissional": "string - como aplicar em sessão",
      "alerta_clinico": "string ou null",
      "encerramento_ritual": "string - sugestão de encerramento"
    }
  ],
  "usos_inadequados": ["array de strings - o que NÃO fazer com este material"],
  "convites_jardim_psique": ["array de 3 perguntas para reflexão pessoal"],
  "convites_jardim_oficio": ["array de 3 perguntas para reflexão profissional"]
}`;

    const userPrompt = `Crie a estrutura pedagógica para:

LIVRO: "${livro_titulo}" ${livro_autor ? `de ${livro_autor}` : ''}
${livro_texto ? `\nTRECHO/RESUMO DO LIVRO:\n${livro_texto.substring(0, 8000)}` : ''}

CONFIGURAÇÃO:
- Público-alvo: ${publico_alvo || 'grupo terapêutico'}
- Jornada predominante: ${jornada || 'Individuação'}
- Estação simbólica: ${estacao_simbolica || 'Primavera'}
- Número de encontros: ${num_encontros || 4}

Gere a estrutura completa em JSON.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
        tools: [
          {
            type: "function",
            function: {
              name: "gerar_estrutura_pedagogica",
              description: "Retorna a estrutura pedagógica completa para um programa de leitura simbólica",
              parameters: {
                type: "object",
                properties: {
                  titulo_pedagogico: { type: "string" },
                  essencia_8020: { type: "string" },
                  tensoes_centrais: { type: "array", items: { type: "string" } },
                  arquetipos_envolvidos: { type: "array", items: { type: "string" } },
                  mapa_simbolico: { type: "string" },
                  encontros: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        numero: { type: "number" },
                        titulo: { type: "string" },
                        fase: { type: "string" },
                        tema_central: { type: "string" },
                        abertura_ritual: { type: "string" },
                        perguntas_guiadas: { type: "array", items: { type: "string" } },
                        aplicacao_profissional: { type: "string" },
                        alerta_clinico: { type: "string" },
                        encerramento_ritual: { type: "string" },
                      },
                      required: ["numero", "titulo", "fase", "tema_central", "perguntas_guiadas"],
                    },
                  },
                  usos_inadequados: { type: "array", items: { type: "string" } },
                  convites_jardim_psique: { type: "array", items: { type: "string" } },
                  convites_jardim_oficio: { type: "array", items: { type: "string" } },
                },
                required: ["titulo_pedagogico", "essencia_8020", "encontros"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "gerar_estrutura_pedagogica" } },
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
      throw new Error("Erro no gateway de IA");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    let estrutura;
    if (toolCall) {
      estrutura = JSON.parse(toolCall.function.arguments);
    } else {
      // Fallback: try to parse content as JSON
      const content = data.choices?.[0]?.message?.content || "";
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        estrutura = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Não foi possível gerar a estrutura");
      }
    }

    return new Response(JSON.stringify({ estrutura }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("estudio-gerar-estrutura error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
