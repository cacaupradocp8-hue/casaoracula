import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface JardimEntry {
  id: string;
  jardim_id: string;
  client_user_id: string;
  therapist_user_id: string;
  created_by: string;
  entry_type: string;
  content: string | null;
  shared_with_therapist: boolean;
  visibility_to_client: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClienteJardim {
  id: string;
  client_user_id: string;
  therapist_user_id: string;
  created_by: string;
  status: string;
  visibility_scope: string;
  created_at: string;
  updated_at: string;
}

export function useClienteJardim() {
  const { user } = useAuth();
  const [jardim, setJardim] = useState<ClienteJardim | null>(null);
  const [entries, setEntries] = useState<JardimEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchJardim = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Get jardim where I'm the client
      const { data: jardimData, error: jardimError } = await supabase
        .from('co_jardins')
        .select('*')
        .eq('client_user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (jardimError) throw jardimError;
      setJardim(jardimData);

      if (jardimData) {
        // Get entries: my own + therapist's visible ones
        const { data: entriesData, error: entriesError } = await supabase
          .from('co_jardim_entries')
          .select('*')
          .eq('jardim_id', jardimData.id)
          .order('created_at', { ascending: false });

        if (entriesError) throw entriesError;

        // Filter: show my entries + therapist entries with visibility_to_client
        const filtered = (entriesData || []).filter(e => 
          e.created_by === user.id || e.visibility_to_client === true
        );
        setEntries(filtered);
      }
    } catch (err) {
      console.error('Erro ao carregar jardim:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchJardim();
  }, [fetchJardim]);

  const criarEntry = async (content: string, entryType: string = 'reflexao', sharedWithTherapist: boolean = false) => {
    if (!user || !jardim) return false;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('co_jardim_entries')
        .insert({
          jardim_id: jardim.id,
          client_user_id: user.id,
          therapist_user_id: jardim.therapist_user_id,
          created_by: user.id,
          entry_type: entryType,
          content,
          shared_with_therapist: sharedWithTherapist,
          visibility_to_client: true,
        });

      if (error) throw error;
      toast.success('🌿 Registro guardado no Jardim');
      await fetchJardim();
      return true;
    } catch (err) {
      console.error('Erro ao criar entry:', err);
      toast.error('Erro ao salvar registro');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const toggleSharedWithTherapist = async (entryId: string, currentValue: boolean) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('co_jardim_entries')
        .update({ shared_with_therapist: !currentValue })
        .eq('id', entryId)
        .eq('created_by', user.id); // only owner can toggle

      if (error) throw error;
      toast.success(!currentValue ? 'Compartilhado com terapeuta' : 'Registro agora é privado');
      await fetchJardim();
    } catch (err) {
      console.error('Erro ao atualizar compartilhamento:', err);
      toast.error('Erro ao atualizar');
    }
  };

  return {
    jardim,
    entries,
    loading,
    saving,
    criarEntry,
    toggleSharedWithTherapist,
    refetch: fetchJardim,
  };
}
