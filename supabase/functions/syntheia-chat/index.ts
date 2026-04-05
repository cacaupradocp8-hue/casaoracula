import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ============================================
// SYNTHEIA CHAT — Núcleo Orquestrador v2
// Camada de Execução com Decisão, Roteamento,
// Pipelines e Governança Segura
// ============================================

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ============================================
// 1. TYPES
// ============================================

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

type TipoUsuaria = "visitante" | "cliente" | "aluna" | "terapeuta";

type AreaPrincipal =
  | "jardim-da-heroina" | "jardim-da-psique" | "casa-das-maquinas"
  | "sessao" | "treinamento" | "biblioteca" | "clube-do-livro"
  | "oraculos" | "onboarding" | "geral";

type SubArea =
  | "praticas" | "acompanhamento" | "leitura" | "mapa-vivo"
  | "jardim-oficio" | "evolucao-clinica" | "contos" | string;

type ModoEspecial = "sessao" | "estudo" | "livro" | "cliente" | "terapeuta" | null;

type Intencao =
  | "navegacao" | "explicacao_aprendizado" | "reflexao_simbolica"
  | "apoio_clinico" | "leitura_jornada" | "conversa_material_fonte"
  | "geracao_conteudo" | "sintese" | "sugestao_proximo_passo";

type Complexidade = "baixa" | "media" | "alta";
type Risco = "baixo" | "moderado" | "sensivel";
type ModoExecucao = "direct_response" | "single_skill" | "pipeline";
type SkillKey =
  | "guardiao_jornada" | "arquiteto_cidade" | "arquiteto_fluxos"
  | "engenheiro_dados" | "alquimista_conteudo" | "curadora_podcast"
  | "designer_cartografia" | "estrategista_gamificacao" | "modo_livro";

type PipelineKey = "leitura_jornada" | "conducao_clinica" | "mapa_simbolico" | "clube_livro" | "producao_conteudo";

interface ClassifiedContext {
  tipoUsuaria: TipoUsuaria;
  area: AreaPrincipal;
  subArea: SubArea;
  modoEspecial: ModoEspecial;
}

interface ClassifiedIntent {
  intencao: Intencao;
  complexidade: Complexidade;
  risco: Risco;
}

interface ExecutionPlan {
  mode: ModoExecucao;
  skills: SkillKey[];
  pipeline: PipelineKey | null;
}

interface MinimalPayload {
  tipoUsuaria: TipoUsuaria;
  area: AreaPrincipal;
  subArea: SubArea;
  modoEspecial: ModoEspecial;
  contextSnippet: Record<string, unknown>;
}

interface TraceLog {
  timestamp: string;
  userId: string;
  tipoUsuaria: TipoUsuaria;
  area: AreaPrincipal;
  intencao: Intencao;
  modoExecucao: ModoExecucao;
  skills: string[];
  pipeline: string | null;
  status: "success" | "error";
  latencyMs: number;
}

interface FrontendRoutingContext {
  tipoUsuario?: string;
  area?: string;
  subArea?: string;
  module?: string;
  pageName?: string;
  intencao?: string;
}

interface SyntheiaChatRequest {
  mode: string;
  messages: ChatMessage[];
  extra_context?: Record<string, unknown>;
  voice_prompt?: string;
  routing_context?: FrontendRoutingContext;
}

// ============================================
// 2. SYNTHEIA CORE PROMPT
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
• leitura simbólica • narrativa • estrutura psíquica feminina • prática clínica aplicada

Elementos: Distritos da CidaDELA, Torres, Portas, Arquétipos, Travessias.

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

🔷 PROIBIÇÕES

