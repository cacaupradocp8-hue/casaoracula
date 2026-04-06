import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

/** Submit a partilha to canteiro */
export function useSubmitPartilha() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      bed_id: string;
      ciclo_id?: string;
      origem: 'psique' | 'oficio';
      texto: string;
      exibicao_anonima: boolean;
    }) => {
      if (!user?.id) throw new Error('Não autenticado');
      const insertData: Record<string, unknown> = {
        bed_id: payload.bed_id,
        origem: payload.origem,
        texto: payload.texto,
        exibicao_anonima: payload.exibicao_anonima,
        user_id: user.id,
        aprovado_por_admin: false,
      };
      if (payload.ciclo_id) {
        insertData.ciclo_id = payload.ciclo_id;
      }
      const { error } = await supabase
        .from('collective_bed_entries')
        .insert(insertData as any);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Partilha enviada para curadoria.');
      qc.invalidateQueries({ queryKey: ['canteiro-entries'] });
    },
    onError: () => toast.error('Erro ao enviar partilha.'),
  });
}
