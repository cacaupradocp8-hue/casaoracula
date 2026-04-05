import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ============================================
// SYNTHEIA CHAT — Núcleo Orquestrador v3
// Com validação real de vínculo, payload mínimo
// por skill e proteção contra BOLA
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
  risco: Risco;
  status: "success" | "error" | "blocked";
  latencyMs: number;
}

interface FrontendRoutingContext {
  tipoUsuario?: string;
  area?: string;
  subArea?: string;
  module?: string;
  pageName?: string;
  intencao?: string;
  clientId?: string; // client UUID if therapist context
}

interface SyntheiaChatRequest {
  mode: string;
  messages: ChatMessage[];
  extra_context?: Record<string, unknown>;
  voice_prompt?: string;
  routing_context?: FrontendRoutingContext;
}

// ============================================
// 2. SKILL CONTRACTS — Security per skill
// ============================================

type SkillDomain = "publica" | "formativa" | "clinica";

interface SkillContract {
  domain: SkillDomain;
  requiresBond: boolean; // requires validated therapist-client link
  allowedFields: string[]; // whitelist of extra_context fields
  forbiddenFields: string[]; // explicitly blocked fields
  minPortal: string[]; // portal values that can use this skill
}

const SKILL_CONTRACTS: Record<SkillKey, SkillContract> = {
  guardiao_jornada: {
    domain: "clinica",
    requiresBond: true,
    allowedFields: ["clientCodinome", "currentTool"],
    forbiddenFields: ["clientId", "sessionNotes", "rawClinicalData"],
    minPortal: ["oracula", "admin"],
  },
  arquiteto_cidade: {
    domain: "formativa",
    requiresBond: false,
    allowedFields: ["pageName", "module", "currentTool"],
    forbiddenFields: ["clientId", "sessionNotes"],
    minPortal: ["mentorada", "aluna_formacao", "assinante", "oracula", "admin"],
  },
  arquiteto_fluxos: {
    domain: "clinica",
    requiresBond: true,
    allowedFields: ["clientCodinome", "currentTool", "pageName"],
    forbiddenFields: ["clientId", "sessionNotes", "rawClinicalData"],
    minPortal: ["oracula", "admin"],
  },
  engenheiro_dados: {
    domain: "clinica",
    requiresBond: true,
    allowedFields: ["clientCodinome", "currentTool"],
    forbiddenFields: ["clientId", "sessionNotes", "rawClinicalData"],
    minPortal: ["oracula", "admin"],
  },
  alquimista_conteudo: {
    domain: "formativa",
    requiresBond: false,
    allowedFields: ["pageName", "module", "bookTitle", "bookAuthor", "cycleTheme", "stationName"],
    forbiddenFields: ["clientId", "sessionNotes"],
    minPortal: ["mentorada", "aluna_formacao", "assinante", "oracula", "admin"],
  },
  curadora_podcast: {
    domain: "formativa",
    requiresBond: false,
    allowedFields: ["bookTitle", "bookAuthor", "cycleTheme"],
    forbiddenFields: ["clientId", "sessionNotes"],
    minPortal: ["mentorada", "aluna_formacao", "assinante", "oracula", "admin"],
  },
  designer_cartografia: {
    domain: "publica",
    requiresBond: false,
    allowedFields: ["pageName", "module"],
    forbiddenFields: ["clientId", "sessionNotes", "clientCodinome"],
    minPortal: ["visitante", "mentorada", "aluna_formacao", "assinante", "oracula", "admin"],
  },
  estrategista_gamificacao: {
    domain: "publica",
    requiresBond: false,
    allowedFields: ["pageName", "module"],
    forbiddenFields: ["clientId", "sessionNotes", "clientCodinome"],
    minPortal: ["visitante", "mentorada", "aluna_formacao", "assinante", "oracula", "admin"],
  },
  modo_livro: {
    domain: "formativa",
    requiresBond: false,
    allowedFields: ["bookTitle", "bookAuthor", "cycleTheme", "stationName", "pageName"],
    forbiddenFields: ["clientId", "sessionNotes", "clientCodinome"],
    minPortal: ["mentorada", "aluna_formacao", "assinante", "oracula", "admin"],
  },
};

// ============================================
// 3. SYNTHEIA CORE PROMPT
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
// 4. MODE PROMPTS
// ============================================

