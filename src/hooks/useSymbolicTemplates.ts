import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

export type TemplateType = 'big5' | 'enneagram' | 'tarot' | 'constellation';

export interface SymbolicTemplateSession {
  id: string;
  user_id: string;
  template_type: TemplateType;
  title: string;
  cliente_id: string | null;
  sections: Record<string, string>;
  notes: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export function useSymbolicTemplates(templateType?: TemplateType) {
  const [sessions, setSessions] = useState<SymbolicTemplateSession[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchSessions = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      let query = supabase
        .from('symbolic_template_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (templateType) {
        query = query.eq('template_type', templateType);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform JSONB to typed objects
      const transformedData = (data || []).map(session => ({
        ...session,
        template_type: session.template_type as TemplateType,
        sections: (session.sections as Record<string, string>) || {},
        notes: (session.notes as Record<string, string>) || {},
      }));

      setSessions(transformedData);
    } catch (error: any) {
      console.error('Error fetching template sessions:', error);
      toast({
        title: 'Erro ao carregar sessões',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, templateType, toast]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const createSession = async (
    type: TemplateType,
    title: string,
    clienteId?: string
  ): Promise<string | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('symbolic_template_sessions')
        .insert({
          user_id: user.id,
          template_type: type,
          title,
          cliente_id: clienteId || null,
          sections: {},
          notes: {},
        })
        .select('id')
        .single();

      if (error) throw error;

      await fetchSessions();
      return data.id;
    } catch (error: any) {
      console.error('Error creating session:', error);
      toast({
        title: 'Erro ao criar sessão',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateSession = async (
    sessionId: string,
    updates: {
      title?: string;
      sections?: Record<string, string>;
      notes?: Record<string, string>;
    }
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      const updateData: Record<string, Json | string> = {};
      if (updates.title) updateData.title = updates.title;
      if (updates.sections) updateData.sections = updates.sections as Json;
      if (updates.notes) updateData.notes = updates.notes as Json;

      const { error } = await supabase
        .from('symbolic_template_sessions')
        .update(updateData)
        .eq('id', sessionId)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchSessions();
      return true;
    } catch (error: any) {
      console.error('Error updating session:', error);
      toast({
        title: 'Erro ao salvar',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteSession = async (sessionId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('symbolic_template_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchSessions();
      toast({
        title: 'Sessão excluída',
      });
      return true;
    } catch (error: any) {
      console.error('Error deleting session:', error);
      toast({
        title: 'Erro ao excluir',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const getSession = async (sessionId: string): Promise<SymbolicTemplateSession | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('symbolic_template_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      return {
        ...data,
        template_type: data.template_type as TemplateType,
        sections: (data.sections as Record<string, string>) || {},
        notes: (data.notes as Record<string, string>) || {},
      };
    } catch (error: any) {
      console.error('Error fetching session:', error);
      return null;
    }
  };

  return {
    sessions,
    loading,
    createSession,
    updateSession,
    deleteSession,
    getSession,
    refetch: fetchSessions,
  };
}