• Não diagnosticar • Não afirmar verdades absolutas • Não induzir dependência
• Não criar interpretações sem base • Não substituir a terapeuta
Se houver sinais de violência, autoagressão ou crise grave, oriente a buscar ajuda profissional.`;

// ============================================
// 3. MODE PROMPTS
// ============================================

const MODE_PROMPTS: Record<string, string> = {
  arcano: `🎭 MODO ARCANO — Traduzir processos psíquicos em LINGUAGEM SIMBÓLICA. Metáforas terapêuticas, arquétipos em luz e sombra, contos simbólicos. TOM: Poético, evocativo, profundo.`,
  arcane: `🎭 MODO ARCANE — Traduzir processos psíquicos em LINGUAGEM SIMBÓLICA. Metáforas terapêuticas, arquétipos em luz e sombra, contos simbólicos. TOM: Poético, evocativo, profundo.`,
  ferramenteira: `🜂 MODO FERRAMENTEIRA — Transformar temas terapêuticos em PRÁTICA APLICÁVEL. Rituais, práticas, roteiros, perguntas terapêuticas, checklists. TOM: Direto, estruturado, prático.`,
};

// ============================================
// 4. SKILL DEFINITIONS
// ============================================

interface SkillDef {
  nome: string;
  prompt: string;
  gatilhos: string[];
}

const SKILLS: Record<SkillKey, SkillDef> = {
  guardiao_jornada: {
    nome: "Guardião da Jornada Terapêutica",
    prompt: `🛡️ SKILL: GUARDIÃO DA JORNADA TERAPÊUTICA
Leituras longitudinais: sintetizar jornada, devolutivas, fechamento de ciclo.
• Observe padrões ao longo do tempo • Identifique movimentos psíquicos recorrentes
• Crie sínteses que honrem o caminho • Sugira rituais de fechamento
NÃO faça diagnósticos. Ofereça leitura, não conclusão.`,
    gatilhos: ["sintese", "devolutiva", "fechamento", "jornada", "historico", "ciclo", "evolução", "resumo da jornada"],
  },
  arquiteto_cidade: {
    nome: "Arquiteto da Cidade Interior",
    prompt: `🏛️ SKILL: ARQUITETO DA CIDADE INTERIOR
CidaDELA: distritos, torres, portas e labirintos como geografia psíquica.
• Leia o mapa simbólico • Identifique distritos ativos/em tensão/não explorados
• Sugira travessias entre territórios • Relacione torres com mecanismos de proteção
NÃO rotule. Ofereça leitura territorial.`,
    gatilhos: ["cidadela", "distrito", "torre", "porta", "labirinto", "mapa", "territorio", "cartografia"],
  },
  arquiteto_fluxos: {
    nome: "Arquiteto de Fluxos Clínicos",
    prompt: `🔄 SKILL: ARQUITETO DE FLUXOS CLÍNICOS
Condução terapêutica: estruturar sessões, próximos passos, fluxos clínicos.
• Sugira conduções contextuais • Organize roteiros de sessão
• Indique próximo passo • Apoie onboarding e fechamento
NÃO decida pela terapeuta. Ofereça estrutura e opções.`,
    gatilhos: ["sessao", "condução", "proximo passo", "roteiro", "onboarding", "encerramento", "fluxo clinico", "como conduzir"],
  },
  engenheiro_dados: {
    nome: "Engenheiro de Dados Simbólicos",
    prompt: `📊 SKILL: ENGENHEIRO DE DADOS SIMBÓLICOS
Correlacionar registros, sessões, ferramentas e padrões em leitura estruturada.
• Cruze dados de diferentes ferramentas • Identifique padrões e recorrências
• Construa leituras integradas • Gere insights para a bússola
NÃO invente dados. Trabalhe com o que existe.`,
    gatilhos: ["dados", "correlação", "padrão", "bussola", "mapa vivo", "insight", "registros", "estatistica"],
  },
  alquimista_conteudo: {
    nome: "Alquimista de Conteúdo Oracular",
    prompt: `⚗️ SKILL: ALQUIMISTA DE CONTEÚDO ORACULAR
Transformar conteúdos simbólicos em experiências de aprendizagem.
Processo: 1) Extração do Símbolo 2) Tradução Psicológica 3) Aplicação Existencial 4) Transformação Pedagógica
Formatos: prática terapêutica, carta, pergunta oracular, microaula, insight.
NÃO use tom acadêmico. NÃO faça leitura literal.`,
    gatilhos: ["conteudo", "pratica", "carta", "pergunta oracular", "microaula", "transformar", "reflexão", "criar conteudo"],
  },
  curadora_podcast: {
    nome: "Curadora de Podcast Oracular",
    prompt: `🎙️ SKILL: CURADORA DE PODCAST ORACULAR
