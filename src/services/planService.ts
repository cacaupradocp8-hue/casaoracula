import { supabase } from '@/integrations/supabase/client';

export type PlanType = 'visitante' | 'fundadora' | 'mentoria' | 'assinatura';

interface ActivatePlanParams {
  userId: string;
  planType: PlanType;
}

/**
 * Ativa um plano para o usuário via funções do banco de dados
 */
export async function activatePlan({ userId, planType }: ActivatePlanParams): Promise<{ success: boolean; error?: string }> {
  try {
    let error;
    
    switch (planType) {
      case 'fundadora':
        ({ error } = await supabase.rpc('activate_fundadora_plan', { user_id_param: userId }));
        break;
      case 'mentoria':
        ({ error } = await supabase.rpc('activate_mentoria_plan', { user_id_param: userId }));
        break;
      case 'assinatura':
        ({ error } = await supabase.rpc('activate_subscription', { user_id_param: userId }));
        break;
      default:
        return { success: false, error: 'Plano inválido' };
    }

    if (error) {
      console.error('Error activating plan:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Error in activatePlan:', err);
    return { success: false, error: 'Erro ao ativar plano' };
  }
}

/**
 * Cancela a assinatura de um usuário
 */
export async function cancelSubscription(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.rpc('cancel_subscription', { user_id_param: userId });

    if (error) {
      console.error('Error canceling subscription:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Error in cancelSubscription:', err);
    return { success: false, error: 'Erro ao cancelar assinatura' };
  }
}

/**
 * Verifica e expira acessos vencidos (para uso em cron jobs ou admin)
 */
export async function checkAndExpireAccess(): Promise<{ success: boolean; expiredCount?: number; error?: string }> {
  try {
    const { data, error } = await supabase.rpc('check_and_expire_access');

    if (error) {
      console.error('Error checking access expiration:', error);
      return { success: false, error: error.message };
    }

    return { success: true, expiredCount: data };
  } catch (err) {
    console.error('Error in checkAndExpireAccess:', err);
    return { success: false, error: 'Erro ao verificar expirações' };
  }
}
