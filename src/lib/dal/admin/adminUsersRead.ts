import { supabase } from "@/integrations/supabase/client";
import { PortalType } from "@/types/portal";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  portal: PortalType;
  createdAt: Date;
  founder_beta?: boolean;
}

export interface AdminUserStats {
  total: number;
  visitante: number;
  aluna: number;
  oracula: number;
  assinante: number;
  admin: number;
}

/**
 * Lista todas as usuárias com seus perfis e portais (roles).
 * Centraliza a leitura para o Admin de Usuárias.
 */
export async function listAdminUsers(): Promise<AdminUser[]> {
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, email, nome, created_at, founder_beta');

  if (profilesError) throw profilesError;

  const { data: roles, error: rolesError } = await supabase
    .from('user_roles')
    .select('user_id, portal');

  if (rolesError) throw rolesError;

  const usersData: AdminUser[] = (profiles || []).map(profile => {
    const role = roles?.find(r => r.user_id === profile.id);
    return {
      id: profile.id,
      name: profile.nome || 'Sem nome',
      email: profile.email || '',
      portal: (role?.portal as PortalType) || 'visitante',
      createdAt: new Date(profile.created_at),
      founder_beta: !!profile.founder_beta
    };
  });

  return usersData;
}

/**
 * Consolida estatísticas de portais a partir da lista de usuárias.
 */
export function getAdminUserStats(users: AdminUser[]): AdminUserStats {
  return {
    total: users.length,
    visitante: users.filter(u => u.portal === 'visitante').length,
    aluna: users.filter(u => ['aluna', 'mentorada', 'aluna_formacao', 'pre_iniciada'].includes(u.portal as string)).length,
    oracula: users.filter(u => ['oracula', 'iniciada'].includes(u.portal as string)).length,
    assinante: users.filter(u => u.portal === 'assinante').length,
    admin: users.filter(u => u.portal === 'admin').length,
  };
}