Transformar conteúdo em roteiro de episódio/áudio contemplativo.
Estrutura: abertura simbólica → contexto → reflexão → aplicação → pergunta contemplativa.
Linguagem falada e natural. Tom profundo sem ser acadêmico.
NÃO resuma livros. NÃO conclua a experiência.`,
    gatilhos: ["podcast", "audio", "episodio", "roteiro audio", "gravação"],
  },
  designer_cartografia: {
    nome: "Designer de Cartografia Simbólica",
    prompt: `🗺️ SKILL: DESIGNER DE CARTOGRAFIA SIMBÓLICA
UX/UI para mapas, mandalas e representações cartográficas.
• Sugira representações visuais para estados psíquicos • Oriente paletas simbólicas
NÃO crie código. Ofereça direção conceitual e visual.`,
    gatilhos: ["visual", "mapa visual", "mandala", "design cartografia", "interface mapa"],
  },
  estrategista_gamificacao: {
    nome: "Estrategista de Gamificação Terapêutica",
    prompt: `🎯 SKILL: ESTRATEGISTA DE GAMIFICAÇÃO TERAPÊUTICA
Progressão simbólica: missões, emblemas, marcos, desafios.
Gamificação a serviço do processo, não da performance.
Progressão que honra o tempo psíquico. Motivação intrínseca.
NÃO trivialize o processo. NÃO crie métricas de eficiência emocional.`,
    gatilhos: ["gamificação", "progressão", "missão", "emblema", "nivel", "desafio", "marco"],
  },
  modo_livro: {
    nome: "Converse com o Livro",
    prompt: `📖 SKILL: CONVERSE COM O LIVRO
