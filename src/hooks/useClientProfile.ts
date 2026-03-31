import { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface PerfilEstrutural {
  arquitetura_psiquica?: string;
  padroes_defesa?: string;
  padrao_relacional?: string;
  arquetipos_predominantes?: string;
  complexos_ativos?: string;
  narrativa_dominante?: string;
}

export interface PerfilDinamico {
  distrito_atual?: string;
  porta_campo_atual?: string;
  sensacao_central?: string;
  estado_sistema?: string;
  movimento_atual?: string;
  nivel_consciencia?: string;
}

export interface PerfilEvolutivo {
  vetor_crescimento?: string;
  travessia_ativa?: string;
  potencia_emergente?: string;
  risco_atual?: string;
  proximo_passo_simbolico?: string;
}

export interface ClientProfile {
  id: string;
  client_id: string;
  therapist_id: string;
  estrutural: PerfilEstrutural;
  dinamico: PerfilDinamico;
  evolutivo: PerfilEvolutivo;
  created_at: string;
  updated_at: string;
}

export function useClientProfile(clientId: string | undefined) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);

  const queryKey = ['co-client-profile', clientId, user?.id];

  const { data: profile, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!clientId || !user) return null;
      const { data, error } = await supabase
        .from('co_client_profile' as any)
        .select('*')
        .eq('client_id', clientId)
        .eq('therapist_id', user.id)
        .maybeSingle();
      if (error) {
        console.error('Error fetching client profile:', error);
        return null;
      }
      return data as unknown as ClientProfile | null;
    },
    enabled: !!clientId && !!user,
  });

  const upsertLayer = useCallback(async (
    layer: 'estrutural' | 'dinamico' | 'evolutivo',
    values: Record<string, string | undefined>
  ) => {
    if (!clientId || !user) return false;
    setSaving(true);
    try {
      const existing = profile;
      const merged = { ...(existing?.[layer] || {}), ...values };

      if (existing) {
        const { error } = await supabase
          .from('co_client_profile' as any)
          .update({ [layer]: merged } as any)
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('co_client_profile' as any)
          .insert({
            client_id: clientId,
            therapist_id: user.id,
            [layer]: merged,
          } as any);
        if (error) throw error;
      }

      queryClient.invalidateQueries({ queryKey });
      return true;
    } catch (err) {
      console.error('Error saving profile layer:', err);
      toast.error('Erro ao salvar perfil');
      return false;
    } finally {
      setSaving(false);
    }
  }, [clientId, user, profile, queryClient, queryKey]);

  const updateDinamicoFromSession = useCallback(async (dynamicData: Partial<PerfilDinamico>) => {
    return upsertLayer('dinamico', dynamicData as Record<string, string>);
  }, [upsertLayer]);

  return {
    profile,
    isLoading,
    saving,
    upsertLayer,
    updateDinamicoFromSession,
    estrutural: (profile?.estrutural || {}) as PerfilEstrutural,
    dinamico: (profile?.dinamico || {}) as PerfilDinamico,
    evolutivo: (profile?.evolutivo || {}) as PerfilEvolutivo,
  };
}
