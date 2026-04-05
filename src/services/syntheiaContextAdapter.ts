// ============================================
// SYNTHEIA CONTEXT ADAPTER
// Maps route + user type to contextual SINTHEYA config
// Includes routing context for skill detection
// ============================================

import { SyntheiaChatMode, RoutingContext } from '@/services/syntheiaChat';
import { PortalType } from '@/types/portal';

export type TherabotUserType = 'visitante' | 'cliente' | 'aluna' | 'terapeuta';

export interface TherabotContext {
  tipoUsuario: TherabotUserType;
  area: string;
  subArea?: string;
  pageName?: string;
  module?: string;
}

export interface QuickAction {
  label: string;
  prompt: string;
  icon: string;
}

export interface NavigationSuggestion {
  label: string;
  path: string;
  icon: string;
}

export interface TherabotConfig {
  mode: SyntheiaChatMode;
  welcomeMessage: string;
  voicePrompt: string;
  quickActions: QuickAction[];
  navigationSuggestions: NavigationSuggestion[];
  title: string;
  areaLabel: string;
  routingContext: RoutingContext;
}

function resolveUserType(portal: PortalType | undefined): TherabotUserType {
  if (!portal || portal === 'visitante') return 'visitante';
  if (portal === 'admin' || portal === 'oracula' || portal === 'assinante' || portal === 'iniciada') return 'terapeuta';
  return 'aluna';
}

interface AreaResolution {
  area: string;
  subArea?: string;
  pageName?: string;
  module?: string;
}

function resolveArea(pathname: string): AreaResolution {
  const segments = pathname.split('/').filter(Boolean);

  // Meu Jardim
  if (pathname.startsWith('/meu-jardim')) {
    const sub = segments[1];
    if (sub === 'praticas') return { area: 'meu-jardim', subArea: 'praticas', pageName: 'Práticas Guiadas', module: 'jardim' };
    if (sub === 'travessia') return { area: 'meu-jardim', subArea: 'travessia', pageName: 'Minha Travessia', module: 'jardim' };
    if (sub === 'registros') return { area: 'meu-jardim', subArea: 'registros', pageName: 'Meus Registros', module: 'jardim' };
    if (sub === 'acompanhamento') return { area: 'meu-jardim', subArea: 'acompanhamento', pageName: 'Acompanhamento', module: 'jardim' };
    return { area: 'meu-jardim', pageName: 'Meu Jardim', module: 'jardim' };
  }

  // Casa das Máquinas
  if (pathname.startsWith('/casa-das-maquinas')) {
    const sub = segments[1];
    if (sub === 'clientes') return { area: 'casa-das-maquinas', subArea: 'clientes', pageName: 'Clientes', module: 'casa-das-maquinas' };
    if (sub === 'sessao' || sub === 'sessoes') return { area: 'casa-das-maquinas', subArea: 'sessoes', pageName: 'Sessões', module: 'casa-das-maquinas' };
    if (sub === 'jardim-oficio') return { area: 'casa-das-maquinas', subArea: 'jardim-oficio', pageName: 'Jardim do Ofício', module: 'casa-das-maquinas' };
    if (sub === 'treinamento') return { area: 'casa-das-maquinas', subArea: 'treinamento', pageName: 'Evolução Clínica', module: 'casa-das-maquinas' };
    if (sub === 'biblioteca') return { area: 'casa-das-maquinas', subArea: 'biblioteca', pageName: 'Biblioteca de Intervenções', module: 'casa-das-maquinas' };
    if (sub === 'supervisao') return { area: 'casa-das-maquinas', subArea: 'supervisao', pageName: 'Supervisão', module: 'casa-das-maquinas' };
    if (sub === 'ferramentas') return { area: 'casa-das-maquinas', subArea: 'ferramentas', pageName: 'Ferramentas', module: 'casa-das-maquinas' };
    return { area: 'casa-das-maquinas', pageName: 'Casa das Máquinas', module: 'casa-das-maquinas' };
  }

  // Jardim da Psique
  if (pathname.startsWith('/jardim-da-psique')) return { area: 'jardim-da-psique', pageName: 'Jardim da Psique', module: 'jardim' };

  // Biblioteca
  if (pathname.startsWith('/biblioteca')) return { area: 'biblioteca', pageName: 'Biblioteca', module: 'biblioteca' };

  // Sala de Treinamento
  if (pathname.startsWith('/sala-de-treinamento')) return { area: 'treinamento', pageName: 'Sala de Treinamento', module: 'treinamento' };

  // Oráculos
  if (pathname.startsWith('/oraculos') || pathname.startsWith('/oraculo')) return { area: 'oraculos', pageName: 'Oráculos', module: 'oraculos' };

  // Clube
  if (pathname.startsWith('/app/clube') || pathname.startsWith('/clube')) return { area: 'clube', pageName: 'Clube Oracular', module: 'clube' };

  // Formação
  if (pathname.startsWith('/formacao') || pathname.startsWith('/cursos')) return { area: 'formacao', pageName: 'Caminhos de Formação', module: 'formacao' };

  // Dashboard membro
  if (pathname.startsWith('/dashboard')) return { area: 'dashboard', pageName: 'Minha Jornada', module: 'dashboard' };

  // Mapa da casa
  if (pathname.startsWith('/mapa-da-casa') || pathname.startsWith('/explorar')) return { area: 'mapa-casa', pageName: 'Explorar a Casa', module: 'casa' };

  return { area: 'geral', pageName: 'Casa Orácula', module: 'geral' };
}