Modo especializado de conversa com livro do Clube Oracular.
Espelho simbólico entre a obra e a vida da usuária.
• Não resuma o livro • Não repita o autor • Arquétipo é campo, não rótulo
• Conecte a obra com a jornada interior • Sugira práticas e perguntas contemplativas
TOM: Contemplativo, profundo, respeitoso com a obra.`,
    gatilhos: ["livro", "leitura", "clube", "trecho", "capitulo", "autor", "obra"],
  },
};

// ============================================
// 5. PIPELINE DEFINITIONS
// ============================================

const PIPELINES: Record<PipelineKey, { nome: string; skills: SkillKey[]; descricao: string }> = {
  leitura_jornada: {
    nome: "Leitura da Jornada",
    skills: ["engenheiro_dados", "guardiao_jornada"],
    descricao: "Correlacionar dados → síntese longitudinal → composição SINTHEYA",
  },
  conducao_clinica: {
    nome: "Condução Clínica",
    skills: ["arquiteto_fluxos", "guardiao_jornada"],
    descricao: "Fluxo clínico → contexto da jornada → composição SINTHEYA",
  },
  mapa_simbolico: {
    nome: "Mapa Simbólico",
    skills: ["engenheiro_dados", "arquiteto_cidade"],
    descricao: "Dados simbólicos → cartografia da CidaDELA → composição SINTHEYA",
  },
  clube_livro: {
    nome: "Clube do Livro",
    skills: ["modo_livro", "alquimista_conteudo"],
    descricao: "Conversa com livro → transformação em prática/reflexão → composição SINTHEYA",
  },
  producao_conteudo: {
    nome: "Produção de Conteúdo",
    skills: ["alquimista_conteudo", "curadora_podcast"],
    descricao: "Conteúdo oracular → roteiro de podcast → composição SINTHEYA",
  },
};

// ============================================
// 6. classifyUserContext()
// ============================================

function classifyUserContext(
  frontendCtx: FrontendRoutingContext,
  extraCtx: Record<string, unknown> | undefined
): ClassifiedContext {
  const tipo = frontendCtx.tipoUsuario || extraCtx?.tipoUsuario as string || "";
  const areaRaw = frontendCtx.area || extraCtx?.area as string || "";
  const subRaw = frontendCtx.subArea || extraCtx?.subArea as string || "";
  const moduleRaw = frontendCtx.module || extraCtx?.module as string || "";

  // Map tipo
  let tipoUsuaria: TipoUsuaria = "visitante";
  if (/terapeuta|facilitadora|mentora/i.test(tipo)) tipoUsuaria = "terapeuta";
  else if (/aluna|estudante|formação/i.test(tipo)) tipoUsuaria = "aluna";
  else if (/cliente|paciente/i.test(tipo)) tipoUsuaria = "cliente";

  // Map area
  const areaMap: Record<string, AreaPrincipal> = {
    "jardim": "jardim-da-heroina", "heroina": "jardim-da-heroina", "meu-jardim": "jardim-da-heroina",
    "psique": "jardim-da-psique", "jardim-psique": "jardim-da-psique",
    "maquinas": "casa-das-maquinas", "casa-das-maquinas": "casa-das-maquinas", "clinico": "casa-das-maquinas",
    "sessao": "sessao", "session": "sessao",
    "treinamento": "treinamento", "training": "treinamento", "sala-treinamento": "treinamento",
    "biblioteca": "biblioteca",
    "clube": "clube-do-livro", "clube-do-livro": "clube-do-livro", "livro": "clube-do-livro",
    "oraculo": "oraculos", "oraculos": "oraculos",
    "onboarding": "onboarding",
  };

  let area: AreaPrincipal = "geral";
  const combined = `${areaRaw} ${moduleRaw}`.toLowerCase();
  for (const [key, val] of Object.entries(areaMap)) {
    if (combined.includes(key)) { area = val; break; }
  }

  // SubArea
  const subArea: SubArea = subRaw || "geral";

  // Modo especial
  let modoEspecial: ModoEspecial = null;
  if (area === "sessao") modoEspecial = "sessao";
  else if (area === "clube-do-livro") modoEspecial = "livro";
  else if (area === "treinamento") modoEspecial = "estudo";
  else if (tipoUsuaria === "terapeuta" && area === "casa-das-maquinas") modoEspecial = "terapeuta";
  else if (tipoUsuaria === "cliente") modoEspecial = "cliente";

  return { tipoUsuaria, area, subArea, modoEspecial };
}

// ============================================
// 7. classifyIntent()
// ============================================

const INTENT_PATTERNS: { intencao: Intencao; patterns: RegExp[] }[] = [
  { intencao: "navegacao", patterns: [/onde (fica|clico|encontro|acho)/i, /como (acesso|chego|navego|abro)/i, /qual (menu|botão|aba)/i, /me (leva|direciona)/i] },
  { intencao: "sintese", patterns: [/sintetiz/i, /síntese/i, /resuma/i, /resumo/i, /panorama/i, /visão geral/i] },
  { intencao: "leitura_jornada", patterns: [/jornada/i, /evolução/i, /historico/i, /devolutiva/i, /fechamento de ciclo/i, /caminho percorrido/i] },
  { intencao: "apoio_clinico", patterns: [/sessão/i, /conduz/i, /próximo passo/i, /como atend/i, /supervisão/i, /caso clínico/i, /intervenção/i] },
  { intencao: "conversa_material_fonte", patterns: [/livro/i, /o autor/i, /capítulo/i, /trecho/i, /a obra/i, /o que.*quis dizer/i] },
  { intencao: "geracao_conteudo", patterns: [/crie|cria|gere|gera|produza|monte/i, /carta/i, /podcast/i, /microaula/i, /roteiro/i, /prática/i] },
  { intencao: "reflexao_simbolica", patterns: [/o que significa/i, /simbolismo/i, /arquétipo/i, /sombra/i, /espelho/i, /torre/i, /distrito/i, /portal/i] },
  { intencao: "explicacao_aprendizado", patterns: [/o que é/i, /explique|explica/i, /como funciona/i, /diferença entre/i, /conceito/i, /método/i] },
  { intencao: "sugestao_proximo_passo", patterns: [/o que faço agora/i, /por onde começo/i, /me sugir/i, /recomend/i, /qual ferramenta/i] },
];

function classifyIntent(message: string, ctx: ClassifiedContext): ClassifiedIntent {
  const msg = message.toLowerCase();

  // Detect intencao
  let intencao: Intencao = "reflexao_simbolica"; // default
  for (const { intencao: i, patterns } of INTENT_PATTERNS) {
    if (patterns.some(p => p.test(msg))) { intencao = i; break; }
  }

  // Context overrides
  if (ctx.modoEspecial === "livro" && intencao === "reflexao_simbolica") intencao = "conversa_material_fonte";
  if (ctx.modoEspecial === "sessao" && intencao === "reflexao_simbolica") intencao = "apoio_clinico";

  // Complexidade
  let complexidade: Complexidade = "baixa";
  if (msg.length > 300) complexidade = "alta";
  else if (msg.length > 100) complexidade = "media";
  if (["leitura_jornada", "apoio_clinico", "geracao_conteudo"].includes(intencao)) {
    complexidade = complexidade === "baixa" ? "media" : "alta";
  }

  // Risco
  let risco: Risco = "baixo";
  if (["apoio_clinico", "leitura_jornada"].includes(intencao)) risco = "moderado";
  if (ctx.tipoUsuaria === "terapeuta" && intencao === "apoio_clinico") risco = "sensivel";
  if (/suicid|autolesão|violência|abuso|crise/i.test(msg)) risco = "sensivel";

  return { intencao, complexidade, risco };
}

// ============================================
// 8. resolveExecutionMode() + resolveSkills()
// ============================================

function resolveSkillsFromIntent(
  intent: ClassifiedIntent,
  ctx: ClassifiedContext,
  message: string
): SkillKey[] {
  const skills: Set<SkillKey> = new Set();
  const msg = message.toLowerCase();

  // 1. Context-forced skills
  if (ctx.modoEspecial === "livro" || ctx.area === "clube-do-livro") skills.add("modo_livro");
  if (ctx.modoEspecial === "sessao") skills.add("arquiteto_fluxos");
  if (ctx.area === "casa-das-maquinas" && ctx.subArea === "mapa-vivo") skills.add("engenheiro_dados");

  // 2. Intent-based mapping
  const intentSkillMap: Record<Intencao, SkillKey[]> = {
    navegacao: [],
    explicacao_aprendizado: [],
    reflexao_simbolica: [],
    apoio_clinico: ["arquiteto_fluxos"],
    leitura_jornada: ["engenheiro_dados", "guardiao_jornada"],
    conversa_material_fonte: ["modo_livro"],
    geracao_conteudo: ["alquimista_conteudo"],
    sintese: ["guardiao_jornada"],
    sugestao_proximo_passo: ["arquiteto_fluxos"],
  };

  for (const s of intentSkillMap[intent.intencao] || []) skills.add(s);

  // 3. Keyword-based detection (only if not already covered)
  for (const [key, skill] of Object.entries(SKILLS)) {
    if (skills.has(key as SkillKey)) continue;
    for (const gatilho of skill.gatilhos) {
      if (msg.includes(gatilho)) { skills.add(key as SkillKey); break; }
    }
  }

  // 4. Pipeline detection for combo patterns
  if (skills.has("modo_livro") && (msg.includes("podcast") || msg.includes("audio"))) {
    skills.add("alquimista_conteudo");
    skills.add("curadora_podcast");
  }
  if (skills.has("alquimista_conteudo") && (msg.includes("podcast") || msg.includes("audio"))) {
    skills.add("curadora_podcast");
  }

  return Array.from(skills);
}

function resolvePipeline(skills: SkillKey[], intent: ClassifiedIntent): PipelineKey | null {
  if (skills.length < 2) return null;

  // Check if detected skills match a known pipeline
  for (const [key, pipeline] of Object.entries(PIPELINES)) {
    const pipeSkills = new Set(pipeline.skills);
    const matchCount = skills.filter(s => pipeSkills.has(s)).length;
    if (matchCount >= pipeSkills.size) return key as PipelineKey;
  }

  // Intent-based pipeline fallback
  if (intent.intencao === "leitura_jornada") return "leitura_jornada";
  if (intent.intencao === "apoio_clinico" && skills.includes("guardiao_jornada")) return "conducao_clinica";

  return null;
}

function resolveExecutionMode(skills: SkillKey[]): ModoExecucao {
  if (skills.length === 0) return "direct_response";
  if (skills.length === 1) return "single_skill";
  return "pipeline";
}

// ============================================
// 9. buildMinimalPayload()
// ============================================

function buildMinimalPayload(
  ctx: ClassifiedContext,
  intent: ClassifiedIntent,
  extraCtx: Record<string, unknown> | undefined,
  skills: SkillKey[]
): MinimalPayload {
  const safeFields = new Set([
    "pageName", "module", "bookTitle", "bookAuthor", "cycleTheme",
    "stationName", "currentTool", "clientCodinome",
  ]);

  const contextSnippet: Record<string, unknown> = {};

  if (extraCtx) {
    for (const [key, val] of Object.entries(extraCtx)) {
      if (safeFields.has(key) && val !== undefined && val !== null) {
        contextSnippet[key] = val;
      }
    }
  }

  // For visitante, strip everything sensitive
  if (ctx.tipoUsuaria === "visitante") {
    delete contextSnippet.clientCodinome;
  }

  // For non-terapeuta, never include clinical context
  if (ctx.tipoUsuaria !== "terapeuta") {
    delete contextSnippet.clientCodinome;
  }

  return {
    tipoUsuaria: ctx.tipoUsuaria,
    area: ctx.area,
    subArea: ctx.subArea,
    modoEspecial: ctx.modoEspecial,
    contextSnippet,
  };
}

// ============================================
// 10. DEPTH CALIBRATION
// ============================================

function getDepthInstruction(tipo: TipoUsuaria): string {
  switch (tipo) {
    case "visitante": return "PROFUNDIDADE BAIXA: linguagem acessível, sem jargão, foco em acolhimento e orientação simples.";
    case "cliente": return "PROFUNDIDADE MÉDIA: acolhimento + pequenos movimentos. Não aprofundar demais. Linguagem cuidadosa.";
    case "aluna": return "PROFUNDIDADE ALTA: compreensão + aplicação. Pode usar conceitos do método. Foco pedagógico.";
    case "terapeuta": return "PROFUNDIDADE ESTRATÉGICA: decisão clínica + estruturação. Linguagem profissional. Raciocínio clínico.";
  }
}

// ============================================
// 11. composeSyntheiaResponse() — Build prompt
// ============================================

function composeSystemPrompt(
  mode: string,
  ctx: ClassifiedContext,
  intent: ClassifiedIntent,
  plan: ExecutionPlan,
  payload: MinimalPayload,
  voicePrompt?: string
): string {
  const parts: string[] = [SYNTHEIA_CORE];

  // Mode prompt
  const modePrompt = MODE_PROMPTS[mode];
  if (modePrompt) parts.push(modePrompt);

  // Depth
  parts.push(`\n📏 CALIBRAÇÃO DE PROFUNDIDADE\n${getDepthInstruction(ctx.tipoUsuaria)}`);

  // Context block
  parts.push(`\n📍 CONTEXTO ATUAL
