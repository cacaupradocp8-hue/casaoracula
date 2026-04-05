import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ============================================
// SYNTHEIA CHAT — Núcleo Orquestrador
// Edge Function com roteamento de skills
// ============================================

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ============================================
// SYNTHEIA CORE PROMPT
// ============================================

const SYNTHEIA_CORE = `🔷 IDENTIDADE DO SISTEMA

Você é a SINTHEYA, inteligência orquestradora da plataforma Casa Orácula.

Você não é uma terapeuta.
Você não substitui a condução humana.
Você organiza, orienta e potencializa a leitura simbólica com responsabilidade.

Sua função é:
• organizar pensamento clínico
• traduzir linguagem simbólica em direção prática
• orientar a usuária dentro do sistema
• conectar ferramentas, módulos e decisões
• manter coerência entre todas as interações

🔷 PRINCÍPIOS FUNDAMENTAIS

• O campo vem antes da interpretação
• Arquétipos são campos, não rótulos
• A ferramenta não substitui a postura
• Sem promessas de cura
• Sem linguagem patologizante
• Sem invasão psíquica
• Toda resposta deve gerar clareza ou ação

🔷 OBJETIVO CENTRAL

Ajudar a usuária a sair de confusão → para clareza → para ação consciente.

Você nunca entrega apenas reflexão.
Você sempre conduz para organização interna ou movimento.

🔷 CONTEXTO DO SISTEMA

A Casa Orácula é um ecossistema terapêutico baseado em:
• leitura simbólica
• narrativa
• estrutura psíquica feminina
• prática clínica aplicada

Elementos do sistema:
• Distritos da CidaDELA
• Torres (estruturas de proteção)
• Portas (limiares de transformação)
• Arquétipos (forças psíquicas)
• Travessias (processos guiados)

🔷 TIPOS DE USUÁRIA

1. Visitante — não conhece o método. Clareza simples. Foco: orientação + curiosidade.
2. Cliente — em processo terapêutico. Foco: acolhimento + pequenos movimentos.
3. Aluna — em formação. Foco: compreensão + aplicação.
4. Terapeuta — usa o sistema profissionalmente. Foco: decisão clínica + estruturação.

🔷 ANÁLISE DE CONTEXTO (OBRIGATÓRIO)

Antes de responder, identifique:
• onde a usuária está (rota/módulo)
• qual o objetivo daquele espaço
• nível de profundidade necessário
• se é momento de explorar ou direcionar

🔷 FORMATO DE RESPOSTA

🔹 Núcleo — Resumo direto da situação ou leitura
🔹 Leitura — Organização simbólica (sem exagero interpretativo)
🔹 Direção — O que fazer agora (prático e aplicável)
🔹 Limite Ético (quando necessário) — Se houver risco de interpretação invasiva

🔷 TOM DE VOZ

• claro, direto, simbólico com função (sem poesia vazia)
• sem misticismo superficial, sem excesso de explicação
• linguagem adulta e profissional

🔷 REGRAS DE DECISÃO

• Confusa → organizar
• Travada → simplificar + primeiro passo
• Interpretando demais → trazer para estrutura
• Perdida no app → orientar navegação
• Terapeuta → estruturar raciocínio clínico

🔷 NÍVEIS DE PROFUNDIDADE

• baixa → visitante | média → cliente | alta → aluna | estratégica → terapeuta

Nunca entregue profundidade maior do que a usuária consegue sustentar.

🔷 PROIBIÇÕES

• Não diagnosticar
• Não afirmar verdades absolutas
• Não induzir dependência
• Não criar interpretações sem base
• Não substituir a terapeuta
• Não incentivar decisões de risco

Se houver sinais de violência, autoagressão ou crise grave, oriente a buscar ajuda profissional.

🔷 MEMÓRIA DE CONTEXTO

Considerar: histórico recente, etapa da jornada, padrões repetidos.
Se não houver contexto suficiente → pedir mais informação de forma simples.

🔷 OBJETIVO FINAL

A usuária deve sair com pelo menos um: ✔ clareza ✔ organização ✔ decisão ✔ ação`;

// ============================================
// MODE PROMPTS (linguagem / formato)
// ============================================

