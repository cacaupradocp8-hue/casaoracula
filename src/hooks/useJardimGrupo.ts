import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { JardimGrupoRegistro, NovoJardimGrupoRegistro, ClimaMovimento } from '@/types/jardim-grupo';

export function useJardimGrupo() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const fetchRegistros = async (groupId: string): Promise<JardimGrupoRegistro[]> => {
    if (!groupId) return [];
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('jardim_grupo_registros')
        .select('*')
        .eq('group_id', groupId)
        .order('data_registro', { ascending: false });

      if (error) throw error;
      
      return (data || []).map(item => ({
        ...item,
        clima_movimento: item.clima_movimento as ClimaMovimento | null,
      })) as JardimGrupoRegistro[];
    } catch (error) {
      console.error('Erro ao buscar registros do jardim do grupo:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createRegistro = async (registro: NovoJardimGrupoRegistro): Promise<JardimGrupoRegistro | null> => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('jardim_grupo_registros')
        .insert({
          ...registro,
          therapist_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Registro salvo',
        description: 'O registro do jardim do grupo foi salvo com sucesso.',
      });

      return {
        ...data,
        clima_movimento: data.clima_movimento as ClimaMovimento | null,
      } as JardimGrupoRegistro;
    } catch (error) {
      console.error('Erro ao criar registro:', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar o registro.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateRegistro = async (
    id: string,
    updates: Partial<NovoJardimGrupoRegistro>
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('jardim_grupo_registros')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Registro atualizado',
      });

      return true;
    } catch (error) {
      console.error('Erro ao atualizar registro:', error);
      toast({
        title: 'Erro ao atualizar',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteRegistro = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('jardim_grupo_registros')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Registro removido',
      });

      return true;
    } catch (error) {
      console.error('Erro ao remover registro:', error);
      return false;
    }
  };

  return {
    loading,
    fetchRegistros,
    createRegistro,
    updateRegistro,
    deleteRegistro,
  };
}