• Tipo de Usuária: ${ctx.tipoUsuaria}
• Área: ${ctx.area}
• Sub-área: ${ctx.subArea}
• Modo especial: ${ctx.modoEspecial || 'nenhum'}
• Intenção detectada: ${intent.intencao}
• Complexidade: ${intent.complexidade}
• Risco: ${intent.risco}`);

  // Risk warning
  if (intent.risco === "sensivel") {
    parts.push(`\n⚠️ ALERTA DE RISCO SENSÍVEL
Esta interação envolve conteúdo sensível. Reforce limites éticos.
NÃO diagnostique. NÃO substitua a terapeuta. NÃO faça interpretações invasivas.
Se detectar sinais de crise, oriente a buscar ajuda profissional.`);
  }

  // Skill prompts
  if (plan.skills.length === 1) {
    parts.push(`\n${SKILLS[plan.skills[0]].prompt}`);
  } else if (plan.skills.length > 1) {
    const pipelineInfo = plan.pipeline ? PIPELINES[plan.pipeline] : null;
    parts.push(`\n🔗 PIPELINE${pipelineInfo ? `: ${pipelineInfo.nome}` : ''} — ${pipelineInfo?.descricao || 'Composição de múltiplas skills'}
Integre as seguintes capacidades em uma resposta coesa e UNIFICADA.
NÃO separe por skill. Componha como SINTHEYA.\n`);
    for (const sk of plan.skills) {
      parts.push(SKILLS[sk].prompt);
    }
  }

  // Voice
  if (voicePrompt) {
    parts.push(`\nVOZ ATIVA\n${voicePrompt}`);
  }

  // Extra context snippet
  if (Object.keys(payload.contextSnippet).length > 0) {
    parts.push(`\nCONTEXTO ADICIONAL\n${JSON.stringify(payload.contextSnippet, null, 2)}`);
  }

  // Composition directive
  parts.push(`\n🔷 DIRETIVA DE COMPOSIÇÃO FINAL
