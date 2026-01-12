import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

type CopyScope = 'global' | 'travessia' | 'ferramenta' | 'sistema' | 'curso';

interface CopyItem {
  id: string;
  chave: string;
  titulo: string;
  conteudo: string;
  categoria: string;
  scope: CopyScope;
  scope_id: string | null;
  ativo: boolean;
}

interface CopyOptions {
  scope?: CopyScope;
  scopeId?: string;
}

export function useCopy() {
  const [copies, setCopies] = useState<CopyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCopies = async () => {
      const { data } = await supabase
        .from('text_models')
        .select('*')
        .eq('ativo', true);
      
      if (data) {
        setCopies(data as CopyItem[]);
      }
      setIsLoading(false);
    };

    fetchCopies();
  }, []);

  const getCopy = useCallback((key: string, options?: CopyOptions, fallback: string = '') => {
    // First try to find scoped copy
    if (options?.scope && options?.scopeId) {
      const scopedCopy = copies.find(
        c => c.chave === key && c.scope === options.scope && c.scope_id === options.scopeId
      );
      if (scopedCopy) return scopedCopy.conteudo;
    }

    // Then try scope without scopeId
    if (options?.scope) {
      const scopeCopy = copies.find(
        c => c.chave === key && c.scope === options.scope && !c.scope_id
      );
      if (scopeCopy) return scopeCopy.conteudo;
    }

    // Then try global
    const globalCopy = copies.find(c => c.chave === key && c.scope === 'global');
    if (globalCopy) return globalCopy.conteudo;

    // Finally fallback
    return fallback;
  }, [copies]);

  const getCopyByKey = useCallback((key: string, fallback: string = '') => {
    const copy = copies.find(c => c.chave === key);
    return copy?.conteudo || fallback;
  }, [copies]);

  return { copies, getCopy, getCopyByKey, isLoading };
}

// Hook for admin to manage copies
export function useCopyAdmin() {
  const [copies, setCopies] = useState<CopyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCopies = useCallback(async (scope?: CopyScope, scopeId?: string) => {
    setIsLoading(true);
    let query = supabase.from('text_models').select('*').order('categoria').order('titulo');
    
    if (scope) {
      query = query.eq('scope', scope);
    }
    if (scopeId) {
      query = query.eq('scope_id', scopeId);
    }

    const { data } = await query;
    if (data) {
      setCopies(data as CopyItem[]);
    }
    setIsLoading(false);
  }, []);

  const fetchAllCopies = useCallback(async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('text_models')
      .select('*')
      .order('scope')
      .order('categoria')
      .order('titulo');
    
    if (data) {
      setCopies(data as CopyItem[]);
    }
    setIsLoading(false);
  }, []);

  const createCopy = async (copy: Omit<CopyItem, 'id'>) => {
    const { data, error } = await supabase
      .from('text_models')
      .insert(copy)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  };

  const updateCopy = async (id: string, updates: Partial<CopyItem>) => {
    const { data, error } = await supabase
      .from('text_models')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  };

  const toggleActive = async (id: string, ativo: boolean) => {
    return updateCopy(id, { ativo });
  };

  return {
    copies,
    isLoading,
    fetchCopies,
    fetchAllCopies,
    createCopy,
    updateCopy,
    toggleActive,
  };
}
