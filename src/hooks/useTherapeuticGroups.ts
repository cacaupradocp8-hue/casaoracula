import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface TherapeuticGroup {
  id: string;
  therapist_id: string;
  nome: string;
  descricao: string | null;
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
  participants_count?: number;
}

export interface GroupParticipant {
  id: string;
  group_id: string;
  cliente_id: string;
  joined_at: string;
  ativo: boolean;
  cliente?: {
    id: string;
    nome: string;
  };
}

export interface GroupSession {
  id: string;
  group_id: string;
  therapist_id: string;
  title: string;
  notes: string | null;
  status: 'draft' | 'active' | 'archived';
  created_at: string;
  updated_at: string;
}

export function useTherapeuticGroups() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const fetchGroups = async (status: 'active' | 'archived' = 'active'): Promise<TherapeuticGroup[]> => {
    if (!user?.id) return [];
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('therapeutic_groups')
        .select('*')
        .eq('therapist_id', user.id)
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch participant counts
      const groupsWithCounts = await Promise.all(
        (data || []).map(async (group) => {
          const { count } = await supabase
            .from('group_participants')
            .select('*', { count: 'exact', head: true })
            .eq('group_id', group.id)
            .eq('ativo', true);
          
          return { ...group, participants_count: count || 0 };
        })
      );

      return groupsWithCounts as TherapeuticGroup[];
    } catch (error) {
      console.error('Error fetching groups:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (nome: string, descricao?: string): Promise<TherapeuticGroup | null> => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('therapeutic_groups')
        .insert({
          therapist_id: user.id,
          nome,
          descricao: descricao || null,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Grupo criado',
        description: `O grupo "${nome}" foi criado com sucesso.`,
      });

      return data as TherapeuticGroup;
    } catch (error) {
      console.error('Error creating group:', error);
      toast({
        title: 'Erro ao criar grupo',
        description: 'Não foi possível criar o grupo.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateGroupStatus = async (groupId: string, status: 'active' | 'archived'): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('therapeutic_groups')
        .update({ status })
        .eq('id', groupId);

      if (error) throw error;

      toast({
        title: status === 'archived' ? 'Grupo arquivado' : 'Grupo reativado',
      });

      return true;
    } catch (error) {
      console.error('Error updating group status:', error);
      return false;
    }
  };

  const fetchGroupParticipants = async (groupId: string): Promise<GroupParticipant[]> => {
    try {
      const { data, error } = await supabase
        .from('group_participants')
        .select(`
          *,
          cliente:clientes!group_participants_cliente_id_fkey(id, nome)
        `)
        .eq('group_id', groupId)
        .eq('ativo', true);

      if (error) throw error;
      return data as GroupParticipant[];
    } catch (error) {
      console.error('Error fetching participants:', error);
      return [];
    }
  };

  const addParticipant = async (groupId: string, clienteId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('group_participants')
        .insert({
          group_id: groupId,
          cliente_id: clienteId,
        });

      if (error) throw error;

      toast({ title: 'Participante adicionada ao grupo' });
      return true;
    } catch (error: any) {
      console.error('Error adding participant:', error);
      if (error.code === '23505') {
        toast({
          title: 'Participante já está no grupo',
          variant: 'destructive',
        });
      }
      return false;
    }
  };

  const removeParticipant = async (groupId: string, clienteId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('group_participants')
        .update({ ativo: false })
        .eq('group_id', groupId)
        .eq('cliente_id', clienteId);

      if (error) throw error;

      toast({ title: 'Participante removida do grupo' });
      return true;
    } catch (error) {
      console.error('Error removing participant:', error);
      return false;
    }
  };

  const fetchGroupSessions = async (groupId: string): Promise<GroupSession[]> => {
    try {
      const { data, error } = await supabase
        .from('group_sessions')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as GroupSession[];
    } catch (error) {
      console.error('Error fetching group sessions:', error);
      return [];
    }
  };

  const createGroupSession = async (groupId: string, title: string): Promise<GroupSession | null> => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('group_sessions')
        .insert({
          group_id: groupId,
          therapist_id: user.id,
          title,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Sessão de grupo criada',
      });

      return data as GroupSession;
    } catch (error) {
      console.error('Error creating group session:', error);
      return null;
    }
  };

  const fetchGroupById = async (groupId: string): Promise<TherapeuticGroup | null> => {
    try {
      const { data, error } = await supabase
        .from('therapeutic_groups')
        .select('*')
        .eq('id', groupId)
        .single();

      if (error) throw error;
      return data as TherapeuticGroup;
    } catch (error) {
      console.error('Error fetching group:', error);
      return null;
    }
  };

  return {
    loading,
    fetchGroups,
    createGroup,
    updateGroupStatus,
    fetchGroupParticipants,
    addParticipant,
    removeParticipant,
    fetchGroupSessions,
    createGroupSession,
    fetchGroupById,
  };
}