const MODE_PROMPTS: Record<string, string> = {
  arcano: `🎭 MODO ARCANO — Traduzir processos psíquicos em LINGUAGEM SIMBÓLICA. Metáforas terapêuticas, arquétipos em luz e sombra, contos simbólicos. TOM: Poético, evocativo, profundo.`,
  arcane: `🎭 MODO ARCANE — Traduzir processos psíquicos em LINGUAGEM SIMBÓLICA. Metáforas terapêuticas, arquétipos em luz e sombra, contos simbólicos. TOM: Poético, evocativo, profundo.`,
  ferramenteira: `🜂 MODO FERRAMENTEIRA — Transformar temas terapêuticos em PRÁTICA APLICÁVEL. Rituais, práticas, roteiros, perguntas terapêuticas, checklists. TOM: Direto, estruturado, prático.`,
};

// ============================================
// 5. SKILL DEFINITIONS
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
// 6. PIPELINE DEFINITIONS
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
// 7. SERVER-SIDE ROLE RESOLUTION
// ============================================

async function resolveServerSideRole(
  supabase: ReturnType<typeof createClient>,
  userId: string
): Promise<{ portal: string; tipoUsuaria: TipoUsuaria }> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("portal")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    return { portal: "visitante", tipoUsuaria: "visitante" };
  }

  const portal = data.portal as string;

  // Map portal to tipoUsuaria
  let tipoUsuaria: TipoUsuaria = "visitante";
  if (portal === "admin" || portal === "oracula") {
    tipoUsuaria = "terapeuta";
  } else if (portal === "aluna_formacao" || portal === "assinante") {
    tipoUsuaria = "aluna";
  } else if (portal === "mentorada") {
    tipoUsuaria = "aluna";
  } else if (portal === "visitante") {
    tipoUsuaria = "visitante";
  }
  // Legacy fallback
  if (portal === "iniciada") tipoUsuaria = "terapeuta";
  if (portal === "pre_iniciada") tipoUsuaria = "aluna";

  return { portal, tipoUsuaria };
}

// ============================================
// 8. CLINICAL ACCESS VALIDATION
// ============================================

interface ClinicalAccessResult {
  authorized: boolean;
  clientCodinome?: string;
  reason?: string;
}

async function validateClinicalAccess(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  portal: string,
  clientId?: string
): Promise<ClinicalAccessResult> {
  // Admin always authorized
  if (portal === "admin") {
    if (clientId) {
      // Even admin, fetch only codinome
      const { data } = await supabase
        .from("clientes")
        .select("nome")
        .eq("id", clientId)
        .single();
      return { authorized: true, clientCodinome: data?.nome || "Cliente" };
    }
    return { authorized: true };
  }

  // No clientId = no clinical context needed
  if (!clientId) {
    return { authorized: true };
  }

  // Validate real bond: therapist must be linked to client with status 'ativo'
  const { data: bond, error } = await supabase
    .from("clientes")
    .select("nome, status")
    .eq("id", clientId)
    .eq("terapeuta_id", userId)
    .in("status", ["ativo", "pausado"])
    .single();

  if (error || !bond) {
    return {
      authorized: false,
      reason: "Vínculo terapêutico não encontrado ou inativo",
    };
  }

  return {
    authorized: true,
    clientCodinome: bond.nome || "Cliente",
  };
}

// ============================================
// 9. classifyUserContext() — server-verified
// ============================================

function classifyUserContext(
  serverTipoUsuaria: TipoUsuaria,
  frontendCtx: FrontendRoutingContext,
  extraCtx: Record<string, unknown> | undefined
): ClassifiedContext {
  const areaRaw = frontendCtx.area || (extraCtx?.area as string) || "";
  const subRaw = frontendCtx.subArea || (extraCtx?.subArea as string) || "";
  const moduleRaw = frontendCtx.module || (extraCtx?.module as string) || "";

  // Map area from frontend hints (area itself is not a security boundary)
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

  const subArea: SubArea = subRaw || "geral";

  // Modo especial — derived from server-verified tipo + area
  let modoEspecial: ModoEspecial = null;
  if (area === "sessao") modoEspecial = "sessao";
  else if (area === "clube-do-livro") modoEspecial = "livro";
  else if (area === "treinamento") modoEspecial = "estudo";
  else if (serverTipoUsuaria === "terapeuta" && area === "casa-das-maquinas") modoEspecial = "terapeuta";
  else if (serverTipoUsuaria === "cliente") modoEspecial = "cliente";

  return { tipoUsuaria: serverTipoUsuaria, area, subArea, modoEspecial };
}

