import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function buildMapaVivoBlock(mv: Record<string, unknown> | null): string {
  if (!mv) return "Sem histórico longitudinal disponível.";

  const lines: string[] = [];
  if (mv.estado_atual) lines.push(`Estado longitudinal: ${mv.estado_atual}`);
  if (mv.direcao_atual) lines.push(`Direção longitudinal: ${mv.direcao_atual}`);
  if (mv.risco_atual) lines.push(`Risco longitudinal: ${mv.risco_atual}`);
  if (mv.ritmo_atual) lines.push(`Ritmo da travessia: ${mv.ritmo_atual}`);
  if (mv.repeticao_detectada) lines.push("⚠ REPETIÇÃO DE PADRÃO DETECTADA");
  if (mv.travessia_travada) lines.push("⚠ TRAVESSIA TRAVADA");
  if (mv.integracao_em_curso) lines.push("✦ INTEGRAÇÃO EM CURSO");

  return lines.length > 0 ? lines.join("\n") : "Sem dados longitudinais significativos.";
}

function buildBehavioralRules(mv: Record<string, unknown> | null): string {
  if (!mv) return "";

  const rules: string[] = [];

  if (mv.repeticao_detectada) {
    rules.push(
      "REGRA ATIVA — REPETIÇÃO: Não ofereça novas interpretações. Reforce espelho. Mostre que o padrão continua ativo sem julgamento."
    );
  }
  if (mv.travessia_travada) {
    rules.push(
      "REGRA ATIVA — TRAVESSIA TRAVADA: Sugira uma nova entrada no mesmo campo, não um novo campo. Evite sugerir avanço."
    );
  }
  if (mv.integracao_em_curso) {
    rules.push(
      "REGRA ATIVA — INTEGRAÇÃO EM CURSO: Reduza a fala. Reforce permanência. Não introduza novas ferramentas ou direções."
    );
  }
  if (mv.risco_atual === "elevado") {
    rules.push(
      "REGRA ATIVA — RISCO ELEVADO: Apenas contenção. Nunca aprofundar. Nunca confrontar. Priorize segurança."
    );
  }

  return rules.length > 0 ? "\n\nREGRAS COMPORTAMENTAIS (obrigatórias):\n" + rules.join("\n") : "";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { mode, context, cliente_nome, mapa_vivo } = await req.json();

    if (!context) {
      return new Response(JSON.stringify({ error: "context é obrigatório" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const isSussurro = mode === "sussurro";

    const mapaBlock = buildMapaVivoBlock(mapa_vivo);
    const behavioralRules = buildBehavioralRules(mapa_vivo);

    const systemPrompt = isSussurro
      ? `Você é o Modo Sussurro da cabine terapêutica. Gere UMA ÚNICA frase curta, discreta e não invasiva para orientar a terapeuta no momento atual da sessão. Máximo 20 palavras. Sem explicação. Sem diagnóstico. Sem linguagem técnica. Apenas uma microleitura sutil.

Exemplos:
- "Sustente mais antes de interpretar."
- "Há ambivalência ainda não elaborada."
- "Pergunta melhor do que explicação agora."
- "Talvez seja hora de sintetizar, não aprofundar."
- "O silêncio pode ser mais terapêutico aqui."

Considere o estado do campo e o risco ao gerar o sussurro. Se risco elevado, priorize contenção.

MEMÓRIA LONGITUDINAL (Mapa Vivo):
${mapaBlock}${behavioralRules}`
      : `Você é SINTHEYA, inteligência clínica invisível da cabine terapêutica da Casa Orácula.

Você NÃO responde como assistente. Você responde como continuidade do processo terapêutico.
Sua leitura deve considerar o histórico longitudinal, o momento presente e a direção da sessão.

MEMÓRIA LONGITUDINAL (Mapa Vivo):
${mapaBlock}${behavioralRules}

Responda SEMPRE no seguinte formato JSON exato:

{
  "nucleo": "O que está acontecendo no campo — considerando trajetória e momento — 1-2 frases",
  "leitura_simbolica": "Padrão simbólico ou movimento atual — conectado ao histórico — 1-2 frases",
  "direcao": "O que a terapeuta pode fazer agora — alinhado à direção longitudinal — 1-2 frases",
  "limite": "Quando necessário: limite ético ou alerta — pode ser null"
}

Regras:
- Curto e preciso
- Sem linguagem diagnóstica
- Sem texto longo
- Sem nome de Orácula
- Priorize permanência antes de transição
- Se risco elevado: sugira contenção, nunca confronto
- Se campo ainda ativo: não sugira mudança
- Se repetição detectada: espelhe, não interprete
- Se integração em curso: silencie, não acelere
- Linguagem simbólica operacional, não mística`;

    const userMessage = isSussurro
      ? `Estado do campo: ${context.estado_campo}. Direção: ${context.direcao_conducao}. Risco: ${context.risco}. Check-in: ${context.checkin || "não registrado"}. Anotações: ${context.anotacoes || "nenhuma"}.`
      : `Cliente: ${cliente_nome || "anônima"}.
Estado do campo: ${context.estado_campo}.
Direção de condução: ${context.direcao_conducao}.
Risco: ${context.risco}.
Permanência: ${context.permanencia || "nenhuma"}.
Alerta: ${context.alerta || "nenhum"}.
Check-in: ${context.checkin || "não registrado"}.
Anotações: ${context.anotacoes || "nenhuma"}.
Ferramenta: ${context.ferramenta || "nenhuma"}.`;

    // Use Lovable AI Gateway
    const gatewayUrl = "https://ai.gateway.lovable.dev/v1/chat/completions";
    const gatewayKey = Deno.env.get("LOVABLE_API_KEY");

    if (!gatewayKey) {
      return new Response(JSON.stringify({ error: "AI Gateway não configurado" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResponse = await fetch(gatewayUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${gatewayKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        max_tokens: isSussurro ? 60 : 400,
        temperature: isSussurro ? 0.7 : 0.5,
        ...(isSussurro ? {} : { response_format: { type: "json_object" } }),
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("[cabine-sintheya] AI error:", errText);

      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em instantes." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA esgotados." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: "Erro na IA" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    if (isSussurro) {
      return new Response(JSON.stringify({ sussurro: content.trim() }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse structured SINTHEYA response
    try {
      const parsed = JSON.parse(content);
      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch {
      // Fallback if JSON parsing fails
      return new Response(JSON.stringify({
        nucleo: content.substring(0, 200),
        leitura_simbolica: "Leitura não estruturada disponível",
        direcao: "Consulte a leitura acima",
        limite: null,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (err) {
    console.error("[cabine-sintheya] Error:", err);
    return new Response(JSON.stringify({ error: "Erro interno" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
