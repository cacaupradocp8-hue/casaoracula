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

    const systemPrompt = `Você é a pedagoga simbólica mestre da Casa Orácula, especialista no Método de Leitura Oracular e na estrutura dos Círculos de Leitura Simbólica.

CONTEXTO DA CASA ORÁCULA:
A Casa Orácula é uma plataforma de formação terapêutica e simbólica para mulheres — terapeutas, psicólogas, mentoras do feminino e facilitadoras. O trabalho se organiza em Círculos de Leitura Simbólica que seguem uma progressão de travessia interior.

ESTRUTURA DAS JORNADAS (obrigatório usar como base):
Existem 5 Jornadas que organizam toda a travessia formativa:
1. JORNADA DA HEROÍNA — individuação, chamado, descida e retorno
2. JORNADA DA SOMBRA — confronto com o que foi negado, projeções, integração do escuro
3. JORNADA DO INSTINTO — corpo, impulso, sabedoria animal, limites orgânicos
4. JORNADA DA LIDERANÇA — poder, autoridade interior, responsabilidade simbólica
5. JORNADA DO MUNDO — relação com o coletivo, entrega, legado

FASES DE TRAVESSIA (obrigatório para cada encontro):
Cada programa segue obrigatoriamente 4 fases, distribuídas pelos encontros:
- CHAMADO — O livro chama. Primeira escuta. O que ressoa antes de compreender.
- RUPTURA — O que o livro desestabiliza. Onde a leitora se vê confrontada.
- REORGANIZAÇÃO — O que começa a se mover internamente. Novas possibilidades.
- INTEGRAÇÃO — O que fica no corpo. O gesto concreto. O que muda na prática.

BLOCOS PEDAGÓGICOS OBRIGATÓRIOS (inspirados na Aula-Álbum):
Para cada encontro, gere:
1. Tema central — a tensão psíquica principal (não resumo do livro)
2. Abertura ritual — gesto simbólico de abertura do campo (breve, corporal)
3. Perguntas guiadas — 3 a 5 perguntas terapêuticas profundas (NÃO perguntas sobre o conteúdo do livro)
4. Aplicação profissional — como a mentora pode usar em sessão individual, grupo terapêutico ou círculo
5. O que NÃO fazer — erros comuns de facilitadoras iniciantes neste tema
6. Alerta clínico — quando houver risco de projeção, interpretação literal ou uso inadequado
7. Encerramento ritual — gesto de fechamento do campo

REGRAS DE LINGUAGEM (CRÍTICO):
- Escreva em português brasileiro fluente, correto e natural
- Tom: profundo, ético, humano — sem misticismo performático
- NUNCA use linguagem motivacional ("você pode!", "desperte seu potencial")
- NUNCA use tom acadêmico ou didático excessivo
- Arquétipo é CAMPO, nunca rótulo — não diga "você é a Selvagem"
- Não resuma o livro — trabalhe com as TENSÕES que ele ativa
- Frases curtas e precisas, sem floreio desnecessário

O NÚCLEO 80/20:
É o coração do método. Identifique: dos muitos temas do livro, qual é O ÚNICO eixo transformador que, se bem trabalhado, gera 80% do amadurecimento possível? Isso deve ser claro, prático e aplicável.

QUALIDADE EXIGIDA:
Este material será usado por profissionais em formação. Cada frase precisa ter peso clínico e ético. Prefira silêncio a enchimento. Se uma seção não se aplica, deixe em branco — não invente conteúdo genérico.`;

    const userPrompt = `Crie a estrutura pedagógica completa para um Círculo de Leitura Simbólica:

LIVRO: "${livro_titulo}" ${livro_autor ? `de ${livro_autor}` : ''}
${livro_texto ? `\nCONTEXTO/TRECHOS DO LIVRO:\n${livro_texto.substring(0, 8000)}` : ''}

CONFIGURAÇÃO DO CÍRCULO:
- Público-alvo: ${publico_alvo || 'grupo terapêutico'}
- Jornada predominante: ${jornada || 'Individuação'}
- Estação simbólica: ${estacao_simbolica || 'Primavera'}
- Número de encontros: ${num_encontros || 4}

INSTRUÇÕES FINAIS:
- Distribua as 4 fases (Chamado, Ruptura, Reorganização, Integração) pelos ${num_encontros || 4} encontros
- Se houver mais de 4 encontros, repita ou aprofunde fases conforme necessário
- Cada pergunta guiada deve ser uma pergunta que provoque movimento interno, não compreensão intelectual
- A essência 80/20 deve caber em 2-3 frases diretas e poderosas
- O mapa simbólico deve descrever a paisagem interior que o livro ativa

Gere a estrutura completa em JSON.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "gerar_estrutura_pedagogica",
              description: "Retorna a estrutura pedagógica completa para um Círculo de Leitura Simbólica da Casa Orácula",
              parameters: {
                type: "object",
                properties: {
                  titulo_pedagogico: { type: "string", description: "Título do programa — breve e simbólico" },
                  jornada_predominante: { type: "string", description: "Uma das 5 jornadas: Heroína, Sombra, Instinto, Liderança, Mundo" },
                  essencia_8020: { type: "string", description: "O núcleo transformador do livro em 2-3 frases diretas" },
                  tensoes_centrais: { type: "array", items: { type: "string" }, description: "3-5 tensões psíquicas que o livro ativa" },
                  arquetipos_envolvidos: { type: "array", items: { type: "string" }, description: "Campos arquetípicos presentes (como campos, não rótulos)" },
                  mapa_simbolico: { type: "string", description: "A paisagem interior que o livro ativa — descrição poética e precisa" },
                  encontros: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        numero: { type: "number" },
                        titulo: { type: "string", description: "Título breve e evocativo" },
                        fase: { type: "string", enum: ["Chamado", "Ruptura", "Reorganização", "Integração"] },
                        tema_central: { type: "string", description: "A tensão psíquica deste encontro — não resumo do livro" },
                        abertura_ritual: { type: "string", description: "Gesto corporal ou simbólico breve para abrir o campo" },
                        perguntas_guiadas: { type: "array", items: { type: "string" }, description: "3-5 perguntas terapêuticas profundas" },
                        aplicacao_profissional: { type: "string", description: "Como usar em sessão, grupo ou círculo" },
                        o_que_nao_fazer: { type: "string", description: "Erros comuns de facilitadoras iniciantes neste tema" },
                        alerta_clinico: { type: "string", description: "Risco de projeção ou uso inadequado, se houver" },
                        encerramento_ritual: { type: "string", description: "Gesto de fechamento do campo" },
                      },
                      required: ["numero", "titulo", "fase", "tema_central", "perguntas_guiadas", "abertura_ritual", "encerramento_ritual"],
                    },
                  },
                  usos_inadequados: { type: "array", items: { type: "string" }, description: "5-7 usos inadequados deste material" },
                  convites_jardim_psique: { type: "array", items: { type: "string" }, description: "3 perguntas para reflexão pessoal profunda" },
                  convites_jardim_oficio: { type: "array", items: { type: "string" }, description: "3 perguntas para reflexão profissional" },
                  observacao_clinica: { type: "string", description: "Nota sobre cuidados éticos ao facilitar este livro" },
                },
                required: ["titulo_pedagogico", "jornada_predominante", "essencia_8020", "encontros", "usos_inadequados"],
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
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA esgotados." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
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
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