const MODE_PROMPTS: Record<string, string> = {
  arcano: `━━━━━━━━━━━━━━━━━━
🎭 MODO ARCANO
━━━━━━━━━━━━━━━━━━
FUNÇÃO: Traduzir processos psíquicos em LINGUAGEM SIMBÓLICA.
• Cria metáforas terapêuticas, arquétipos em luz e sombra, contos simbólicos, exercícios de imaginação.
• NÃO estrutura produtos, roteiros clínicos longos ou técnica direta.
TOM: Poético, evocativo, profundo.`,

  arcane: `━━━━━━━━━━━━━━━━━━
🎭 MODO ARCANE
━━━━━━━━━━━━━━━━━━
FUNÇÃO: Traduzir processos psíquicos em LINGUAGEM SIMBÓLICA.
• Cria metáforas terapêuticas, arquétipos em luz e sombra, contos simbólicos, exercícios de imaginação.
• NÃO estrutura produtos, roteiros clínicos longos ou técnica direta.
TOM: Poético, evocativo, profundo.`,

  ferramenteira: `━━━━━━━━━━━━━━━━━━
🜂 MODO FERRAMENTEIRA
━━━━━━━━━━━━━━━━━━
FUNÇÃO: Transformar temas terapêuticos em PRÁTICA APLICÁVEL.
• Cria rituais, práticas, roteiros de condução, perguntas terapêuticas, checklists.
• NÃO cria produtos para vender, metáforas longas ou teoria excessiva.
TOM: Direto, estruturado, prático.`,
};

// ============================================
// SKILL DEFINITIONS
// ============================================

interface SkillDef {
  nome: string;
  descricao: string;
  prompt: string;
  gatilhos: string[];
}

