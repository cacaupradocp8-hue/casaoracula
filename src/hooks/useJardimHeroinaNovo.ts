// ============================================
// JARDIM DA HEROÍNA - HOOK (Integration Space)
// ============================================
// Manages the temporary integration Jardim between sessions

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { 
  JardimHeroinaNovo, 
  NovoJardimHeroina, 
  AtualizarJardimHeroina,
  JardimHeroinaStatus 
} from '@/types/jardim-heroina-novo';

interface UseJardimHeroinaNovoProps {
  caseId: string;
  clientId: string;
}

export function useJardimHeroinaNovo({ caseId, clientId }: UseJardimHeroinaNovoProps) {
  const { user } = useAuth();
  const [jardim, setJardim] = useState<JardimHeroinaNovo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch Jardim for the case
  const fetchJardim = useCallback(async () => {
    if (!caseId) return null;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('jardim_heroina')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      
      setJardim(data as JardimHeroinaNovo | null);
      return data as JardimHeroinaNovo | null;
    } catch (error) {
      console.error('Error fetching Jardim:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [caseId]);

  // Check if client has an active Jardim (across all cases)
  const checkActiveJardim = useCallback(async (): Promise<boolean> => {
    if (!clientId) return false;
    
    try {
      const { data, error } = await supabase
        .from('jardim_heroina')
        .select('id')
        .eq('client_id', clientId)
        .eq('status', 'active')
        .limit(1);

      if (error) throw error;
      return (data?.length || 0) > 0;
    } catch (error) {
      console.error('Error checking active Jardim:', error);
      return false;
    }
  }, [clientId]);

  // Activate a new Jardim (THERAPIST ONLY)
  const ativarJardim = useCallback(async (): Promise<JardimHeroinaNovo | null> => {
    if (!user || !caseId || !clientId) {
      toast.error('Dados incompletos para ativar o Jardim');
      return null;
    }

    // Check if client already has an active Jardim
    const hasActive = await checkActiveJardim();
    if (hasActive) {
      toast.error('Esta cliente já possui um Jardim ativo. Feche-o antes de criar outro.');
      return null;
    }

    setSaving(true);
    try {
      const novoJardim: NovoJardimHeroina & { status: JardimHeroinaStatus; ativado_em: string } = {
        case_id: caseId,
        therapist_id: user.id,
        client_id: clientId,
        status: 'active',
        ativado_em: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('jardim_heroina')
        .insert(novoJardim)
        .select()
        .single();

      if (error) throw error;

      const created = data as JardimHeroinaNovo;
      setJardim(created);
      toast.success('Jardim da Heroína ativado ✨');
      return created;
    } catch (error: any) {
      console.error('Error creating Jardim:', error);
      if (error.code === '23505') {
        toast.error('Esta cliente já possui um Jardim ativo');
      } else {
        toast.error('Erro ao ativar o Jardim');
      }
      return null;
    } finally {
      setSaving(false);
    }
  }, [user, caseId, clientId, checkActiveJardim]);

  // Update Jardim fields
  const atualizarJardim = useCallback(async (
    updates: AtualizarJardimHeroina
  ): Promise<boolean> => {
    if (!jardim?.id) {
      toast.error('Jardim não encontrado');
      return false;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('jardim_heroina')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', jardim.id)
        .select()
        .single();

      if (error) throw error;

      setJardim(data as JardimHeroinaNovo);
      toast.success('Jardim atualizado');
      return true;
    } catch (error) {
      console.error('Error updating Jardim:', error);
      toast.error('Erro ao atualizar o Jardim');
      return false;
    } finally {
      setSaving(false);
    }
  }, [jardim?.id]);

  // Close Jardim (THERAPIST ONLY)
  const fecharJardim = useCallback(async (): Promise<boolean> => {
    if (!jardim?.id) {
      toast.error('Jardim não encontrado');
      return false;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('jardim_heroina')
        .update({
          status: 'closed' as JardimHeroinaStatus,
          fechado_em: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', jardim.id)
        .select()
        .single();

      if (error) throw error;

      setJardim(data as JardimHeroinaNovo);
      toast.success('Jardim fechado. O conteúdo está preservado para referência.');
      return true;
    } catch (error) {
      console.error('Error closing Jardim:', error);
      toast.error('Erro ao fechar o Jardim');
      return false;
    } finally {
      setSaving(false);
    }
  }, [jardim?.id]);

  // Fetch closed/inactive Jardins for history
  const fetchHistorico = useCallback(async (): Promise<JardimHeroinaNovo[]> => {
    if (!caseId) return [];
    
    try {
      const { data, error } = await supabase
        .from('jardim_heroina')
        .select('*')
        .eq('case_id', caseId)
        .in('status', ['closed', 'inactive'])
        .order('fechado_em', { ascending: false });

      if (error) throw error;
      return (data || []) as JardimHeroinaNovo[];
    } catch (error) {
      console.error('Error fetching Jardim history:', error);
      return [];
    }
  }, [caseId]);

  return {
    jardim,
    loading,
    saving,
    fetchJardim,
    ativarJardim,
    atualizarJardim,
    fecharJardim,
    fetchHistorico,
    checkActiveJardim,
  };
}