/**
 * Detect likely user intent based on area and user type
 */
function detectIntencao(ctx: TherabotContext): string | undefined {
  if (ctx.area === 'clube') return 'conversa_material_fonte';
  if (ctx.area === 'casa-das-maquinas' && ctx.subArea === 'sessoes') return 'apoio_clinico';
  if (ctx.area === 'casa-das-maquinas' && ctx.subArea === 'clientes') return 'leitura_jornada';
  if (ctx.area === 'casa-das-maquinas') return 'conducao_clinica';
  if (ctx.area === 'treinamento' || ctx.area === 'formacao') return 'explicacao_aprendizado';
  if (ctx.area === 'meu-jardim') return 'reflexao_simbolica';
  if (ctx.area === 'oraculos') return 'reflexao_simbolica';
  if (ctx.area === 'biblioteca') return 'explicacao_aprendizado';
  if (ctx.tipoUsuario === 'visitante') return 'navegacao';
  return undefined;
}

export function buildTherabotContext(pathname: string, portal?: PortalType): TherabotContext {
  const tipoUsuario = resolveUserType(portal);
  const { area, subArea, pageName, module } = resolveArea(pathname);

  if (area === 'meu-jardim') {
    return { tipoUsuario: 'cliente', area, subArea, pageName, module };
  }

  return { tipoUsuario, area, subArea, pageName, module };
}

/**
 * Build routing context for the edge function skill router
 */
export function buildRoutingContext(ctx: TherabotContext): RoutingContext {
  return {
    tipoUsuario: ctx.tipoUsuario,
    area: ctx.area,
    subArea: ctx.subArea,
    module: ctx.module,
    pageName: ctx.pageName,
    intencao: detectIntencao(ctx),
  };
}

// ============================================
// VISITOR CONFIGS
// ============================================

const VISITOR_NAV: NavigationSuggestion[] = [
  { label: 'Explorar a Casa', path: '/mapa-da-casa', icon: 'home' },
  { label: 'Vivenciar um Oráculo', path: '/oraculos', icon: 'sparkles' },
  { label: 'Caminhos de Formação', path: '/formacao', icon: 'book' },
];

function getVisitorConfig(ctx: TherabotContext): TherabotConfig {
  const areaMessages: Record<string, string> = {
    'oraculos': '✨ Você está na entrada dos Oráculos. Cada oráculo é uma travessia simbólica — não uma previsão. Quer que eu te ajude a escolher por onde começar?',
    'mapa-casa': '🏛️ Você está explorando a Casa Orácula. Cada sala tem uma função no caminho interior. Posso te guiar por elas.',
    'clube': '📖 Bem-vinda ao Clube Oracular. Aqui o livro é um portal de formação, não uma leitura comum. Quer saber como funciona?',
    'formacao': '🌱 Você está nos Caminhos de Formação. Aqui começa a jornada de quem deseja se tornar terapeuta oracular.',
  };

  return {
    mode: 'arcano',
    title: 'Therabot',
    areaLabel: ctx.pageName || 'Casa Orácula',
    welcomeMessage: areaMessages[ctx.area] || '✨ Bem-vinda à Casa Orácula. Sou a Therabot — estou aqui para te ajudar a explorar este espaço simbólico. Por onde gostaria de começar?',
    voicePrompt: 'Você é uma guia acolhedora da Casa Orácula. Fale com suavidade, convide à exploração sem pressionar. Explique o que é a casa de forma simbólica e acessível. Nunca diagnostique ou aconselhe clinicamente.',
    quickActions: [
      { label: 'Entender a Casa', prompt: 'O que é a Casa Orácula e como ela funciona?', icon: 'home' },
      { label: 'Fazer minha primeira travessia', prompt: 'Quero começar minha primeira travessia simbólica. Como funciona?', icon: 'compass' },
      { label: 'Vivenciar um oráculo', prompt: 'Quero vivenciar um oráculo. O que está disponível para mim?', icon: 'sparkles' },
    ],
    navigationSuggestions: VISITOR_NAV,
    routingContext: buildRoutingContext(ctx),
  };
}