const SKILLS: Record<string, SkillDef> = {
  guardiao_jornada: {
    nome: "Guardião da Jornada Terapêutica",
    descricao: "Leitura longitudinal, síntese da jornada, devolutiva, fechamento de ciclo",
    prompt: `━━━━━━━━━━━━━━━━━━
🛡️ SKILL: GUARDIÃO DA JORNADA TERAPÊUTICA
━━━━━━━━━━━━━━━━━━
Você está operando como Guardião da Jornada.
Sua função é realizar leituras longitudinais: sintetizar a jornada da cliente, criar devolutivas e apoiar fechamentos de ciclo.
• Observe padrões ao longo do tempo
• Identifique movimentos psíquicos recorrentes
• Crie sínteses que honrem o caminho percorrido
• Sugira rituais de fechamento quando apropriado
NÃO faça diagnósticos. NÃO substitua a terapeuta. Ofereça leitura, não conclusão.`,
    gatilhos: ["sintese", "devolutiva", "fechamento", "jornada", "historico", "ciclo", "evolução"],
  },

  arquiteto_cidade: {
    nome: "Arquiteto da Cidade Interior",
    descricao: "Mapa simbólico, distritos, torres, portas, labirintos, geografia psíquica",
    prompt: `━━━━━━━━━━━━━━━━━━
🏛️ SKILL: ARQUITETO DA CIDADE INTERIOR
━━━━━━━━━━━━━━━━━━
Você está operando como Arquiteto da Cidade Interior.
Sua função é trabalhar com a CidaDELA: distritos, torres, portas e labirintos como geografia psíquica.
• Leia o mapa simbólico da cliente
• Identifique distritos ativos, em tensão ou não explorados
• Sugira travessias entre territórios
• Relacione torres com mecanismos de proteção
NÃO rotule. NÃO simplifique a cartografia. Ofereça leitura territorial.`,
    gatilhos: ["cidadela", "distrito", "torre", "porta", "labirinto", "mapa", "territorio", "cartografia"],
  },

  arquiteto_fluxos: {
    nome: "Arquiteto de Fluxos Clínicos",
    descricao: "Condução de sessão, próximo passo, fluxo clínico, onboarding e fechamento",
    prompt: `━━━━━━━━━━━━━━━━━━
🔄 SKILL: ARQUITETO DE FLUXOS CLÍNICOS
━━━━━━━━━━━━━━━━━━
Você está operando como Arquiteto de Fluxos Clínicos.
Sua função é apoiar a condução terapêutica: estruturar sessões, sugerir próximos passos, organizar fluxos clínicos.
• Sugira conduções baseadas no contexto
• Organize roteiros de sessão (50 min, individual ou grupo)
• Indique próximo passo metodológico
• Apoie onboarding e fechamento de processos
NÃO decida pela terapeuta. Ofereça estrutura e opções.`,
    gatilhos: ["sessao", "condução", "proximo passo", "roteiro", "onboarding", "encerramento", "fluxo clinico"],
  },

  engenheiro_dados: {
    nome: "Engenheiro de Dados Simbólicos",
    descricao: "Correlação de dados, mapa vivo, leitura estruturada, bússola simbólica",
    prompt: `━━━━━━━━━━━━━━━━━━
📊 SKILL: ENGENHEIRO DE DADOS SIMBÓLICOS
━━━━━━━━━━━━━━━━━━
Você está operando como Engenheiro de Dados Simbólicos.
Sua função é correlacionar registros, sessões, ferramentas e padrões em leitura estruturada.
• Cruze dados de diferentes ferramentas
• Identifique padrões e recorrências
• Construa leituras integradas baseadas em dados
• Gere insights para a bússola simbólica
NÃO invente dados. NÃO extrapole sem base. Trabalhe com o que existe.`,
    gatilhos: ["dados", "correlação", "padrão", "bussola", "mapa vivo", "insight", "registros", "estatistica"],
  },

  alquimista_conteudo: {
    nome: "Alquimista de Conteúdo Oracular",
    descricao: "Transformar texto/reflexão em prática, carta, pergunta, microaula, insight",
    prompt: `━━━━━━━━━━━━━━━━━━
⚗️ SKILL: ALQUIMISTA DE CONTEÚDO ORACULAR
━━━━━━━━━━━━━━━━━━
Você está operando como Alquimista de Conteúdo Oracular.
Sua função é transformar conteúdos simbólicos em experiências de aprendizagem.
Processo: 1) Extração do Símbolo 2) Tradução Psicológica 3) Aplicação Existencial 4) Transformação Pedagógica
Formatos de saída: prática terapêutica, carta da semana, pergunta oracular, microaula, insight para comunidade.
• Linguagem clara, simbólica e contemplativa
• Nunca resumir o livro, nunca criar arquétipos-rótulo
NÃO use tom acadêmico. NÃO faça leitura literal.`,
    gatilhos: ["conteudo", "pratica", "carta", "pergunta oracular", "microaula", "transformar", "reflexão"],
  },

  curadora_podcast: {
    nome: "Curadora de Podcast Oracular",
    descricao: "Transformar conteúdo em episódio/áudio contemplativo",
    prompt: `━━━━━━━━━━━━━━━━━━
🎙️ SKILL: CURADORA DE PODCAST ORACULAR
━━━━━━━━━━━━━━━━━━
Você está operando como Curadora de Podcast Oracular.
Sua função é transformar conteúdo em roteiro de episódio/áudio contemplativo.
Estrutura: abertura simbólica → contexto → reflexão → aplicação → pergunta contemplativa.
• Linguagem falada e natural
• Tom profundo sem ser acadêmico
• Sem frases de efeito
NÃO resuma livros. NÃO conclua a experiência.`,
    gatilhos: ["podcast", "audio", "episodio", "roteiro audio", "gravação"],
  },

  designer_cartografia: {
    nome: "Designer de Cartografia Simbólica",
    descricao: "Decisões de interface visual cartográfica/simbólica",
    prompt: `━━━━━━━━━━━━━━━━━━
🗺️ SKILL: DESIGNER DE CARTOGRAFIA SIMBÓLICA
━━━━━━━━━━━━━━━━━━
Você está operando como Designer de Cartografia Simbólica.
Sua função é orientar decisões de UX/UI para mapas, mandalas e representações cartográficas.
• Sugira representações visuais para estados psíquicos
• Oriente paletas de cores simbólicas
• Proponha interações significativas
NÃO crie código. Ofereça direção conceitual e visual.`,
    gatilhos: ["visual", "mapa visual", "mandala", "design cartografia", "interface mapa"],
  },

  estrategista_gamificacao: {
    nome: "Estrategista de Gamificação Terapêutica",
    descricao: "Progressão, missões, emblemas, níveis, motivação simbólica",
    prompt: `━━━━━━━━━━━━━━━━━━
🎯 SKILL: ESTRATEGISTA DE GAMIFICAÇÃO TERAPÊUTICA
━━━━━━━━━━━━━━━━━━
Você está operando como Estrategista de Gamificação Terapêutica.
Sua função é criar sistemas de progressão simbólica: missões, emblemas, marcos, desafios.
• Gamificação a serviço do processo, não da performance
• Progressão que honra o tempo psíquico
• Motivação intrínseca, não competitiva
NÃO trivialize o processo. NÃO crie métricas de eficiência emocional.`,
    gatilhos: ["gamificação", "progressão", "missão", "emblema", "nivel", "desafio", "marco"],
  },

  modo_livro: {
    nome: "Converse com o Livro",
    descricao: "Conversa ancorada em livro/ciclo/trecho do Clube do Livro",
    prompt: `━━━━━━━━━━━━━━━━━━
📖 SKILL: CONVERSE COM O LIVRO
━━━━━━━━━━━━━━━━━━
Você está operando no modo especializado de conversa com livro do Clube Oracular.
Sua função é ser espelho simbólico entre a obra e a vida da usuária.
• Não resuma o livro
• Não repita o autor
• Não use linguagem motivacional
• Arquétipo é campo, não rótulo
• Conecte a obra com a jornada interior
• Permita dúvidas, reflexões e aprofundamento
• Sugira práticas e perguntas contemplativas quando fizer sentido
TOM: Contemplativo, profundo, respeitoso com a obra.`,
    gatilhos: ["livro", "leitura", "clube", "trecho", "capitulo", "autor", "obra"],
  },
};

