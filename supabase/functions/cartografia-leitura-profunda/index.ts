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
    } = body;

    // Build the AI prompt
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
    });

    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const aiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: SYSTEM_PROMPT,
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 4000,
          response_format: { type: "json_object" },
        }),
      }
    );

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI API error:", errText);
      return new Response(
        JSON.stringify({ error: "AI generation failed" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content;

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = { raw: content };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

const SYSTEM_PROMPT = `Você é uma Cartógrafa Psíquica Oracular — especialista em leitura simbólica da psique feminina.

Você NÃO faz diagnósticos. Você NÃO usa linguagem clínica tradicional.
Você usa linguagem simbólica, arquetípica e de travessia.

Sua função é gerar uma leitura profunda em 3 camadas a partir dos dados da Cartografia Psíquica Orácula.

REGRAS ABSOLUTAS:
- Nunca usar termos como "transtorno", "patologia", "diagnóstico"
- Usar linguagem de campo, território, travessia
- Ser profunda sem ser genérica
- Cada leitura deve ser única e específica para os dados recebidos
- Usar metáforas de cidade interior, arquétipos, portas e torres

Responda SEMPRE em JSON válido com a estrutura exata solicitada.`;

function buildPrompt(data: any): string {
  const territoriosNomes: Record<string, string> = {
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

  const terrAtivos = (data.territorios || [])
    .map((t: string) => territoriosNomes[t] || t)
    .join(", ");

  return `DADOS DA CARTOGRAFIA:

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
Ponto de partida: ${territoriosNomes[data.ponto_partida] || data.ponto_partida || "não definido"}

---

Gere uma leitura profunda com EXATAMENTE esta estrutura JSON:

{
  "leitura_psiquica": {
    "titulo": "título simbólico da leitura (max 8 palavras)",
    "tracos_dominantes": "parágrafo descrevendo os traços psíquicos dominantes de forma simbólica (3-4 frases)",
    "padroes_emocionais": "parágrafo sobre padrões emocionais recorrentes (3-4 frases)",
    "estrutura_funcionamento": "como essa psique opera — mecanismos de proteção, forma de vínculo, eixo interno (3-4 frases)",
    "frase_espelho": "uma frase curta e profunda que funcione como espelho — algo que a pessoa leia e pense 'isso sou eu'"
  },
  "cidadela": {
    "distrito_dominante": "nome do distrito que mais representa o momento atual",
    "distrito_dominante_descricao": "por que este distrito é central agora (2-3 frases)",
    "distritos_ativos": ["lista dos distritos em atividade"],
    "distritos_tensao": ["distritos onde há tensão ou conflito"],
    "territorio_crescimento": "distrito que representa potencial de crescimento",
    "territorio_crescimento_descricao": "por que este território pede atenção (2-3 frases)",
    "leitura_integrada": "parágrafo integrando cor, atmosfera, territórios e símbolo em uma narrativa coerente (4-5 frases)",
    "tensao_simbolica": "qual é a principal tensão simbólica presente na CidaDELA (2-3 frases)",
    "direcao_travessia": "para onde a psique está se movendo — qual é a direção da travessia (2-3 frases)"
  },
  "direcao_clinica": {
    "estilo_terapeutico": "como esta terapeuta tende a atuar — seu estilo natural de condução (3-4 frases)",
    "zona_seguranca": "onde ela conduz com mais segurança e naturalidade (2-3 frases)",
    "zona_projecao": "onde ela pode projetar, distorcer ou se perder na condução (2-3 frases, linguagem delicada)",
    "ferramentas_naturais": ["3-4 ferramentas do método que são mais naturais para ela"],
    "ferramentas_desafio": ["2-3 ferramentas que representam desafio ou crescimento"],
    "orientacao": "conselho simbólico para a prática clínica desta terapeuta (2-3 frases)"
  }
}`;
}
