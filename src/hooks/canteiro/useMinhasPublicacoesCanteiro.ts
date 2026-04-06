import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { trackLearningEvent } from '@/services/studentTrackingService';
import type { PublicacaoCanteiro } from './types';

export type { PublicacaoCanteiro };

export function useMinhasPublicacoesCanteiro() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['minhas-publicacoes-canteiro', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('collective_bed_entries')
        .select('id, texto, origem, aprovado_por_admin, publicado_em, rejeitado, exibicao_anonima, created_at, source_entry_id, entry_type, published_title')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as PublicacaoCanteiro[];
    },
    enabled: !!user?.id,
  });
}

export function useRevogarPublicacao() {
  const qc = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('collective_bed_entries')
        .delete()
        .eq('id', id);
      if (error) throw error;

      trackLearningEvent({
        userId: user?.id,
        contextArea: 'jardim-da-psique',
        actionType: 'revoked_canteiro',
        objectType: 'registro_jardim',
        objectId: id,
      });
    },
    onSuccess: () => {
      toast.success('Publicação removida do Canteiro.');
      qc.invalidateQueries({ queryKey: ['minhas-publicacoes-canteiro'] });
      qc.invalidateQueries({ queryKey: ['canteiro-entries'] });
    },
    onError: () => toast.error('Erro ao remover publicação.'),
  });
}