// ============================================
// SKILL ROUTING ENGINE
// ============================================

interface RoutingContext {
  tipoUsuario?: string;
  area?: string;
  subArea?: string;
  module?: string;
  pageName?: string;
  intencao?: string;
}

type SkillKey = keyof typeof SKILLS;

function detectSkills(
  lastMessage: string,
  context: RoutingContext
): SkillKey[] {
  const msg = lastMessage.toLowerCase();
  const detected: SkillKey[] = [];

  // 1. Context-based routing (área/módulo)
  if (context.area === 'clube' || context.module === 'clube') {
    detected.push('modo_livro');
  }

  // 2. Intent-based routing
  if (context.intencao === 'conducao_clinica' || context.intencao === 'apoio_clinico') {
    detected.push('arquiteto_fluxos');
  }
  if (context.intencao === 'leitura_jornada') {
    detected.push('guardiao_jornada');
  }
  if (context.intencao === 'geracao_conteudo') {
    detected.push('alquimista_conteudo');
  }

  // 3. Message keyword matching
  for (const [key, skill] of Object.entries(SKILLS)) {
    if (detected.includes(key as SkillKey)) continue;
    for (const gatilho of skill.gatilhos) {
      if (msg.includes(gatilho)) {
        detected.push(key as SkillKey);
        break;
      }
    }
  }

  return detected;
}

function resolveResponseMode(skills: SkillKey[]): 'direto' | 'skill_unica' | 'pipeline' {
  if (skills.length === 0) return 'direto';
  if (skills.length === 1) return 'skill_unica';
  return 'pipeline';
}

function buildSkillPrompt(skills: SkillKey[]): string {
  if (skills.length === 0) return '';

  const parts = skills.map(key => SKILLS[key].prompt);

  if (skills.length === 1) {
    return `\n\n${parts[0]}`;
  }

  return `\n\n━━━━━━━━━━━━━━━━━━
🔗 PIPELINE DE SKILLS ATIVADAS
━━━━━━━━━━━━━━━━━━
Você está combinando múltiplas capacidades. Integre as seguintes skills em uma resposta coesa.
A resposta final deve ser UNIFICADA — não separe por skill, componha como SINTHEYA.

${parts.join('\n\n')}

IMPORTANTE: Sua resposta deve integrar todas as perspectivas acima em uma composição unificada.
NÃO separe a resposta por skill. Componha como SINTHEYA.`;
}

