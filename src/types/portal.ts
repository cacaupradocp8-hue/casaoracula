export type PortalType = 'visitante' | 'mentorada' | 'aluna_formacao' | 'assinante' | 'oracula' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  portal: PortalType;
  createdAt: Date;
  avatarUrl?: string;
}

export interface Portal {
  type: PortalType;
  name: string;
  description: string;
  features: string[];
  caseLimit: number | 'unlimited';
}

export const PORTALS: Portal[] = [
  {
    type: 'visitante',
    name: 'Visitante',
    description: 'Acesso inicial à Casa ORÁCULA',
    features: [
      'Conteúdos simbólicos curtos',
      'Perguntas-oráculo',
      'Exploração da tese central',
    ],
    caseLimit: 0,
  },
  {
    type: 'mentorada',
    name: 'Mentorada',
    description: 'Inscrita na Mentoria Orácula',
    features: [
      'Acesso à Mentoria Orácula',
      'Ferramentas básicas',
      'Biblioteca simbólica inicial',
      'Até 3 Casos',
    ],
    caseLimit: 3,
  },
  {
    type: 'aluna_formacao',
    name: 'Aluna Formação',
    description: 'Matriculada na Formação Orácula',
    features: [
      'Formação completa nos 4 Portais',
      'Ferramentas profissionais',
      'Até 5 Casos',
    ],
    caseLimit: 5,
  },
  {
    type: 'assinante',
    name: 'Assinante',
    description: 'Assinante ativa da Casa ORÁCULA',
    features: [
      'Acesso contínuo à plataforma',
      'Biblioteca simbólica profunda',
      'Casos ilimitados',
      'Atualizações e novos conteúdos',
    ],
    caseLimit: 'unlimited',
  },
  {
    type: 'oracula',
    name: 'Orácula',
    description: 'Combo completo: Formação + Mentoria + Assinatura',
    features: [
      'Acesso total à formação',
      'Mentoria completa',
      'Biblioteca simbólica profunda',
      'Casos ilimitados',
      'Portal de Leitura Oracular',
      'Área de supervisão',
    ],
    caseLimit: 'unlimited',
  },
  {
    type: 'admin',
    name: 'Admin / Guardiã',
    description: 'Guardiã da Casa ORÁCULA',
    features: [
      'Acesso total ao app',
      'Gerenciar usuárias e Portais',
      'Ver Casos autorizados',
      'Responder Leituras Oraculares',
      'Anotações e decisões privadas',
    ],
    caseLimit: 'unlimited',
  },
];

const PORTAL_HIERARCHY: Record<PortalType, number> = {
  visitante: 1,
  mentorada: 2,
  aluna_formacao: 3,
  assinante: 4,
  oracula: 5,
  admin: 6,
};

export const getPortal = (type: PortalType): Portal => {
  return PORTALS.find(p => p.type === type) || PORTALS[0];
};

export const canAccessFeature = (userPortal: PortalType, requiredPortal: PortalType): boolean => {
  return PORTAL_HIERARCHY[userPortal] >= PORTAL_HIERARCHY[requiredPortal];
};

export const getCaseLimit = (portal: PortalType): number | 'unlimited' => {
  const portalData = getPortal(portal);
  return portalData.caseLimit;
};
