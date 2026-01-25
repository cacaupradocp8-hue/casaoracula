// Nova hierarquia: visitante → aluna → oracula → assinante → admin
export type PortalType = 'visitante' | 'aluna' | 'oracula' | 'assinante' | 'admin';

// Database may still return legacy values - this function normalizes them
export type DatabasePortalType = PortalType | 'pre_iniciada' | 'iniciada' | 'mentorada' | 'aluna_formacao';

export const normalizePortalType = (dbPortal: DatabasePortalType): PortalType => {
  // Legacy mappings
  if (dbPortal === 'pre_iniciada') return 'aluna';
  if (dbPortal === 'mentorada') return 'aluna';
  if (dbPortal === 'aluna_formacao') return 'aluna';
  if (dbPortal === 'iniciada') return 'oracula';
  return dbPortal as PortalType;
};

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
      'Travessia Zero',
      'Conteúdos simbólicos de degustação',
      'Perguntas-oráculo',
    ],
    caseLimit: 0,
  },
  {
    type: 'aluna',
    name: 'Aluna',
    description: 'Matriculada na Formação Orácula',
    features: [
      'Acesso às Travessias',
      'Ferramentas práticas',
      'Biblioteca simbólica',
      'Até 5 Casos',
    ],
    caseLimit: 5,
  },
  {
    type: 'oracula',
    name: 'Orácula',
    description: 'Formada e certificada',
    features: [
      'Formação completa',
      'Ferramentas do Método',
      'Portal de Leitura Oracular',
      'Casos ilimitados',
    ],
    caseLimit: 'unlimited',
  },
  {
    type: 'assinante',
    name: 'Assinante',
    description: 'Acesso contínuo à Casa ORÁCULA',
    features: [
      'Acesso contínuo pós-formação',
      'Biblioteca simbólica profunda',
      'Casos ilimitados',
      'Atualizações e novos conteúdos',
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

// Nova hierarquia: visitante(1) → aluna(2) → oracula(3) → assinante(4) → admin(5)
const PORTAL_HIERARCHY: Record<PortalType, number> = {
  visitante: 1,
  aluna: 2,
  oracula: 3,
  assinante: 4,
  admin: 5,
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
