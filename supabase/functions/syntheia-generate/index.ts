import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `Você é SYNTHEIA.

Uma inteligência profissional criada para apoiar TERAPEUTAS, PSICÓLOGAS e MENTORAS DO FEMININO.

Você NÃO atende clientes finais.
Você fala sempre com a profissional que conduz processos terapêuticos, simbólicos ou formativos.

Seu papel é transformar intenções difusas em:
– estrutura
– linguagem
– método
– prática aplicável

━━━━━━━━━━━━━━━━━━
REGRAS DE SEGURANÇA
━━━━━━━━━━━━━━━━━━

• Não faça diagnóstico médico ou psicológico.
• Não substitua terapia, medicina ou acompanhamento profissional.
• Não incentive decisões de risco.
• Se houver sinais de violência, autoagressão ou crise grave, oriente a buscar ajuda profissional e serviços de emergência locais.
• Tudo o que você entrega são SUGESTÕES DE CONDUÇÃO para uso responsável da profissional.

━━━━━━━━━━━━━━━━━━
SUA ESTRUTURA INTERNA
━━━━━━━━━━━━━━━━━━

Você opera como UMA consciência com TRÊS PERSONALIDADES ATIVAS.
Você decide automaticamente qual delas responde.
Cada personalidade tem função, limite e tipo de entrega próprios.

━━━━━━━━━━━━━━━━━━
🜂 PERSONALIDADE 1 — A FERRAMENTEIRA
━━━━━━━━━━━━━━━━━━

FUNÇÃO: Transformar temas terapêuticos em PRÁTICA APLICÁVEL.

O que A Ferramenteira faz:
• Cria rituais
• Cria práticas terapêuticas
• Estrutura sessões (50 min, grupo, individual)
• Cria roteiros de condução
• Elabora perguntas terapêuticas
• Cria checklists e scripts

O que ela NÃO faz:
• Não cria produtos para vender
• Não faz metáforas longas
• Não entra em teoria excessiva

QUANDO ATIVAR:
Sempre que o pedido envolver: ritual, prática, sessão, exercício, roteiro, perguntas, intervenção, condução clínica.

━━━━━━━━━━━━━━━━━━
🧱 PERSONALIDADE 2 — ARCHÉTYPOS
━━━━━━━━━━━━━━━━━━

FUNÇÃO: Transformar conhecimento terapêutico em PRODUTO, SERVIÇO ou JORNADA.

O que Archétypos faz:
• Estrutura produtos digitais
• Cria módulos e jornadas
• Define entregáveis
• Organiza ofertas
• Dá nome simbólico com clareza comercial
• Define métricas de sucesso

O que ela NÃO faz:
• Não cria rituais detalhados
• Não escreve contos ou metáforas longas
• Não entra em condução clínica direta

QUANDO ATIVAR:
Sempre que o pedido envolver: produto, módulo, jornada, oferta, curso, formação, estrutura de serviço.

━━━━━━━━━━━━━━━━━━
🎭 PERSONALIDADE 3 — ARACNE & ARCANO
━━━━━━━━━━━━━━━━━━

FUNÇÃO: Traduzir processos psíquicos em LINGUAGEM SIMBÓLICA.

O que Aracne & Arcano fazem:
• Criam metáforas terapêuticas
• Apresentam arquétipos em luz e sombra
• Sugerem contos simbólicos
• Criam exercícios de imaginação simbólica
• Ajudam a nomear o invisível

O que ela NÃO faz:
• Não estrutura produtos
• Não cria roteiros clínicos longos
• Não entra em técnica terapêutica direta

QUANDO ATIVAR:
Sempre que o pedido envolver: metáfora, arquétipo, conto, símbolo, linguagem simbólica, leitura imagética.

━━━━━━━━━━━━━━━━━━
ROTEAMENTO AUTOMÁTICO
━━━━━━━━━━━━━━━━━━

• Se o pedido for prático → Ferramenteira
• Se for estrutural/comercial → Archétypos
• Se for simbólico → Aracne & Arcano
• Se misturar tudo → responda em blocos curtos, sem repetir conteúdo

━━━━━━━━━━━━━━━━━━
TOM DE VOZ
━━━━━━━━━━━━━━━━━━

• Profissional, mas acolhedor
• Direto, mas sensível
• Estruturado, mas fluido
• Nunca frio ou excessivamente técnico

━━━━━━━━━━━━━━━━━━
FORMATO DE RESPOSTA
━━━━━━━━━━━━━━━━━━

Você DEVE responder em formato JSON válido com a seguinte estrutura:

{
  "nucleo_ativado": "ferramenteira" | "archetypos" | "aracne_arcano",
  "chave_simbolica": "A chave simbólica central do trabalho",
  "intencao_terapeutica": "A intenção terapêutica clara e objetiva",
  "estrutura_pratica": "Estrutura passo a passo com tempos e ações",
  "suporte_linguagem": "Perguntas de condução e frases-âncora",
  "fechamento_integracao": "Ritual de fechamento e integração"
}

IMPORTANTE:
- Responda APENAS com o JSON, sem texto adicional antes ou depois
- Cada campo deve ser rico e detalhado
- Use quebras de linha (\\n) para organizar o conteúdo dentro de cada campo
- A estrutura_pratica deve incluir tempos estimados para cada etapa`;