// ============================================
// 10. classifyIntent()
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

  let intencao: Intencao = "reflexao_simbolica";
  for (const { intencao: i, patterns } of INTENT_PATTERNS) {
    if (patterns.some(p => p.test(msg))) { intencao = i; break; }
  }

  if (ctx.modoEspecial === "livro" && intencao === "reflexao_simbolica") intencao = "conversa_material_fonte";
  if (ctx.modoEspecial === "sessao" && intencao === "reflexao_simbolica") intencao = "apoio_clinico";

  let complexidade: Complexidade = "baixa";
  if (msg.length > 300) complexidade = "alta";
  else if (msg.length > 100) complexidade = "media";
  if (["leitura_jornada", "apoio_clinico", "geracao_conteudo"].includes(intencao)) {
    complexidade = complexidade === "baixa" ? "media" : "alta";
  }

  let risco: Risco = "baixo";
  if (["apoio_clinico", "leitura_jornada"].includes(intencao)) risco = "moderado";
  if (ctx.tipoUsuaria === "terapeuta" && intencao === "apoio_clinico") risco = "sensivel";
  if (/suicid|autolesão|violência|abuso|crise/i.test(msg)) risco = "sensivel";

  return { intencao, complexidade, risco };
}

// ============================================
// 11. resolveSkills() + resolveExecutionMode()
// ============================================

function resolveSkillsFromIntent(
  intent: ClassifiedIntent,
  ctx: ClassifiedContext,
  message: string
): SkillKey[] {
  const skills: Set<SkillKey> = new Set();
  const msg = message.toLowerCase();

  if (ctx.modoEspecial === "livro" || ctx.area === "clube-do-livro") skills.add("modo_livro");
  if (ctx.modoEspecial === "sessao") skills.add("arquiteto_fluxos");
  if (ctx.area === "casa-das-maquinas" && ctx.subArea === "mapa-vivo") skills.add("engenheiro_dados");

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

  for (const [key, skill] of Object.entries(SKILLS)) {
    if (skills.has(key as SkillKey)) continue;
    for (const gatilho of skill.gatilhos) {
      if (msg.includes(gatilho)) { skills.add(key as SkillKey); break; }
    }
  }

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
  for (const [key, pipeline] of Object.entries(PIPELINES)) {
    const pipeSkills = new Set(pipeline.skills);
    const matchCount = skills.filter(s => pipeSkills.has(s)).length;
    if (matchCount >= pipeSkills.size) return key as PipelineKey;
  }
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
// 12. ENFORCE SKILL CONTRACTS
// ============================================

interface ContractEnforcementResult {
  authorized: boolean;
  filteredSkills: SkillKey[];
  blockedSkills: SkillKey[];
  reason?: string;
}

function enforceSkillContracts(
  skills: SkillKey[],
  portal: string,
  hasBond: boolean
): ContractEnforcementResult {
  const filtered: SkillKey[] = [];
  const blocked: SkillKey[] = [];

  for (const skill of skills) {
    const contract = SKILL_CONTRACTS[skill];

    // Check portal access
    if (!contract.minPortal.includes(portal) && portal !== "admin") {
      blocked.push(skill);
      continue;
    }

    // Check bond requirement
    if (contract.requiresBond && !hasBond && portal !== "admin") {
      blocked.push(skill);
      continue;
    }

    filtered.push(skill);
  }

  return {
    authorized: blocked.length === 0,
    filteredSkills: filtered,
    blockedSkills: blocked,
    reason: blocked.length > 0
      ? `Skills bloqueadas por falta de autorização: ${blocked.join(", ")}`
      : undefined,
  };
}

// ============================================
// 13. buildMinimalPayload() — per-skill filtering
// ============================================

function buildMinimalPayload(
  ctx: ClassifiedContext,
  _intent: ClassifiedIntent,
  extraCtx: Record<string, unknown> | undefined,
  skills: SkillKey[],
  clinicalAccess: ClinicalAccessResult
): MinimalPayload {
  // Compute the union of allowed fields across active skills
  const allowedFields = new Set<string>();
  const forbiddenFields = new Set<string>();

  if (skills.length === 0) {
    // Direct response: minimal safe fields only
    allowedFields.add("pageName");
    allowedFields.add("module");
  } else {
    for (const skill of skills) {
      const contract = SKILL_CONTRACTS[skill];
      for (const f of contract.allowedFields) allowedFields.add(f);
      for (const f of contract.forbiddenFields) forbiddenFields.add(f);
    }
  }

  // Forbidden always wins
  for (const f of forbiddenFields) allowedFields.delete(f);

  // Build snippet from allowed fields only
  const contextSnippet: Record<string, unknown> = {};
  if (extraCtx) {
    for (const [key, val] of Object.entries(extraCtx)) {
      if (allowedFields.has(key) && val !== undefined && val !== null) {
        // String values only — prevent object injection
        if (typeof val === "string" && val.length <= 500) {
          contextSnippet[key] = val;
        }
      }
    }
  }

  // Inject validated codinome if clinical access was authorized
  if (clinicalAccess.authorized && clinicalAccess.clientCodinome && allowedFields.has("clientCodinome")) {
    contextSnippet.clientCodinome = clinicalAccess.clientCodinome;
  }

  // NEVER include raw IDs in payload sent to AI
  delete contextSnippet.clientId;
  delete contextSnippet.userId;
  delete contextSnippet.sessionId;

  return {
    tipoUsuaria: ctx.tipoUsuaria,
    area: ctx.area,
    subArea: ctx.subArea,
    modoEspecial: ctx.modoEspecial,
    contextSnippet,
  };
}

// ============================================
// 14. DEPTH CALIBRATION
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
// 15. composeSystemPrompt()
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

  const modePrompt = MODE_PROMPTS[mode];
  if (modePrompt) parts.push(modePrompt);

  parts.push(`\n📏 CALIBRAÇÃO DE PROFUNDIDADE\n${getDepthInstruction(ctx.tipoUsuaria)}`);

  parts.push(`\n📍 CONTEXTO ATUAL
• Tipo de Usuária: ${ctx.tipoUsuaria}
• Área: ${ctx.area}
• Sub-área: ${ctx.subArea}
• Modo especial: ${ctx.modoEspecial || 'nenhum'}
• Intenção detectada: ${intent.intencao}
• Complexidade: ${intent.complexidade}
• Risco: ${intent.risco}`);

  if (intent.risco === "sensivel") {
    parts.push(`\n⚠️ ALERTA DE RISCO SENSÍVEL
Esta interação envolve conteúdo sensível. Reforce limites éticos.
NÃO diagnostique. NÃO substitua a terapeuta. NÃO faça interpretações invasivas.
Se detectar sinais de crise, oriente a buscar ajuda profissional.`);
  }

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

  if (voicePrompt) parts.push(`\nVOZ ATIVA\n${voicePrompt}`);

  if (Object.keys(payload.contextSnippet).length > 0) {
    parts.push(`\nCONTEXTO ADICIONAL\n${JSON.stringify(payload.contextSnippet, null, 2)}`);
  }

  parts.push(`\n🔷 DIRETIVA DE COMPOSIÇÃO FINAL
Sua resposta DEVE seguir o formato: Núcleo → Leitura → Direção (→ Limite Ético se necessário).
Mantenha coerência com o tipo de usuária (${ctx.tipoUsuaria}) e a profundidade calibrada.
A resposta é sempre DA SINTHEYA — nunca de uma skill isolada.`);

  return parts.join("\n\n");
}

