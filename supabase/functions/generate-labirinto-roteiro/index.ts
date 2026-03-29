import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

// ============================================
// GERADOR DE ROTEIRO HÍBRIDO - LABIRINTO DA HEROÍNA INTERNA®
// Templates base + personalização leve via IA
// ============================================

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface CamadaSelecionada {
  tipo: "fase" | "arquetipo" | "metafora" | "ritual";
  id: string;
  nome: string;
  descricao?: string;
}

interface RequestBody {
  camadas: CamadaSelecionada[];
  sessionCaseId?: string;
  useAI?: boolean;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { camadas, sessionCaseId, useAI = true }: RequestBody = await req.json();

    if (!camadas || camadas.length === 0) {
      return new Response(JSON.stringify({ error: "Nenhuma camada selecionada" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`[generate-labirinto-roteiro] Gerando roteiro para ${camadas.length} camadas`);

    // Build context from selected layers
    const contexto = camadas.map(c => 
      `${c.tipo.toUpperCase()}: ${c.nome}${c.descricao ? ` - ${c.descricao}` : ""}`
    ).join("\n");

    // Base template structure (always present)
    const templateBase = {
      abertura: gerarAberturaBase(camadas),
      exploracao: gerarExploracaoBase(camadas),
      intervencao: gerarIntervencaoBase(camadas),
      fechamento: gerarFechamentoBase(camadas),
    };

    let roteiro = templateBase;
    let geradoPor = "template";

    // If AI enhancement is enabled, personalize each section
    if (useAI) {
      const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
      if (OPENAI_API_KEY) {
        try {
          const systemPrompt = `Você é uma assistente para terapeutas que trabalham com o método simbólico do Labirinto da Heroína Interna®.

REGRAS ABSOLUTAS:
- NÃO automatize fala da terapeuta
- NÃO interprete emoções da cliente
- NÃO sugira catarse ou liberação emocional
- NÃO faça diagnósticos ou interpretações clínicas
- Apenas ORGANIZE o campo simbólico da sessão

Seu papel é refinar os templates base para torná-los mais específicos às camadas escolhidas, mantendo linguagem simbólica, respeitosa e não-diretiva.

CONTEXTO DAS CAMADAS SELECIONADAS:
${contexto}`;

          const melhorias = await Promise.all([
            personalizarSecao("abertura", templateBase.abertura, systemPrompt, OPENAI_API_KEY),
            personalizarSecao("exploracao", templateBase.exploracao, systemPrompt, OPENAI_API_KEY),
            personalizarSecao("intervencao", templateBase.intervencao, systemPrompt, OPENAI_API_KEY),
            personalizarSecao("fechamento", templateBase.fechamento, systemPrompt, OPENAI_API_KEY),
          ]);

          roteiro = {
            abertura: melhorias[0] || templateBase.abertura,
            exploracao: melhorias[1] || templateBase.exploracao,
            intervencao: melhorias[2] || templateBase.intervencao,
            fechamento: melhorias[3] || templateBase.fechamento,
          };
          geradoPor = "hibrido";
        } catch (aiError) {
          console.error("[generate-labirinto-roteiro] Erro na IA, usando template base:", aiError);
        }
      }
    }

    // Persist the generated script
    const insertData: Record<string, unknown> = {
      user_id: user.id,
      abertura: roteiro.abertura,
      exploracao: roteiro.exploracao,
      intervencao: roteiro.intervencao,
      fechamento: roteiro.fechamento,
      gerado_por: geradoPor,
    };

    // Add layer references
    for (const camada of camadas) {
      if (camada.tipo === "fase") insertData.fase_id = camada.id;
      if (camada.tipo === "arquetipo") insertData.arquetipo_id = camada.id;
      if (camada.tipo === "metafora") insertData.metafora_id = camada.id;
      if (camada.tipo === "ritual") insertData.ritual_id = camada.id;
    }

    if (sessionCaseId) {
      insertData.session_case_id = sessionCaseId;
    }

    const { data: saved, error: saveError } = await supabase
      .from("labirinto_roteiros_gerados")
      .insert(insertData)
      .select()
      .single();

    if (saveError) {
      console.error("[generate-labirinto-roteiro] Erro ao salvar:", saveError);
    }

    return new Response(JSON.stringify({ 
      roteiro,
      id: saved?.id,
      geradoPor,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("[generate-labirinto-roteiro] Erro:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Erro desconhecido" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

// ============================================
// TEMPLATES BASE POR SEÇÃO
// ============================================

function gerarAberturaBase(camadas: CamadaSelecionada[]): string {
  const fase = camadas.find(c => c.tipo === "fase");
  const arquetipo = camadas.find(c => c.tipo === "arquetipo");

  let texto = `## Abertura Simbólica\n\n`;
  texto += `**Preparação do campo:**\n`;
  texto += `- Convide a cliente a respirar profundamente três vezes\n`;
  texto += `- Observe sua postura e presença antes de iniciar\n\n`;

  if (fase) {
    texto += `**Fase atual:** ${fase.nome}\n`;
    texto += `*Pergunta de ancoragem:* "Em que momento da sua travessia você se percebe agora?"\n\n`;
  }

  if (arquetipo) {
    texto += `**Arquétipo regente:** ${arquetipo.nome}\n`;
    texto += `*Convite inicial:* "Qual voz ou presença interna está mais ativa hoje?"\n\n`;
  }

  texto += `---\n*Aguarde silêncio. Não preencha o espaço.*`;
  
  return texto;
}

function gerarExploracaoBase(camadas: CamadaSelecionada[]): string {
  const metafora = camadas.find(c => c.tipo === "metafora");
  const fase = camadas.find(c => c.tipo === "fase");

  let texto = `## Exploração do Núcleo\n\n`;
  texto += `**Perguntas para o campo:**\n\n`;

  if (metafora) {
    texto += `### Metáfora: ${metafora.nome}\n`;
    texto += `- "Se essa imagem pudesse falar, o que ela diria?"\n`;
    texto += `- "O que essa metáfora reflete do seu momento atual?"\n`;
    texto += `- "Onde no corpo você sente essa imagem ressoar?"\n\n`;
  }

  if (fase) {
    texto += `### Fase: ${fase.nome}\n`;
    texto += `- "O que está sendo pedido nesse estágio?"\n`;
    texto += `- "O que você ainda resiste a ver?"\n\n`;
  }

  texto += `**Observações:**\n`;
  texto += `- Não interprete as respostas\n`;
  texto += `- Faça pausas entre perguntas\n`;
  texto += `- Observe padrões de repetição`;

  return texto;
}

function gerarIntervencaoBase(camadas: CamadaSelecionada[]): string {
  const ritual = camadas.find(c => c.tipo === "ritual");
  const arquetipo = camadas.find(c => c.tipo === "arquetipo");

  let texto = `## Intervenção Simbólica Leve\n\n`;
  texto += `**⚠️ Lembre-se:** Não force catarse. Não interprete. Apenas sustente.\n\n`;

  if (ritual) {
    texto += `### Ritual sugerido: ${ritual.nome}\n`;
    texto += `*Ofereça como possibilidade, não como prescrição.*\n\n`;
    texto += `**Convite:** "Se fizer sentido para você, podemos experimentar..."\n\n`;
  }

  if (arquetipo) {
    texto += `### Trabalho arquetípico\n`;
    texto += `**${arquetipo.nome}:**\n`;
    texto += `- Observe como esse arquétipo se manifesta na fala da cliente\n`;
    texto += `- Não nomeie diretamente para a cliente\n`;
    texto += `- Use perguntas abertas: "Como seria honrar essa parte?"\n\n`;
  }

  texto += `**Alternativas:**\n`;
  texto += `- Trabalho com respiração consciente\n`;
  texto += `- Escrita livre por 3 minutos\n`;
  texto += `- Movimento corporal sutil`;

  return texto;
}

function gerarFechamentoBase(camadas: CamadaSelecionada[]): string {
  const fase = camadas.find(c => c.tipo === "fase");
  
  let texto = `## Fechamento Ritual\n\n`;
  texto += `**Integração:**\n`;
  texto += `- "O que fica de mais importante desse encontro?"\n`;
  texto += `- "Há algo que você gostaria de levar consigo?"\n\n`;

  texto += `**Ancoragem:**\n`;
  texto += `- Convide a cliente a respirar novamente\n`;
  texto += `- Ofereça um momento de silêncio\n`;
  texto += `- Não faça resumos interpretativos\n\n`;

  if (fase) {
    texto += `**Nota para ${fase.nome}:**\n`;
    texto += `*Registre suas observações após a sessão, não durante.*\n\n`;
  }

  texto += `**Frase de fechamento:**\n`;
  texto += `*"Que esse trabalho continue ressoando no seu ritmo."*`;

  return texto;
}

// ============================================
// PERSONALIZAÇÃO VIA IA
// ============================================

async function personalizarSecao(
  secao: string,
  templateBase: string,
  systemPrompt: string,
  apiKey: string
): Promise<string | null> {
  const secaoNomes: Record<string, string> = {
    abertura: "Abertura Simbólica",
    exploracao: "Exploração do Núcleo",
    intervencao: "Intervenção Simbólica Leve",
    fechamento: "Fechamento Ritual",
  };

  const userPrompt = `Refine este template da seção "${secaoNomes[secao]}" para torná-lo mais específico às camadas escolhidas.

TEMPLATE BASE:
${templateBase}

INSTRUÇÕES:
- Mantenha a estrutura markdown
- Torne as perguntas mais conectadas às camadas específicas
- NÃO adicione interpretações ou diagnósticos
- NÃO sugira catarse
- Mantenha tom respeitoso e não-diretivo
- Retorne APENAS o texto refinado, sem explicações`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.4,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      console.error(`[IA] Erro na seção ${secao}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.error(`[IA] Falha na seção ${secao}:`, error);
    return null;
  }
}
