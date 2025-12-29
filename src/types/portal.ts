export type PortalType = 'visitante' | 'pre_iniciada' | 'iniciada' | 'admin';

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
    name: 'Visitante / Buscadora',
    description: 'Acesso inicial à Casa ORÁCULA',
    features: [
      'Conteúdos simbólicos curtos',
      'Perguntas-oráculo',
      'Exploração da tese central',
    ],
    caseLimit: 0,
  },
  {
    type: 'pre_iniciada',
    name: 'Pré-Iniciada',
    description: 'Início da jornada formativa',
    features: [
      'Leitura Simbólica em 5 Camadas',
      'Radar de Eixo',
      'Trilha de Neuroplasticidade',
      'Biblioteca simbólica inicial',
      'Até 3 Casos',
    ],
    caseLimit: 3,
  },
  {
    type: 'iniciada',
    name: 'Iniciada ORÁCULA',
    description: 'Formação completa nas 4 Travessias',
    features: [
      'Formação completa',
      'Biblioteca simbólica profunda',
      'Casos ilimitados',
      'Área de mentoria/supervisão',
      'Portal de Leitura Oracular',
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
  pre_iniciada: 2,
  iniciada: 3,
  admin: 4,
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