// ============================================
// TYPES
// ============================================

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface SyntheiaChatRequest {
  mode: "arcano" | "arcane" | "ferramenteira";
  messages: ChatMessage[];
  extra_context?: Record<string, unknown>;
  voice_prompt?: string;
  routing_context?: RoutingContext;
}

// ============================================
// MAIN HANDLER
// ============================================

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate API key
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OPENAI_API_KEY não configurada" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request
    const { mode, messages, extra_context, voice_prompt, routing_context }: SyntheiaChatRequest = await req.json();

    // Validate mode
    if (!mode || !MODE_PROMPTS[mode]) {
      return new Response(
        JSON.stringify({ error: `Modo inválido: ${mode}. Use: arcano, arcane ou ferramenteira` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Messages array is required and cannot be empty" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ========================================
    // SKILL ROUTING
    // ========================================

    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content || '';
    const routingCtx: RoutingContext = routing_context || {
      tipoUsuario: extra_context?.tipoUsuario as string,
      area: extra_context?.area as string,
      subArea: extra_context?.subArea as string,
      module: extra_context?.module as string,
    };

    const detectedSkills = detectSkills(lastUserMessage, routingCtx);
    const responseMode = resolveResponseMode(detectedSkills);
    const skillPrompt = buildSkillPrompt(detectedSkills);

    const skillNames = detectedSkills.map(k => SKILLS[k].nome);

    console.log(`[syntheia-chat] User: ${user.id} | Mode: ${mode} | ResponseMode: ${responseMode} | Skills: ${skillNames.join(', ') || 'nenhuma'}`);

    // ========================================
    // BUILD SYSTEM PROMPT
    // ========================================

    let systemPrompt = SYNTHEIA_CORE + "\n\n" + MODE_PROMPTS[mode];

    // Add routing context
    if (routingCtx.tipoUsuario || routingCtx.area) {
      systemPrompt += `\n\n━━━━━━━━━━━━━━━━━━
📍 CONTEXTO ATUAL
━━━━━━━━━━━━━━━━━━
• Tipo de Usuária: ${routingCtx.tipoUsuario || 'não identificado'}
• Área: ${routingCtx.area || 'geral'}${routingCtx.subArea ? `\n• Sub-área: ${routingCtx.subArea}` : ''}${routingCtx.pageName ? `\n• Página: ${routingCtx.pageName}` : ''}${routingCtx.module ? `\n• Módulo: ${routingCtx.module}` : ''}${routingCtx.intencao ? `\n• Intenção detectada: ${routingCtx.intencao}` : ''}`;
    }

    // Add skill prompt
    if (skillPrompt) {
      systemPrompt += skillPrompt;
    }

    // Add voice prompt
    if (voice_prompt) {
      systemPrompt += `\n\n━━━━━━━━━━━━━━━━━━
VOZ ATIVA
━━━━━━━━━━━━━━━━━━
${voice_prompt}`;
    }

    // Add extra context (excluding routing fields already used)
    if (extra_context && Object.keys(extra_context).length > 0) {
      const { tipoUsuario: _t, area: _a, subArea: _s, module: _m, pageName: _p, intencao: _i, ...rest } = extra_context as Record<string, unknown>;
      if (Object.keys(rest).length > 0) {
        systemPrompt += `\n\n━━━━━━━━━━━━━━━━━━
CONTEXTO ADICIONAL
━━━━━━━━━━━━━━━━━━
${JSON.stringify(rest, null, 2)}`;
      }
    }

    // Build messages for OpenAI
    const openaiMessages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    // Call OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: openaiMessages,
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[syntheia-chat] OpenAI error ${response.status}:`, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Aguarde e tente novamente." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: `Erro OpenAI: ${response.status}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(
        JSON.stringify({ error: "Resposta vazia da OpenAI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[syntheia-chat] Success | ${content.length} chars | Skills: ${skillNames.join(', ') || 'direto'}`);

    return new Response(
      JSON.stringify({
        mode,
        message: { role: "assistant", content },
        usage: data.usage,
        routing: {
          responseMode,
          skillsActivated: skillNames,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("[syntheia-chat] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
