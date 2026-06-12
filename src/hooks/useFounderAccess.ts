import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface FounderAccessInfo {
  isActive: boolean;
  dataExpira: Date | null;
  codigoUtilizado: string | null;
}

export function useFounderAccess() {
  const { user } = useAuth();
  const [access, setAccess] = useState<FounderAccessInfo>({
    isActive: false,
    dataExpira: null,
    codigoUtilizado: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchFounderAccess = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('acessos_fundadora')
        .select('data_expiracao, codigo_utilizado, status')
        .eq('user_id', user.id)
        .eq('status', 'ativo')
        .gt('data_expiracao', new Date().toISOString())
        .order('data_expiracao', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setAccess({
          isActive: true,
          dataExpira: new Date(data.data_expiracao),
          codigoUtilizado: data.codigo_utilizado,
        });
      } else {
        setAccess({ isActive: false, dataExpira: null, codigoUtilizado: null });
      }
    } catch (err) {
      console.error('Erro ao buscar acesso de fundadora:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFounderAccess();
  }, [fetchFounderAccess]);

  const validateAndActivateInvite = async (codigo: string) => {
    if (!user) return { success: false, error: 'Usuário não autenticado.' };

    try {
      // Usando rpc para chamar a função postgres criada na migração
      const { data, error } = await supabase.rpc('validar_e_ativar_convite', {
        p_user_id: user.id,
        p_codigo: codigo.trim().toUpperCase()
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string; data_expiracao?: string };

      if (result.success) {
        toast.success('Convite ativado com sucesso! Bem-vinda à Rota dos Lobos.');
        await fetchFounderAccess();
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      console.error('Erro ao ativar convite:', err);
      return { success: false, error: 'Ocorreu um erro ao validar seu código.' };
    }
  };

  return {
    ...access,
    isLoading,
    validateAndActivateInvite,
    refreshAccess: fetchFounderAccess
  };
}
