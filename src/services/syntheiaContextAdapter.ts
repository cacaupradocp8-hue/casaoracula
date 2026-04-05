// ============================================
// SYNTHEIA CONTEXT ADAPTER
// Maps route + user type to contextual SINTHEYA config
// ============================================

import { SyntheiaChatMode } from '@/services/syntheiaChat';
import { PortalType } from '@/types/portal';

export type TherabotUserType = 'visitante' | 'cliente' | 'aluna' | 'terapeuta';

export interface TherabotContext {
  tipoUsuario: TherabotUserType;
  area: string;
  subArea?: string;
}

export interface QuickAction {
  label: string;
  prompt: string;
  icon: string;
}

export interface TherabotConfig {
  mode: SyntheiaChatMode;
  welcomeMessage: string;
  voicePrompt: string;
  quickActions: QuickAction[];
  title: string;
}

function resolveUserType(portal: PortalType | undefined): TherabotUserType {
  if (!portal || portal === 'visitante') return 'visitante';
  if (portal === 'admin' || portal === 'oracula' || portal === 'assinante' || portal === 'iniciada') return 'terapeuta';
  return 'aluna';
}

function resolveArea(pathname: string): { area: string; subArea?: string } {
  if (pathname.startsWith('/meu-jardim')) return { area: 'meu-jardim', subArea: pathname.split('/')[2] };
  if (pathname.startsWith('/casa-das-maquinas')) return { area: 'casa-das-maquinas', subArea: pathname.split('/')[2] };
  if (pathname.startsWith('/jardim-da-psique')) return { area: 'jardim-da-psique' };
  if (pathname.startsWith('/biblioteca')) return { area: 'biblioteca' };
  if (pathname.startsWith('/sala-de-treinamento')) return { area: 'treinamento' };
  if (pathname.startsWith('/oraculos')) return { area: 'oraculos' };
  return { area: 'geral' };
}

export function buildTherabotContext(pathname: string, portal?: PortalType): TherabotContext {
  const tipoUsuario = resolveUserType(portal);
  const { area, subArea } = resolveArea(pathname);

  // Override: if on /meu-jardim, treat as cliente regardless
  if (area === 'meu-jardim') {
    return { tipoUsuario: 'cliente', area, subArea };
  }

  return { tipoUsuario, area, subArea };
}

const VISITOR_CONFIG: TherabotConfig = {
  mode: 'arcano',
  title: 'Therabot',
  welcomeMessage: '✨ Bem-vinda à Casa Orácula. Sou a Therabot — estou aqui para te ajudar a explorar este espaço simbólico. Por onde gostaria de começar?',
  voicePrompt: 'Você é uma guia acolhedora da Casa Orácula. Fale com suavidade, convide à exploração sem pressionar. Explique o que é a casa de forma simbólica e acessível. Nunca diagnostique ou aconselhe clinicamente.',
  quickActions: [
    { label: 'Explorar um oráculo', prompt: 'Quero explorar um oráculo. O que está disponível para mim?', icon: 'sparkles' },
    { label: 'Entender a Casa', prompt: 'O que é a Casa Orácula e como ela funciona?', icon: 'home' },
    { label: 'Começar jornada', prompt: 'Quero começar minha jornada aqui. Qual o primeiro passo?', icon: 'compass' },
  ],
};

const CLIENT_CONFIG: TherabotConfig = {
  mode: 'arcano',
  title: 'Therabot',
  welcomeMessage: '🌿 Olá. Estou aqui no seu Jardim para te acompanhar. Posso te ajudar a refletir, sugerir uma prática ou explorar algo que surgiu no seu caminho.',
  voicePrompt: 'Você é uma companheira simbólica no Jardim da Heroína. Ofereça apoio emocional através de linguagem simbólica. Sugira reflexões e práticas. Nunca diagnostique, nunca substitua a terapeuta, nunca force revelações. Respeite o tempo psíquico.',
  quickActions: [
    { label: 'Refletir sobre meu momento', prompt: 'Quero refletir sobre como estou me sentindo agora. Me ajuda a colocar em palavras?', icon: 'heart' },
    { label: 'Receber uma prática', prompt: 'Preciso de uma prática simbólica para o meu momento. O que sugere?', icon: 'flower' },
    { label: 'Interpretar um registro', prompt: 'Quero entender melhor algo que registrei no meu jardim. Pode me ajudar a olhar de forma simbólica?', icon: 'eye' },
  ],
};

const STUDENT_CONFIG: TherabotConfig = {
  mode: 'ferramenteira',
  title: 'Therabot',
  welcomeMessage: '📚 Olá, estudante. Estou aqui para apoiar sua formação. Posso explicar conceitos, sugerir práticas de estudo ou ajudar a revisar o que aprendeu.',
  voicePrompt: 'Você é uma mentora de formação na Casa Orácula. Apoie o estudo com clareza, sem didatismo excessivo. Explique conceitos simbólicos e terapêuticos quando solicitado. Sugira práticas e revisões. Não resuma livros, não crie arquétipos, mantenha profundidade.',
  quickActions: [
    { label: 'Explicar este conceito', prompt: 'Preciso entender melhor um conceito que estou estudando. Pode me explicar de forma clara?', icon: 'book' },
    { label: 'Sugerir prática', prompt: 'Sugira uma prática que me ajude a integrar o que estou aprendendo.', icon: 'target' },
    { label: 'Revisar aprendizado', prompt: 'Quero revisar o que aprendi recentemente. Me ajuda a organizar?', icon: 'list' },
  ],
};

const THERAPIST_CONFIG: TherabotConfig = {
  mode: 'ferramenteira',
  title: 'Therabot',
  welcomeMessage: '🔧 Olá, terapeuta. Estou aqui como apoio clínico. Posso sugerir conduções, ajudar a ler um caso ou gerar insights — sem substituir seu julgamento profissional.',
  voicePrompt: 'Você é uma assistente clínica para terapeutas na Casa das Máquinas. Ofereça suporte profissional: sugestões de condução, leitura simbólica de casos, ferramentas de intervenção. Nunca substitua o julgamento da terapeuta. Linguagem precisa, ética, sem misticismo performático.',
  quickActions: [
    { label: 'Sugerir condução', prompt: 'Preciso de uma sugestão de condução para uma sessão. Pode me ajudar com direcionamentos?', icon: 'compass' },
    { label: 'Ler este caso', prompt: 'Quero uma leitura simbólica de um caso que estou acompanhando. Me ajuda a olhar por outro ângulo?', icon: 'file-text' },
    { label: 'Gerar insight clínico', prompt: 'Preciso de um insight clínico sobre um padrão que estou observando. O que você percebe?', icon: 'lightbulb' },
  ],
};

export function getTherabotConfig(context: TherabotContext): TherabotConfig {
  switch (context.tipoUsuario) {
    case 'visitante': return VISITOR_CONFIG;
    case 'cliente': return CLIENT_CONFIG;
    case 'aluna': return STUDENT_CONFIG;
    case 'terapeuta': return THERAPIST_CONFIG;
    default: return VISITOR_CONFIG;
  }
}
