// ============================================
// JARDIM DA HEROÍNA - HOOK
// ============================================
// Gerencia os registros do diário simbólico terapêutico

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { 
  JardimHeroinaRegistro, 
  NovoJardimRegistro,
  TipoRegistroJardim 
} from '@/types/jardim-heroina';

interface UseJardimHeroinaOptions {
  sessionCaseId: string;
  tipoFiltro?: TipoRegistroJardim;
}

export function useJardimHeroina({ sessionCaseId, tipoFiltro }: UseJardimHeroinaOptions) {
  const [registros, setRegistros] = useState<JardimHeroinaRegistro[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchRegistros = useCallback(async () => {
    if (!user || !sessionCaseId) {
      setRegistros([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query = (supabase as any)
        .from('jardim_heroina_registros')
        .select('*')
        .eq('session_case_id', sessionCaseId)
        .order('data_registro', { ascending: false });

      if (tipoFiltro) {
        query = query.eq('tipo_registro', tipoFiltro);
      }

      const { data, error } = await query;

      if (error) throw error;
      setRegistros(data || []);
    } catch (error) {
      console.error('Erro ao carregar Jardim da Heroína:', error);
      toast({
        title: 'Erro ao carregar registros',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, sessionCaseId, tipoFiltro, toast]);

  useEffect(() => {
    fetchRegistros();
  }, [fetchRegistros]);

  const criarRegistro = async (registro: NovoJardimRegistro): Promise<string | null> => {
    if (!user) return null;

    setSaving(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('jardim_heroina_registros')
        .insert({
          ...registro,
          therapist_id: user.id,
        })
        .select('id')
        .single();

      if (error) throw error;

      toast({
        title: '🌿 Registro salvo',
        description: 'A memória foi guardada no Jardim.',
      });

      await fetchRegistros();
      return data.id;
    } catch (error) {
      console.error('Erro ao criar registro:', error);
      toast({
        title: 'Erro ao salvar',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
      return null;
    } finally {
      setSaving(false);
    }
  };

  const atualizarRegistro = async (
    registroId: string,
    updates: Partial<NovoJardimRegistro>
  ): Promise<boolean> => {
    if (!user) return false;

    setSaving(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('jardim_heroina_registros')
        .update(updates)
        .eq('id', registroId)
        .eq('therapist_id', user.id);

      if (error) throw error;

      toast({ title: 'Registro atualizado' });
      await fetchRegistros();
      return true;
    } catch (error) {
      console.error('Erro ao atualizar registro:', error);
      toast({
        title: 'Erro ao atualizar',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const excluirRegistro = async (registroId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('jardim_heroina_registros')
        .delete()
        .eq('id', registroId)
        .eq('therapist_id', user.id);

      if (error) throw error;

      toast({ title: 'Registro excluído' });
      await fetchRegistros();
      return true;
    } catch (error) {
      console.error('Erro ao excluir registro:', error);
      toast({
        title: 'Erro ao excluir',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    registros,
    loading,
    saving,
    criarRegistro,
    atualizarRegistro,
    excluirRegistro,
    refetch: fetchRegistros,
  };
}