// ============================================
// CLIENT CONFIGS (Jardim da Heroína)
// ============================================

const CLIENT_NAV: NavigationSuggestion[] = [
  { label: 'Ver Meu Jardim', path: '/meu-jardim', icon: 'flower' },
  { label: 'Práticas Guiadas', path: '/meu-jardim/praticas', icon: 'target' },
  { label: 'Vivenciar um Oráculo', path: '/oraculos', icon: 'sparkles' },
];

function getClientConfig(ctx: TherabotContext): TherabotConfig {
  const subMessages: Record<string, string> = {
    'praticas': '🌿 Você está nas Práticas Guiadas. Posso te ajudar a escolher uma prática adequada ao seu momento ou a refletir sobre uma que já fez.',
    'travessia': '🌙 Você está acompanhando sua Travessia. Posso te ajudar a olhar para o caminho percorrido ou refletir sobre o próximo passo.',
    'registros': '📝 Você está nos seus Registros. Posso te ajudar a organizar o que vivenciou ou a encontrar padrões simbólicos.',
    'acompanhamento': '🤝 Você está no Acompanhamento da Terapeuta. Posso te ajudar a preparar o que deseja compartilhar na próxima sessão.',
  };

  return {
    mode: 'arcano',
    title: 'Therabot',
    areaLabel: ctx.pageName || 'Meu Jardim',
    welcomeMessage: subMessages[ctx.subArea || ''] || '🌿 Olá. Estou aqui no seu Jardim para te acompanhar. Posso te ajudar a refletir, sugerir uma prática ou explorar algo que surgiu no seu caminho.',
    voicePrompt: 'Você é uma companheira simbólica no Jardim da Heroína. Ofereça apoio emocional através de linguagem simbólica. Sugira reflexões e práticas. Nunca diagnostique, nunca substitua a terapeuta, nunca force revelações. Respeite o tempo psíquico.',
    quickActions: [
      { label: 'Refletir sobre meu momento', prompt: 'Quero refletir sobre como estou me sentindo agora. Me ajuda a colocar em palavras?', icon: 'heart' },
      { label: 'Receber uma prática guiada', prompt: 'Preciso de uma prática simbólica guiada para o meu momento. O que sugere?', icon: 'flower' },
      { label: 'Organizar meu registro', prompt: 'Quero organizar o que vivenciei recentemente. Me ajuda a dar forma simbólica a isso?', icon: 'list' },
    ],
    navigationSuggestions: CLIENT_NAV,
    routingContext: buildRoutingContext(ctx),
  };
}

// ============================================
// STUDENT CONFIGS
// ============================================

const STUDENT_NAV: NavigationSuggestion[] = [
  { label: 'Ir para Biblioteca', path: '/biblioteca', icon: 'book' },
  { label: 'Sala de Treinamento', path: '/sala-de-treinamento', icon: 'target' },
  { label: 'Jardim da Psique', path: '/jardim-da-psique', icon: 'flower' },
  { label: 'Clube Oracular', path: '/app/clube', icon: 'sparkles' },
];

function getStudentConfig(ctx: TherabotContext): TherabotConfig {
  const areaMessages: Record<string, string> = {
    'biblioteca': '📚 Você está na Biblioteca. Posso te ajudar a encontrar um livro, entender uma referência ou conectar conceitos que está estudando.',
    'treinamento': '🎯 Você está na Sala de Treinamento. Posso sugerir exercícios, explicar técnicas ou revisar o que você praticou.',
    'jardim-da-psique': '🌿 Você está no Jardim da Psique. Posso te ajudar a integrar o que vivenciou ou refletir sobre seu processo formativo.',
    'clube': '📖 Você está no Clube Oracular. Posso te ajudar a aprofundar a leitura atual ou conectar a obra com sua formação.',
    'formacao': '🌱 Você está nos Caminhos de Formação. Posso orientar sobre próximos passos ou esclarecer dúvidas sobre o percurso.',
    'dashboard': '🧭 Você está na sua Jornada. Posso te ajudar a entender seu progresso ou sugerir o próximo passo de estudo.',
  };

  return {
    mode: 'ferramenteira',
    title: 'Therabot',
    areaLabel: ctx.pageName || 'Formação',
    welcomeMessage: areaMessages[ctx.area] || '📚 Olá, estudante. Estou aqui para apoiar sua formação. Posso explicar conceitos, sugerir práticas de estudo ou ajudar a revisar o que aprendeu.',
    voicePrompt: 'Você é uma mentora de formação na Casa Orácula. Apoie o estudo com clareza, sem didatismo excessivo. Explique conceitos simbólicos e terapêuticos quando solicitado. Sugira práticas e revisões. Não resuma livros, não crie arquétipos, mantenha profundidade.',
    quickActions: [
      { label: 'Explicar este conceito', prompt: 'Preciso entender melhor um conceito que estou estudando. Pode me explicar de forma clara?', icon: 'book' },
      { label: 'Sugerir próximo passo', prompt: 'Qual seria o próximo passo ideal no meu estudo com base no que estou aprendendo agora?', icon: 'compass' },
      { label: 'Revisar o que aprendi aqui', prompt: 'Quero revisar o que aprendi nesta área. Me ajuda a organizar e consolidar?', icon: 'list' },
    ],
    navigationSuggestions: STUDENT_NAV,
    routingContext: buildRoutingContext(ctx),
  };
}

