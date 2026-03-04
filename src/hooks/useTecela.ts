import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Generic hook for tecela tables
export function useTecelaData<T>(table: string, filters?: Record<string, any>) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    let query = (supabase.from(table as any) as any).select('*').order('created_at', { ascending: false });
    if (filters) {
      Object.entries(filters).forEach(([k, v]) => {
        query = query.eq(k, v);
      });
    }
    const { data: result } = await query;
    setData((result || []) as T[]);
    setIsLoading(false);
  }, [table, JSON.stringify(filters)]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, isLoading, refresh: fetch };
}

export function useTecelaFavoritos() {
  const { user } = useAuth();
  const [favoritos, setFavoritos] = useState<Set<string>>(new Set());

  const fetchFavoritos = useCallback(async () => {
    if (!user) return;
    const { data } = await (supabase.from('tecela_favoritos' as any) as any)
      .select('ref_type, ref_id')
      .eq('user_id', user.id);
    if (data) {
      setFavoritos(new Set(data.map((f: any) => `${f.ref_type}:${f.ref_id}`)));
    }
  }, [user]);

  useEffect(() => { fetchFavoritos(); }, [fetchFavoritos]);

  const toggleFavorito = async (refType: string, refId: string) => {
    if (!user) return;
    const key = `${refType}:${refId}`;
    if (favoritos.has(key)) {
      await (supabase.from('tecela_favoritos' as any) as any)
        .delete()
        .eq('ref_type', refType)
        .eq('ref_id', refId)
        .eq('user_id', user.id);
      setFavoritos(prev => { const n = new Set(prev); n.delete(key); return n; });
    } else {
      await (supabase.from('tecela_favoritos' as any) as any)
        .insert({ ref_type: refType, ref_id: refId, user_id: user.id });
      setFavoritos(prev => new Set(prev).add(key));
    }
  };

  const isFavorito = (refType: string, refId: string) => favoritos.has(`${refType}:${refId}`);

  return { toggleFavorito, isFavorito, refresh: fetchFavoritos };
}

export function useTecelaComentarios(refType: string, refId: string) {
  const { user } = useAuth();
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    const { data } = await (supabase.from('tecela_comentarios' as any) as any)
      .select('*, profiles:autor_id(nome, avatar_url)')
      .eq('ref_type', refType)
      .eq('ref_id', refId)
      .order('created_at', { ascending: true });
    setComentarios(data || []);
    setIsLoading(false);
  }, [refType, refId]);

  useEffect(() => { fetch(); }, [fetch]);

  const addComentario = async (conteudo: string) => {
    if (!user || !conteudo.trim()) return;
    await (supabase.from('tecela_comentarios' as any) as any)
      .insert({ ref_type: refType, ref_id: refId, conteudo: conteudo.trim(), autor_id: user.id });
    fetch();
  };

  return { comentarios, isLoading, addComentario, refresh: fetch };
}
