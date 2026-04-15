/**
 * Hook — Leitura do perfil comportamental persistido (co_cartografia_profile).
 * Resolve client_user_id a partir do clienteId e busca o profile mais recente
 * com contexto = 'casa_das_maquinas'.
 */
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { ProfileJsonFinal } from '@/lib/cartografia/montarProfileJson';

export interface CartografiaProfileData {
  id: string;
  profileJson: ProfileJsonFinal;
  mediasJson: Record<string, number>;
  oraculaInicial: string | null;
  intensidadeOracular: string | null;
  createdAt: string;
}

export function useCartografiaProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<CartografiaProfileData | null>(null);

  const fetchProfile = useCallback(async (clienteId: string) => {
    if (!user) return null;
    setLoading(true);

    try {
      // 1. Resolve client_user_id from clientes table
      const { data: clienteData } = await supabase
        .from('clientes')
        .select('client_user_id')
        .eq('id', clienteId)
        .eq('terapeuta_id', user.id)
        .maybeSingle();

      const clientUserId = clienteData?.client_user_id;

      // 2. Fetch most recent profile, prioritizing contexto = casa_das_maquinas
      // Try with client_user_id first, fallback to therapist_user_id match
      let query = supabase
        .from('co_cartografia_profile')
        .select('*')
        .eq('therapist_user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (clientUserId) {
        query = supabase
          .from('co_cartografia_profile')
          .select('*')
          .eq('client_user_id', clientUserId)
          .eq('therapist_user_id', user.id)
          .eq('contexto', 'casa_das_maquinas')
          .order('created_at', { ascending: false })
          .limit(1);
      }

      const { data, error } = await query.maybeSingle();

      if (error || !data) {
        // Fallback: try by user_id (therapist) matching the cartografia_psiquica.client_id
        const { data: fallback } = await supabase
          .from('co_cartografia_profile')
          .select('*')
          .eq('user_id', user.id)
          .eq('contexto', 'casa_das_maquinas')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (fallback) {
          const result = mapToProfileData(fallback);
          setProfile(result);
          return result;
        }

        setProfile(null);
        return null;
      }

      const result = mapToProfileData(data);
      setProfile(result);
      return result;
    } catch (err) {
      console.error('Error fetching cartografia profile:', err);
      setProfile(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return { loading, profile, fetchProfile };
}

function mapToProfileData(row: any): CartografiaProfileData {
  return {
    id: row.id,
    profileJson: row.profile_json as ProfileJsonFinal,
    mediasJson: row.medias_json as Record<string, number>,
    oraculaInicial: row.oracula_inicial,
    intensidadeOracular: row.intensidade_oracular,
    createdAt: row.created_at,
  };
}