// ============================================
// 16. logMinimalTrace()
// ============================================

function logMinimalTrace(trace: TraceLog): void {
  console.log(JSON.stringify({
    t: trace.timestamp,
    uid: trace.userId.slice(0, 8),
    tipo: trace.tipoUsuaria,
    area: trace.area,
    intent: trace.intencao,
    mode: trace.modoExecucao,
    skills: trace.skills,
    pipeline: trace.pipeline,
    risco: trace.risco,
    status: trace.status,
    ms: trace.latencyMs,
  }));
}

// ============================================
// 17. SAFE FALLBACK RESPONSE
// ============================================

function buildSafeFallbackResponse(reason: string): string {
  return JSON.stringify({
    mode: "arcano",
    message: {
      role: "assistant",
      content: "Posso ajudá-la com orientação geral, explicações sobre o método e navegação na Casa Orácula. Para acesso a conteúdo clínico ou dados específicos de clientes, é necessário ter o vínculo terapêutico ativo. Como posso ajudá-la?",
    },
    routing: {
      executionMode: "direct_response",
      pipeline: null,
      skillsActivated: [],
      context: { blocked: true, reason },
    },
  });
}

// ============================================
// 18. MAIN HANDLER
// ============================================

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const startTime = Date.now();
  const tracePartial: Partial<TraceLog> = { timestamp: new Date().toISOString() };

  try {
    // === STEP 1: Authenticate ===
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // User client for auth validation
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub as string;
    tracePartial.userId = userId;

    // Service client for privileged reads (user_roles, clientes bond check)
    const serviceClient = createClient(supabaseUrl, supabaseServiceKey);

    // === STEP 2: Server-side role resolution ===
    const { portal, tipoUsuaria: serverTipo } = await resolveServerSideRole(serviceClient, userId);

    // === STEP 3: Validate API Key ===
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OPENAI_API_KEY não configurada" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // === STEP 4: Parse & Validate Request ===
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

    // Limit messages array to prevent abuse
    if (messages.length > 50) {
      return new Response(
        JSON.stringify({ error: "Too many messages in conversation" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // === STEP 5: classifyUserContext() — uses server-verified tipo ===
    const frontendCtx: FrontendRoutingContext = routing_context || {};
    const classifiedCtx = classifyUserContext(serverTipo, frontendCtx, extra_context);
    tracePartial.tipoUsuaria = classifiedCtx.tipoUsuaria;
    tracePartial.area = classifiedCtx.area;

    // === STEP 6: classifyIntent() ===
    const lastUserMessage = [...messages].reverse().find(m => m.role === "user")?.content || "";
    const classifiedIntent = classifyIntent(lastUserMessage, classifiedCtx);
    tracePartial.intencao = classifiedIntent.intencao;
    tracePartial.risco = classifiedIntent.risco;

    // === STEP 7: resolveSkills() ===
    const detectedSkills = resolveSkillsFromIntent(classifiedIntent, classifiedCtx, lastUserMessage);

    // === STEP 8: Validate clinical access if any skill requires bond ===
    const requestedClientId = (routing_context?.clientId || extra_context?.clientId) as string | undefined;
    const anyClinicalSkill = detectedSkills.some(s => SKILL_CONTRACTS[s].requiresBond);

    let clinicalAccess: ClinicalAccessResult = { authorized: true };

    if (anyClinicalSkill && requestedClientId) {
      clinicalAccess = await validateClinicalAccess(serviceClient, userId, portal, requestedClientId);

      if (!clinicalAccess.authorized) {
        // BLOCKED — no clinical context, safe fallback
        tracePartial.status = "blocked";
        tracePartial.modoExecucao = "direct_response";
        tracePartial.skills = [];
        tracePartial.pipeline = null;
        tracePartial.latencyMs = Date.now() - startTime;
        logMinimalTrace(tracePartial as TraceLog);

        return new Response(
          buildSafeFallbackResponse(clinicalAccess.reason || "bond_missing"),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else if (anyClinicalSkill && !requestedClientId) {
      // Clinical skill requested but no clientId — downgrade to non-clinical
      clinicalAccess = { authorized: false, reason: "no_client_specified" };
    }

    // === STEP 9: Enforce skill contracts ===
    const hasBond = clinicalAccess.authorized && !!requestedClientId;
    const contractResult = enforceSkillContracts(detectedSkills, portal, hasBond);
    const activeSkills = contractResult.filteredSkills;

    // === STEP 10: Resolve execution plan with filtered skills ===
    const pipeline = resolvePipeline(activeSkills, classifiedIntent);
    const executionMode = resolveExecutionMode(activeSkills);

    const executionPlan: ExecutionPlan = {
      mode: executionMode,
      skills: activeSkills,
      pipeline,
    };

    tracePartial.modoExecucao = executionMode;
    tracePartial.skills = activeSkills.map(k => SKILLS[k].nome);
    tracePartial.pipeline = pipeline;

    // === STEP 11: buildMinimalPayload() — contract-filtered ===
    const payload = buildMinimalPayload(classifiedCtx, classifiedIntent, extra_context, activeSkills, clinicalAccess);

    // === STEP 12: composeSystemPrompt() ===
    const systemPrompt = composeSystemPrompt(mode, classifiedCtx, classifiedIntent, executionPlan, payload, voice_prompt);

    // === STEP 13: Call OpenAI ===
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
      tracePartial.latencyMs = Date.now() - startTime;
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
      tracePartial.latencyMs = Date.now() - startTime;
      logMinimalTrace(tracePartial as TraceLog);
      return new Response(
        JSON.stringify({ error: "Resposta vazia da OpenAI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // === STEP 14: Log & Return ===
    tracePartial.status = "success";
    tracePartial.latencyMs = Date.now() - startTime;
    logMinimalTrace(tracePartial as TraceLog);

    return new Response(
      JSON.stringify({
        mode,
        message: { role: "assistant", content },
        usage: data.usage,
        routing: {
          executionMode,
          pipeline: pipeline ? PIPELINES[pipeline].nome : null,
          skillsActivated: activeSkills.map(k => SKILLS[k].nome),
          blockedSkills: contractResult.blockedSkills.length > 0
            ? contractResult.blockedSkills.map(k => SKILLS[k].nome)
            : undefined,
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