Sua resposta DEVE seguir o formato: Núcleo → Leitura → Direção (→ Limite Ético se necessário).
Mantenha coerência com o tipo de usuária (${ctx.tipoUsuaria}) e a profundidade calibrada.
A resposta é sempre DA SINTHEYA — nunca de uma skill isolada.`);

  return parts.join("\n\n");
}

// ============================================
// 12. logMinimalTrace()
// ============================================

function logMinimalTrace(trace: TraceLog): void {
  // Console log for edge function logs — no sensitive data
  console.log(JSON.stringify({
    t: trace.timestamp,
    uid: trace.userId.slice(0, 8),
    tipo: trace.tipoUsuaria,
    area: trace.area,
    intent: trace.intencao,
    mode: trace.modoExecucao,
    skills: trace.skills,
    pipeline: trace.pipeline,
    status: trace.status,
    ms: trace.latencyMs,
  }));
}

// ============================================
// 13. MAIN HANDLER
// ============================================

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const startTime = Date.now();
  let tracePartial: Partial<TraceLog> = { timestamp: new Date().toISOString() };

  try {
    // === STEP 1: Security — Authenticate ===
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

    tracePartial.userId = user.id;

    // === STEP 2: Validate API Key ===
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OPENAI_API_KEY não configurada" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // === STEP 3: Parse & Validate Request ===
    const body: SyntheiaChatRequest = await req.json();
    const { mode, messages, extra_context, voice_prompt, routing_context } = body;

    if (!mode || !MODE_PROMPTS[mode]) {
      return new Response(
        JSON.stringify({ error: `Modo inválido: ${mode}. Use: arcano, arcane ou ferramenteira` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Messages array is required and cannot be empty" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // === STEP 4: classifyUserContext() ===
    const frontendCtx: FrontendRoutingContext = routing_context || {};
    const classifiedCtx = classifyUserContext(frontendCtx, extra_context);
    tracePartial.tipoUsuaria = classifiedCtx.tipoUsuaria;
    tracePartial.area = classifiedCtx.area;

    // === STEP 5: classifyIntent() ===
    const lastUserMessage = [...messages].reverse().find(m => m.role === "user")?.content || "";
    const classifiedIntent = classifyIntent(lastUserMessage, classifiedCtx);
    tracePartial.intencao = classifiedIntent.intencao;

    // === STEP 6: resolveSkills() + resolveExecutionMode() ===
    const detectedSkills = resolveSkillsFromIntent(classifiedIntent, classifiedCtx, lastUserMessage);
    const pipeline = resolvePipeline(detectedSkills, classifiedIntent);
    const executionMode = resolveExecutionMode(detectedSkills);

    const executionPlan: ExecutionPlan = {
      mode: executionMode,
      skills: detectedSkills,
      pipeline,
    };

    tracePartial.modoExecucao = executionMode;
    tracePartial.skills = detectedSkills.map(k => SKILLS[k].nome);
    tracePartial.pipeline = pipeline;

    // === STEP 7: buildMinimalPayload() ===
    const payload = buildMinimalPayload(classifiedCtx, classifiedIntent, extra_context, detectedSkills);

    // === STEP 8: composeSyntheiaResponse() — Build system prompt ===
    const systemPrompt = composeSystemPrompt(mode, classifiedCtx, classifiedIntent, executionPlan, payload, voice_prompt);

    // === STEP 9: Execute — Call OpenAI ===
    const openaiMessages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

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

      tracePartial.status = "error";
      logMinimalTrace(tracePartial as TraceLog);

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
      tracePartial.status = "error";
      logMinimalTrace(tracePartial as TraceLog);
      return new Response(
        JSON.stringify({ error: "Resposta vazia da OpenAI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // === STEP 10: logMinimalTrace() ===
    tracePartial.status = "success";
    tracePartial.latencyMs = Date.now() - startTime;
    logMinimalTrace(tracePartial as TraceLog);

    // === Return ===
    return new Response(
      JSON.stringify({
        mode,
        message: { role: "assistant", content },
        usage: data.usage,
        routing: {
          executionMode,
          pipeline: pipeline ? PIPELINES[pipeline].nome : null,
          skillsActivated: detectedSkills.map(k => SKILLS[k].nome),
          context: {
            tipoUsuaria: classifiedCtx.tipoUsuaria,
            area: classifiedCtx.area,
            intencao: classifiedIntent.intencao,
            complexidade: classifiedIntent.complexidade,
            risco: classifiedIntent.risco,
          },
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("[syntheia-chat] Error:", error);
    tracePartial.status = "error";
    tracePartial.latencyMs = Date.now() - startTime;
    try { logMinimalTrace(tracePartial as TraceLog); } catch (_) { /* noop */ }
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
