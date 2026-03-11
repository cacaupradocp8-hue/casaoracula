// ============================================
// DIÁRIO DE BORDO - HOOK
// ============================================
// Hook para gerenciar anotações pessoais por aula
// Auto-save com debounce, 100% privado (RLS)

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface DiarioBordoState {
  conteudo: string;
  loading: boolean;
  saving: boolean;
  lastSaved: Date | null;
  error: string | null;
}

export function useDiarioBordo(aulaId: string | undefined) {
  const { user } = useAuth();
  const [state, setState] = useState<DiarioBordoState>({
    conteudo: '',
    loading: true,
    saving: false,
    lastSaved: null,
    error: null,
  });
  
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedContentRef = useRef<string>('');

  // Carregar nota existente
  useEffect(() => {
    if (!aulaId || !user) {
      setState(prev => ({ ...prev, loading: false, conteudo: '' }));
      return;
    }

    const fetchNota = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
          .from('diario_bordo_aulas')
          .select('conteudo, updated_at')
          .eq('user_id', user.id)
          .eq('aula_id', aulaId)
          .maybeSingle();

        if (error) throw error;

        const conteudo = data?.conteudo || '';
        lastSavedContentRef.current = conteudo;
        
        setState({
          conteudo,
          loading: false,
          saving: false,
          lastSaved: data?.updated_at ? new Date(data.updated_at) : null,
          error: null,
        });
      } catch (error) {
        console.error('Erro ao carregar diário:', error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Erro ao carregar anotações',
        }));
      }
    };

    fetchNota();
  }, [aulaId, user?.id]);

  // Função de save
  const saveNota = useCallback(async (texto: string) => {
    if (!aulaId || !user) return;
    
    // Não salvar se o conteúdo não mudou
    if (texto === lastSavedContentRef.current) return;

    setState(prev => ({ ...prev, saving: true, error: null }));

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('diario_bordo_aulas')
        .upsert({
          user_id: user.id,
          aula_id: aulaId,
          conteudo: texto,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,aula_id',
        });

      if (error) throw error;

      lastSavedContentRef.current = texto;
      setState(prev => ({
        ...prev,
        saving: false,
        lastSaved: new Date(),
      }));
    } catch (error) {
      console.error('Erro ao salvar diário:', error);
      setState(prev => ({
        ...prev,
        saving: false,
        error: 'Erro ao salvar',
      }));
    }
  }, [aulaId, user?.id]);

  // Atualizar conteúdo com debounce
  const setConteudo = useCallback((texto: string) => {
    setState(prev => ({ ...prev, conteudo: texto }));

    // Cancelar debounce anterior
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Agendar save após 2 segundos
    debounceRef.current = setTimeout(() => {
      saveNota(texto);
    }, 2000);
  }, [saveNota]);

  // Salvar imediatamente (para quando o usuário sai do campo)
  const saveImediato = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    saveNota(state.conteudo);
  }, [saveNota, state.conteudo]);

  // Cleanup do debounce
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    conteudo: state.conteudo,
    setConteudo,
    loading: state.loading,
    saving: state.saving,
    lastSaved: state.lastSaved,
    error: state.error,
    saveImediato,
  };
}