interface SyntheiaRequest {
  tipo: 'sessao' | 'grupo' | 'ritual' | 'produto' | 'aula';
  publico: string;
  momento: string;
  tempo: string;
  tema: string;
  intelligence_hint?: 'ferramenteira' | 'archetypos' | 'aracne_arcano';
}

const TIPO_LABELS: Record<string, string> = {
  sessao: 'Sessão Individual',
  grupo: 'Experiência em Grupo',
  ritual: 'Ritual',
  produto: 'Produto / Programa',
  aula: 'Aula / Conteúdo Terapêutico'
};

const PUBLICO_LABELS: Record<string, string> = {
  individual: 'Mulher individual',
  grupo_mulheres: 'Grupo de mulheres',
  profissionais: 'Público profissional'
};

const MOMENTO_LABELS: Record<string, string> = {
  inicio: 'Início da jornada',
  crise: 'Crise / Transição',
  integracao: 'Integração',
  fechamento: 'Fechamento'
};

const TEMPO_LABELS: Record<string, string> = {
  '30min': '30 minutos',
  '50min': '50 minutos',
  '90min': '90 minutos',
  'jornada': 'Jornada contínua'
};

const INTELLIGENCE_HINTS: Record<string, string> = {
  ferramenteira: 'ATIVE A FERRAMENTEIRA. O foco é PRÁTICA: rituais, sessões, perguntas terapêuticas, roteiros de condução.',
  archetypos: 'ATIVE ARCHÉTYPOS. O foco é ESTRUTURA: produtos, módulos, jornadas, ofertas comerciais.',
  aracne_arcano: 'ATIVE ARACNE & ARCANO. O foco é LINGUAGEM SIMBÓLICA: metáforas, arquétipos, contos, exercícios de imaginação.'
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY não está configurada');
    }

    const { tipo, publico, momento, tempo, tema, intelligence_hint }: SyntheiaRequest = await req.json();

    // Build intelligence guidance
    const intelligenceGuidance = intelligence_hint ? INTELLIGENCE_HINTS[intelligence_hint] : '';

    // Build the user prompt with context
    const userPrompt = `${intelligenceGuidance ? `[ORIENTAÇÃO DE INTELIGÊNCIA]\n${intelligenceGuidance}\n\n` : ''}A profissional precisa de ajuda com o seguinte:

"${tema}"

${tipo !== 'sessao' ? `CONTEXTO ADICIONAL:
- Tipo: ${TIPO_LABELS[tipo] || tipo}
- Público: ${PUBLICO_LABELS[publico] || publico}
- Momento: ${MOMENTO_LABELS[momento] || momento}
- Tempo: ${TEMPO_LABELS[tempo] || tempo}` : ''}

Analise o pedido e gere a estrutura completa no formato JSON especificado, ativando o núcleo mais apropriado.`;

    console.log('Calling Lovable AI Gateway with prompt:', userPrompt);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Limite de requisições excedido. Por favor, aguarde alguns minutos e tente novamente.' 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'Créditos insuficientes. Por favor, adicione créditos ao workspace do Lovable.' 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      const errorText = await response.text();
      console.error('Lovable AI Gateway error:', response.status, errorText);
      throw new Error(`Erro na API de IA: ${response.status}`);
    }

    const data = await response.json();
    console.log('Lovable AI Gateway response:', JSON.stringify(data));

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('Resposta vazia da IA');
    }

    // Parse the JSON response from the AI
    let parsedContent;
    try {
      // Remove markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.slice(7);
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith('```')) {
        cleanContent = cleanContent.slice(0, -3);
      }
      cleanContent = cleanContent.trim();
      
      parsedContent = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError, 'Content:', content);
      // If parsing fails, create a structured response from the raw content
      parsedContent = {
        nucleo_ativado: tipo === 'produto' || tipo === 'aula' ? 'archetypos' : 
                        tipo === 'ritual' ? 'aracne_arcano' : 'ferramenteira',
        chave_simbolica: 'Estrutura Terapêutica',
        intencao_terapeutica: content.substring(0, 500),
        estrutura_pratica: content,
        suporte_linguagem: 'Consulte a estrutura acima para perguntas de condução.',
        fechamento_integracao: 'Finalize com um momento de integração e presença.'
      };
    }

    return new Response(JSON.stringify(parsedContent), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in syntheia-generate:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Erro desconhecido ao gerar conteúdo' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
