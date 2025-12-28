export type PortalLevel = 1 | 2 | 3 | 4;

export interface User {
  id: string;
  email: string;
  name: string;
  portalLevel: PortalLevel;
  createdAt: Date;
  avatarUrl?: string;
}

export interface Portal {
  level: PortalLevel;
  name: string;
  description: string;
  features: string[];
  caseLimit: number | 'unlimited';
}

export const PORTALS: Portal[] = [
  {
    level: 1,
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
    level: 2,
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
    level: 3,
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
    level: 4,
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

export const getPortal = (level: PortalLevel): Portal => {
  return PORTALS.find(p => p.level === level) || PORTALS[0];
};

export const canAccessFeature = (userLevel: PortalLevel, requiredLevel: PortalLevel): boolean => {
  return userLevel >= requiredLevel;
};
