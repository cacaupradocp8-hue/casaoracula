import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEffectivePortal } from '@/hooks/useEffectivePortal';

export type NivelRisco = 'baixo' | 'medio' | 'alto';
export type TipoUso = 'estudo' | 'clinico_autorizado';

export interface ContoClinicoMetadata {
  id: string;
  slug: string;
  titulo: string;
  texto_conto: string;
  quando_usar: string;
  o_que_observar: string;
  riscos_uso_inadequado: string;
  origem_cultural: string | null;
  porta_psiquica: string | null;
  eixo_simbolico: string | null;
  nivel_risco: NivelRisco;
  tipo_uso: TipoUso;
  exige_certificacao: boolean;
  permite_grupo: boolean;
  permite_crise_aguda: boolean;
  restricoes_combinacao: string[];
  exige_cartografia: boolean;
  audio_padrao_disponivel: boolean;
  audio_padrao_id: string | null;
  aviso_etico: string | null;
  ordem: number;
  ativo: boolean;
}

interface CertificationStatus {
  isActive: boolean;
  expiresAt: string | null;
}

interface AccessResult {
  hasAccess: boolean;
  reason?: string;
  requiresWarning: boolean;
  requiresCartografia: boolean;
  blockReason?: 'no_certification' | 'certification_expired' | 'restricted_combination';
}

/**
 * Hook to check user's certification status for Narroterapia
 */
export function useCertificationStatus() {
  const { user } = useAuth();
  const { effectivePortal, isAdmin } = useEffectivePortal();

  // Admin always has active certification
  if (isAdmin) {
    return {
      isActive: true,
      expiresAt: null,
      isLoading: false,
    };
  }

  // Check if user has oracula or higher portal (certified professionals)
  const certifiedPortals = ['oracula', 'admin'];
  const isActive = certifiedPortals.includes(effectivePortal);

  // For production, this would query actual certification records
  // For now, portal-based logic
  return {
    isActive,
    expiresAt: null,
    isLoading: false,
  };
}

/**
 * Hook to check if a clinical tale can be accessed by the current user
 */
export function useContoClinicoAccess(conto: ContoClinicoMetadata | null) {
  const { isActive: hasCertification } = useCertificationStatus();
  const { isAdmin } = useEffectivePortal();

  if (!conto) {
    return {
      hasAccess: false,
      reason: 'Conto não encontrado',
      requiresWarning: false,
      requiresCartografia: false,
    } as AccessResult;
  }

  // Admin bypass - full access
  if (isAdmin) {
    return {
      hasAccess: true,
      requiresWarning: conto.nivel_risco === 'alto',
      requiresCartografia: conto.exige_cartografia,
    } as AccessResult;
  }

  // Rule 1: High risk tales require active certification
  if (conto.nivel_risco === 'alto' && !hasCertification) {
    return {
      hasAccess: false,
      reason: 'Este conto de alto risco exige certificação ativa em Narroterapia Oracular™',
      requiresWarning: true,
      requiresCartografia: true,
      blockReason: 'no_certification',
    } as AccessResult;
  }

  // Rule 2: Tales requiring certification
  if (conto.exige_certificacao && !hasCertification) {
    return {
      hasAccess: false,
      reason: 'Este conto exige certificação ativa em Narroterapia Oracular™',
      requiresWarning: false,
      requiresCartografia: false,
      blockReason: 'no_certification',
    } as AccessResult;
  }

  // Rule 3: Clinical authorized use requires certification
  if (conto.tipo_uso === 'clinico_autorizado' && !hasCertification) {
    return {
      hasAccess: false,
      reason: 'Uso clínico autorizado apenas para profissionais certificadas',
      requiresWarning: false,
      requiresCartografia: false,
      blockReason: 'no_certification',
    } as AccessResult;
  }

  return {
    hasAccess: true,
    requiresWarning: conto.nivel_risco === 'alto',
    requiresCartografia: conto.exige_cartografia || conto.nivel_risco === 'alto',
  } as AccessResult;
}

/**
 * Hook to check combination restrictions between clinical tales
 */
export function useContosCombinationCheck(contoIds: string[]) {
  const { data: contos } = useQuery({
    queryKey: ['contos-combinacao', contoIds],
    queryFn: async () => {
      if (contoIds.length < 2) return [];
      
      const { data, error } = await supabase
        .from('contos_clinicos')
        .select('id, porta_psiquica, restricoes_combinacao')
        .in('id', contoIds);
      
      if (error) throw error;
      return data;
    },
    enabled: contoIds.length >= 2,
  });

  if (!contos || contos.length < 2) {
    return { hasConflict: false, conflictDetails: null };
  }

  // Check each tale's restrictions against others
  for (const conto of contos) {
    const restrictions = conto.restricoes_combinacao || [];
    for (const otherConto of contos) {
      if (conto.id !== otherConto.id && 
          otherConto.porta_psiquica && 
          restrictions.includes(otherConto.porta_psiquica)) {
        return {
          hasConflict: true,
          conflictDetails: {
            restrictedBy: conto.id,
            blockedPorta: otherConto.porta_psiquica,
            message: `Combinação restrita: ${conto.porta_psiquica || 'este conto'} não pode ser usado junto com ${otherConto.porta_psiquica}`,
          },
        };
      }
    }
  }

  return { hasConflict: false, conflictDetails: null };
}

/**
 * Get risk level badge styling
 */
export function getRiskLevelStyle(nivel: NivelRisco) {
  switch (nivel) {
    case 'alto':
      return {
        variant: 'destructive' as const,
        className: 'bg-destructive/10 text-destructive border-destructive/50',
        label: 'Alto Risco',
      };
    case 'medio':
      return {
        variant: 'outline' as const,
        className: 'bg-amber-500/10 text-amber-500 border-amber-500/50',
        label: 'Risco Médio',
      };
    case 'baixo':
    default:
      return {
        variant: 'outline' as const,
        className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/50',
        label: 'Baixo Risco',
      };
  }
}
