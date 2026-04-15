import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No auth" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const {
      medias_big5,
      predominante,
      fragilizado,
      cor,
      atmosfera,
      territorios,
      recursos,
      conflitos,
      simbolo,
      ponto_partida,
      modo = "terapeuta",
      client_context,
    } = body;

    const prompt = buildPrompt({
      medias_big5,
      predominante,
      fragilizado,
      cor,
      atmosfera,
      territorios,
      recursos,
      conflitos,
      simbolo,
      ponto_partida,
      modo,
      client_context,
    });

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OPENAI_API_KEY not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const systemPrompt = modo === "cliente" ? SYSTEM_PROMPT_CLIENT : SYSTEM_PROMPT_THERAPIST;

    const aiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 4000,
        }),
      }
    );

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI API error:", aiResponse.status, errText);

      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment.", fallback: true }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds.", fallback: true }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "AI generation failed", fallback: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content;

    let parsed;
    try {
      // Strip markdown code fences if present
      let cleaned = content || "";
      cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { raw: content };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message, fallback: true }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// ══════════════════════════════════════════════════════════════
// SYSTEM PROMPTS
// ══════════════════════════════════════════════════════════════

const SYSTEM_PROMPT_THERAPIST = `Você é uma Cartógrafa Psíquica Oracular — especialista em leitura simbólica da psique feminina.

Você NÃO faz diagnósticos. Você NÃO usa linguagem clínica tradicional.
Você usa linguagem simbólica, arquetípica e de travessia.

Sua função é gerar uma leitura profunda em 3 camadas para uma TERAPEUTA que está mapeando a si mesma.

REGRAS ABSOLUTAS:
- Nunca usar termos como "transtorno", "patologia", "diagnóstico"
- Usar linguagem de campo, território, travessia
- Ser profunda sem ser genérica
- Cada leitura deve ser única e específica para os dados recebidos
- Usar metáforas de cidade interior, arquétipos, portas e torres
- A Direção Clínica deve ser ACIONÁVEL — sugerir ações concretas

Responda SEMPRE em JSON válido com a estrutura exata solicitada. Não use markdown code fences.`;

const SYSTEM_PROMPT_CLIENT = `Você é uma Cartógrafa Psíquica Oracular — especialista em leitura simbólica da psique feminina.

Sua função é gerar uma leitura clínica profunda de uma CLIENTE em processo terapêutico.
Esta leitura será usada pela TERAPEUTA como GPS de decisão clínica.

REGRAS ABSOLUTAS:
- Nunca usar termos como "transtorno", "patologia"
- Usar linguagem simbólica mas com clareza clínica
- Ser profunda, específica e ACIONÁVEL
- Cada leitura deve gerar DIREÇÕES CONCRETAS para a facilitadora
- Identificar riscos, pontos de atenção e oportunidades terapêuticas
- Sugerir ferramentas específicas do método (Torres, Portas, Labirinto, Forja, etc.)

Responda SEMPRE em JSON válido com a estrutura exata solicitada. Não use markdown code fences.`;

// ══════════════════════════════════════════════════════════════
// PROMPT BUILDER
// ══════════════════════════════════════════════════════════════

const TERRITORIOS_NOMES: Record<string, string> = {
  portao_chegada: "Portão da Chegada",
  torres: "Torres",
  portas: "Portas",
  jardim_arquetipos: "Jardim dos Arquétipos",
  praca_abalo: "Praça do Abalo",
  casa_sonhos: "Casa dos Sonhos",
  espelho_vinculos: "Espelho dos Vínculos",
  forja: "Forja",
  conselho_interior: "Conselho Interior",
  labirinto: "Labirinto",
  praca_integracao: "Praça da Integração",
  portal_renascimento: "Portal de Renascimento",
};

function buildPrompt(data: any): string {
  const terrAtivos = (data.territorios || [])
    .map((t: string) => TERRITORIOS_NOMES[t] || t)
    .join(", ");

  const baseData = `DADOS DA CARTOGRAFIA:

Big5 Oracular (médias 1-5):
${Object.entries(data.medias_big5 || {})
  .map(([k, v]) => `- ${k}: ${v}`)
  .join("\n")}

Fator Predominante: ${data.predominante || "não identificado"}
Fator Fragilizado: ${data.fragilizado || "não identificado"}

Cor da cidade interior: ${data.cor || "não selecionada"}
Atmosfera: ${(data.atmosfera || []).join(", ")}
Territórios ativos: ${terrAtivos}
Recursos internos: ${data.recursos || "não informado"}
Conflitos/tensões: ${data.conflitos || "não informado"}
Símbolo pessoal: ${data.simbolo || "não selecionado"}
Ponto de partida: ${TERRITORIOS_NOMES[data.ponto_partida] || data.ponto_partida || "não definido"}`;

  const clientContext = data.client_context
    ? `\n\nCONTEXTO DA CLIENTE:\n${data.client_context}`
    : "";

  const structure = data.modo === "cliente"
    ? CLIENT_JSON_STRUCTURE
    : THERAPIST_JSON_STRUCTURE;

  return `${baseData}${clientContext}\n\n---\n\nGere uma leitura profunda com EXATAMENTE esta estrutura JSON:\n\n${structure}`;
}

