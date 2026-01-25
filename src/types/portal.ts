// Nova hierarquia: visitante → aluna → oracula → assinante → admin
// Tipos legados mantidos para compatibilidade durante transição
export type PortalType = 'visitante' | 'aluna' | 'oracula' | 'assinante' | 'admin' | 'mentorada' | 'aluna_formacao' | 'pre_iniciada' | 'iniciada';

// Database may still return legacy values - this function normalizes them
export type DatabasePortalType = PortalType;

export const normalizePortalType = (dbPortal: PortalType): PortalType => {
  // Legacy mappings - normalize to new hierarchy
  if (dbPortal === 'pre_iniciada') return 'aluna';
  if (dbPortal === 'mentorada') return 'aluna';
  if (dbPortal === 'aluna_formacao') return 'aluna';
  if (dbPortal === 'iniciada') return 'oracula';
  return dbPortal;
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
// Tipos legados mapeados para os novos níveis
const PORTAL_HIERARCHY: Record<PortalType, number> = {
  visitante: 1,
  aluna: 2,
  mentorada: 2, // legado → aluna
  aluna_formacao: 2, // legado → aluna
  pre_iniciada: 2, // legado → aluna
  oracula: 3,
  iniciada: 3, // legado → oracula
  assinante: 4,
  admin: 5,
};

export const getPortal = (type: PortalType): Portal => {
  // Normalize legacy types before lookup
  const normalizedType = normalizePortalType(type);
  return PORTALS.find(p => p.type === normalizedType) || PORTALS[0];
};

export const canAccessFeature = (userPortal: PortalType, requiredPortal: PortalType): boolean => {
  return PORTAL_HIERARCHY[userPortal] >= PORTAL_HIERARCHY[requiredPortal];
};

export const getCaseLimit = (portal: PortalType): number | 'unlimited' => {
  const portalData = getPortal(portal);
  return portalData.caseLimit;
};
