import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Progresso da aluna numa rota + flag admin.
 * - concluidas: Set<estacao_id> a partir de clube_conclusao_estacoes (fechamento_concluido = true)
 * - isAdmin: derivado de user_roles.portal = 'admin'
 */
export function useRotaProgresso(rotaId?: string) {
  return useQuery({
    queryKey: ['rota-progresso', rotaId],
    enabled: !!rotaId,
    queryFn: async () => {
      const client = supabase as any;
      const { data: auth } = await client.auth.getUser();
      const userId = auth?.user?.id as string | undefined;

      if (!userId) {
        return { concluidas: new Set<string>(), isAdmin: false };
      }

      const [rolesRes, conclusoesRes] = await Promise.all([
        client.from('user_roles').select('portal').eq('user_id', userId),
        client
          .from('clube_conclusao_estacoes')
          .select('estacao_id, fechamento_concluido')
          .eq('user_id', userId)
          .eq('rota_id', rotaId),
      ]);

      const isAdmin = (rolesRes.data || []).some((r: any) => r.portal === 'admin');
      const concluidas = new Set<string>(
        (conclusoesRes.data || [])
          .filter((c: any) => c.fechamento_concluido)
          .map((c: any) => c.estacao_id as string)
      );

      return { concluidas, isAdmin };
    },
  });
}