const THERAPIST_JSON_STRUCTURE = `{
  "leitura_psiquica": {
    "titulo": "título simbólico da leitura (max 8 palavras)",
    "tracos_dominantes": "parágrafo descrevendo os traços psíquicos dominantes de forma simbólica (3-4 frases)",
    "padroes_emocionais": "parágrafo sobre padrões emocionais recorrentes (3-4 frases)",
    "estrutura_funcionamento": "como essa psique opera — mecanismos de proteção, forma de vínculo, eixo interno (3-4 frases)",
    "frase_espelho": "uma frase curta e profunda que funcione como espelho"
  },
  "cidadela": {
    "distrito_dominante": "nome do distrito central",
    "distrito_dominante_descricao": "por que este distrito é central agora (2-3 frases)",
    "distritos_ativos": ["lista dos distritos em atividade"],
    "distritos_tensao": ["distritos onde há tensão ou conflito"],
    "territorio_crescimento": "distrito que representa potencial de crescimento",
    "territorio_crescimento_descricao": "por que este território pede atenção (2-3 frases)",
    "leitura_integrada": "parágrafo integrando cor, atmosfera, territórios e símbolo em narrativa coerente (4-5 frases)",
    "tensao_simbolica": "principal tensão simbólica na CidaDELA (2-3 frases)",
    "direcao_travessia": "para onde a psique se move — direção da travessia (2-3 frases)"
  },
  "direcao_clinica": {
    "estilo_terapeutico": "como esta terapeuta tende a atuar — estilo natural de condução (3-4 frases)",
    "zona_seguranca": "onde conduz com segurança e naturalidade (2-3 frases)",
    "zona_projecao": "onde pode projetar ou distorcer na condução (2-3 frases, linguagem delicada)",
    "ferramentas_naturais": ["3-4 ferramentas do método mais naturais para ela"],
    "ferramentas_desafio": ["2-3 ferramentas que representam desafio ou crescimento"],
    "orientacao": "conselho simbólico para a prática clínica (2-3 frases)"
  }
}`;

const CLIENT_JSON_STRUCTURE = `{
  "leitura_psiquica": {
    "titulo": "título simbólico da leitura (max 8 palavras)",
    "tracos_dominantes": "traços psíquicos dominantes observados (3-4 frases)",
    "padroes_emocionais": "padrões emocionais recorrentes identificados (3-4 frases)",
    "estrutura_funcionamento": "como essa psique opera — mecanismos e eixo interno (3-4 frases)",
    "frase_espelho": "uma frase que funcione como espelho para a cliente",
    "conflitos_ativos": "conflitos ou tensões em atividade neste momento (2-3 frases)"
  },
  "cidadela": {
    "distrito_dominante": "distrito que mais representa o momento atual da cliente",
    "distrito_dominante_descricao": "por que este distrito é central agora (2-3 frases)",
    "distritos_ativos": ["distritos em atividade"],
    "distritos_tensao": ["distritos em tensão"],
    "territorio_crescimento": "distrito de potencial de crescimento",
    "territorio_crescimento_descricao": "por que (2-3 frases)",
    "nivel_integracao": "baixo | medio | alto — avaliação do nível de integração geral",
    "leitura_integrada": "narrativa simbólica integrada (4-5 frases)",
    "tensao_simbolica": "principal tensão simbólica (2-3 frases)",
    "direcao_travessia": "direção da travessia — para onde a psique se move (2-3 frases)"
  },
  "direcao_clinica": {
    "abordagem": "como abordar esta cliente neste momento — postura recomendada para a facilitadora (3-4 frases)",
    "risco": "riscos de projeção ou condução inadequada a observar (2-3 frases)",
    "sugestoes": ["3-5 ações concretas: ferramentas, perguntas ou intervenções sugeridas"],
    "ferramentas_indicadas": ["2-3 ferramentas específicas do método indicadas para este momento"],
    "distrito_foco": "distrito que deve ser foco da próxima sessão",
    "pergunta_clinica": "uma pergunta-chave que a facilitadora deveria explorar com a cliente"
  }
}`;