// ============================================
// THERAPIST CONFIGS (Casa das Máquinas)
// ============================================

const THERAPIST_NAV: NavigationSuggestion[] = [
  { label: 'Casa das Máquinas', path: '/casa-das-maquinas', icon: 'home' },
  { label: 'Clientes', path: '/casa-das-maquinas/clientes', icon: 'file-text' },
  { label: 'Jardim do Ofício', path: '/casa-das-maquinas/jardim-oficio', icon: 'flower' },
  { label: 'Biblioteca de Intervenções', path: '/casa-das-maquinas/biblioteca', icon: 'book' },
];

function getTherapistConfig(ctx: TherabotContext): TherabotConfig {
  const subMessages: Record<string, string> = {
    'clientes': '📋 Você está na área de Clientes. Posso te ajudar a organizar uma hipótese clínica, sintetizar anotações ou preparar a próxima sessão.',
    'sessoes': '🎯 Você está na área de Sessões. Posso sugerir conduções, ajudar a estruturar um roteiro ou gerar insights a partir do contexto clínico.',
    'jardim-oficio': '🌿 Você está no Jardim do Ofício. Posso te ajudar a refletir sobre sua prática, revisar aprendizados ou integrar experiências profissionais.',
    'treinamento': '📈 Você está na Evolução Clínica. Posso sugerir exercícios, revisar técnicas ou ajudar a identificar áreas de desenvolvimento.',
    'biblioteca': '📚 Você está na Biblioteca de Intervenções. Posso te ajudar a encontrar ferramentas adequadas para um caso ou contexto específico.',
    'supervisao': '🔍 Você está na Supervisão. Posso apoiar sua reflexão clínica com perguntas orientadoras ou oferecer uma leitura simbólica complementar.',
    'ferramentas': '🔧 Você está nas Ferramentas. Posso te ajudar a escolher a ferramenta certa para o momento clínico ou explicar como usá-la.',
  };

  return {
    mode: 'ferramenteira',
    title: 'Therabot',
    areaLabel: ctx.pageName || 'Casa das Máquinas',
    welcomeMessage: subMessages[ctx.subArea || ''] || '🔧 Olá, terapeuta. Estou aqui como apoio clínico. Posso sugerir conduções, ajudar a ler um caso ou gerar insights — sem substituir seu julgamento profissional.',
    voicePrompt: 'Você é uma assistente clínica para terapeutas na Casa das Máquinas. Ofereça suporte profissional: sugestões de condução, leitura simbólica de casos, ferramentas de intervenção. Nunca substitua o julgamento da terapeuta. Linguagem precisa, ética, sem misticismo performático.',
    quickActions: [
      { label: 'Sugerir condução', prompt: 'Preciso de uma sugestão de condução para uma sessão. Pode me ajudar com direcionamentos?', icon: 'compass' },
      { label: 'Ler este caso', prompt: 'Quero uma leitura simbólica de um caso que estou acompanhando. Me ajuda a olhar por outro ângulo?', icon: 'file-text' },
      { label: 'Organizar hipótese clínica', prompt: 'Preciso organizar uma hipótese clínica com base nas observações da sessão. Me ajuda a estruturar?', icon: 'lightbulb' },
      { label: 'Transformar anotação em síntese', prompt: 'Tenho anotações de sessão. Me ajuda a transformar em uma síntese clínica organizada?', icon: 'list' },
    ],
    navigationSuggestions: THERAPIST_NAV,
    routingContext: buildRoutingContext(ctx),
  };
}

// ============================================
// MAIN CONFIG RESOLVER
// ============================================

export function getTherabotConfig(context: TherabotContext): TherabotConfig {
  switch (context.tipoUsuario) {
    case 'visitante': return getVisitorConfig(context);
    case 'cliente': return getClientConfig(context);
    case 'aluna': return getStudentConfig(context);
    case 'terapeuta': return getTherapistConfig(context);
    default: return getVisitorConfig(context);
  }
}
