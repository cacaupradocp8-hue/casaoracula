// ============================================
// PERSONAL SYMBOLIC MAPS - HOOK
// ============================================
// Private reflective space for therapists
// Strict RLS: only owner can access

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { PersonalSymbolicMap, PersonalMapTemplateKey } from '@/types/personal-map';

export function usePersonalMaps(templateKey?: PersonalMapTemplateKey) {
  const [maps, setMaps] = useState<PersonalSymbolicMap[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchMaps = useCallback(async () => {
    if (!user) {
      setMaps([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      let query = supabase
        .from('personal_symbolic_maps')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (templateKey) {
        query = query.eq('template_key', templateKey);
      }

      const { data, error } = await query;

      if (error) throw error;

      const transformedData = (data || []).map(map => ({
        ...map,
        template_key: map.template_key as PersonalMapTemplateKey,
        content: (map.content as Record<string, string>) || {},
      }));

      setMaps(transformedData);
    } catch (error: any) {
      console.error('Error fetching personal maps:', error);
      toast({
        title: 'Erro ao carregar mapas',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, templateKey, toast]);

  useEffect(() => {
    fetchMaps();
  }, [fetchMaps]);

  const createMap = async (
    template_key: PersonalMapTemplateKey,
    title: string,
    description?: string
  ): Promise<string | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('personal_symbolic_maps')
        .insert({
          user_id: user.id,
          template_key,
          title,
          description: description || null,
          content: {},
          published: false,
        })
        .select('id')
        .single();

      if (error) throw error;

      await fetchMaps();
      return data.id;
    } catch (error: any) {
      console.error('Error creating map:', error);
      toast({
        title: 'Erro ao criar mapa',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateMap = async (
    mapId: string,
    updates: {
      title?: string;
      description?: string;
      content?: Record<string, string>;
    }
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('personal_symbolic_maps')
        .update(updates)
        .eq('id', mapId)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchMaps();
      return true;
    } catch (error: any) {
      console.error('Error updating map:', error);
      toast({
        title: 'Erro ao salvar',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteMap = async (mapId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('personal_symbolic_maps')
        .delete()
        .eq('id', mapId)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchMaps();
      toast({ title: 'Mapa excluído' });
      return true;
    } catch (error: any) {
      console.error('Error deleting map:', error);
      toast({
        title: 'Erro ao excluir',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const getMap = async (mapId: string): Promise<PersonalSymbolicMap | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('personal_symbolic_maps')
        .select('*')
        .eq('id', mapId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      return {
        ...data,
        template_key: data.template_key as PersonalMapTemplateKey,
        content: (data.content as Record<string, string>) || {},
      };
    } catch (error: any) {
      console.error('Error fetching map:', error);
      return null;
    }
  };

  return {
    maps,
    loading,
    createMap,
    updateMap,
    deleteMap,
    getMap,
    refetch: fetchMaps,
  };
}
