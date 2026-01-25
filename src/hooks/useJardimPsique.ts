// ============================================
// JARDIM DA PSIQUE - HOOK
// ============================================
// Espaço 100% privado para registros pessoais
// Nenhum admin ou terapeuta tem acesso

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export type TipoRegistroJardim = 
  | 'ferramenta' 
  | 'sonho' 
  | 'frase' 
  | 'fragmento' 
  | 'oraculo' 
  | 'reflexao';

export interface JardimRegistro {
  id: string;
  user_id: string;
  ferramenta_nome: string;
  ferramenta_chave: string;
  data_aplicacao: string;
  conteudo: Record<string, unknown>;
  resultado_simbolico: Record<string, unknown> | null;
  reflexao_pessoal: string | null;
  tags: string[];
  arquivado: boolean;
  integrado: boolean;
  created_at: string;
  updated_at: string;
  // New fields for symbolic diary
  tipo_registro: TipoRegistroJardim;
  titulo: string | null;
  fonte: string | null;
  emocao_predominante: string | null;
}

export interface NovoRegistroJardim {
  ferramenta_nome: string;
  ferramenta_chave: string;
  conteudo: Record<string, unknown>;
  resultado_simbolico?: Record<string, unknown>;
  reflexao_pessoal?: string;
  tags?: string[];
  // New fields for symbolic diary
  tipo_registro?: TipoRegistroJardim;
  titulo?: string;
  fonte?: string;
  emocao_predominante?: string;
}

interface FiltrosJardim {
  ferramenta_chave?: string;
  arquivado?: boolean;
  busca?: string;
  tipo_registro?: TipoRegistroJardim;
}

export function useJardimPsique(filtros?: FiltrosJardim) {
  const [registros, setRegistros] = useState<JardimRegistro[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchRegistros = useCallback(async () => {
    if (!user) {
      setRegistros([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query = (supabase as any)
        .from('jardim_psique_registros')
        .select('*')
        .eq('user_id', user.id)
        .order('data_aplicacao', { ascending: false });

      // Aplicar filtros
      if (filtros?.ferramenta_chave) {
        query = query.eq('ferramenta_chave', filtros.ferramenta_chave);
      }
      
      if (filtros?.arquivado !== undefined) {
        query = query.eq('arquivado', filtros.arquivado);
      }

      if (filtros?.tipo_registro) {
        query = query.eq('tipo_registro', filtros.tipo_registro);
      }

      const { data, error } = await query;

      if (error) throw error;

      const transformedData: JardimRegistro[] = (data || []).map((r: Record<string, unknown>) => ({
        ...r,
        conteudo: (r.conteudo as Record<string, unknown>) || {},
        resultado_simbolico: r.resultado_simbolico as Record<string, unknown> | null,
        tags: (r.tags as string[]) || [],
        tipo_registro: (r.tipo_registro as TipoRegistroJardim) || 'ferramenta',
        titulo: r.titulo as string | null,
        fonte: r.fonte as string | null,
        emocao_predominante: r.emocao_predominante as string | null,
      }));

      // Filtro de busca textual (client-side)
      let resultado = transformedData;
      if (filtros?.busca) {
        const busca = filtros.busca.toLowerCase();
        resultado = transformedData.filter(
          (r) =>
            r.ferramenta_nome.toLowerCase().includes(busca) ||
            r.reflexao_pessoal?.toLowerCase().includes(busca) ||
            r.titulo?.toLowerCase().includes(busca) ||
            JSON.stringify(r.conteudo).toLowerCase().includes(busca)
        );
      }

      setRegistros(resultado);
    } catch (error: unknown) {
      console.error('Erro ao carregar Jardim:', error);
      toast({
        title: 'Erro ao carregar registros',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, filtros, toast]);

  useEffect(() => {
    fetchRegistros();
  }, [fetchRegistros]);

  // Salvar novo registro
  const salvarRegistro = async (
    novoRegistro: NovoRegistroJardim
  ): Promise<string | null> => {
    if (!user) return null;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('jardim_psique_registros')
        .insert({
          user_id: user.id,
          ferramenta_nome: novoRegistro.ferramenta_nome,
          ferramenta_chave: novoRegistro.ferramenta_chave,
          conteudo: novoRegistro.conteudo,
          resultado_simbolico: novoRegistro.resultado_simbolico || null,
          reflexao_pessoal: novoRegistro.reflexao_pessoal || null,
          tags: novoRegistro.tags || [novoRegistro.ferramenta_chave],
          tipo_registro: novoRegistro.tipo_registro || 'ferramenta',
          titulo: novoRegistro.titulo || null,
          fonte: novoRegistro.fonte || null,
          emocao_predominante: novoRegistro.emocao_predominante || null,
        })
        .select('id')
        .single();

      if (error) throw error;

      const messages: Record<TipoRegistroJardim, string> = {
        ferramenta: '🌿 Salvo no Jardim',
        sonho: '🌙 Sonho registrado',
        frase: '✨ Frase guardada',
        fragmento: '📝 Fragmento salvo',
        oraculo: '🔮 Oráculo guardado',
        reflexao: '💭 Reflexão anotada',
      };

      toast({
        title: messages[novoRegistro.tipo_registro || 'ferramenta'],
        description: 'Sua memória foi guardada com carinho.',
      });

      await fetchRegistros();
      return data.id;
    } catch (error: unknown) {
      console.error('Erro ao salvar no Jardim:', error);
      toast({
        title: 'Erro ao salvar',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
      return null;
    }
  };

  // Atualizar reflexão
  const atualizarReflexao = async (
    registroId: string,
    reflexao: string
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('jardim_psique_registros')
        .update({ reflexao_pessoal: reflexao })
        .eq('id', registroId)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchRegistros();
      toast({ title: 'Reflexão atualizada' });
      return true;
    } catch (error: unknown) {
      console.error('Erro ao atualizar reflexão:', error);
      toast({
        title: 'Erro ao salvar',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Marcar como integrado
  const marcarIntegrado = async (
    registroId: string,
    integrado: boolean
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('jardim_psique_registros')
        .update({ integrado })
        .eq('id', registroId)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchRegistros();
      toast({
        title: integrado ? 'Marcado como integrado' : 'Desmarcado',
      });
      return true;
    } catch (error: unknown) {
      console.error('Erro ao marcar integrado:', error);
      return false;
    }
  };

  // Arquivar (não excluir)
  const arquivarRegistro = async (
    registroId: string,
    arquivado: boolean
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('jardim_psique_registros')
        .update({ arquivado })
        .eq('id', registroId)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchRegistros();
      toast({
        title: arquivado ? 'Arquivado' : 'Restaurado',
      });
      return true;
    } catch (error: unknown) {
      console.error('Erro ao arquivar:', error);
      return false;
    }
  };

  // Buscar registro específico
  const getRegistro = async (
    registroId: string
  ): Promise<JardimRegistro | null> => {
    if (!user) return null;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('jardim_psique_registros')
        .select('*')
        .eq('id', registroId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      return {
        ...data,
        conteudo: (data.conteudo as Record<string, unknown>) || {},
        resultado_simbolico: data.resultado_simbolico as Record<string, unknown> | null,
        tags: data.tags || [],
        tipo_registro: data.tipo_registro || 'ferramenta',
        titulo: data.titulo || null,
        fonte: data.fonte || null,
        emocao_predominante: data.emocao_predominante || null,
      };
    } catch (error: unknown) {
      console.error('Erro ao buscar registro:', error);
      return null;
    }
  };

  // Listar ferramentas únicas usadas
  const getFerramentasUsadas = useCallback((): string[] => {
    const unique = new Set(registros.map((r) => r.ferramenta_chave));
    return Array.from(unique);
  }, [registros]);

  // Listar tipos de registro únicos usados
  const getTiposUsados = useCallback((): TipoRegistroJardim[] => {
    const unique = new Set(registros.map((r) => r.tipo_registro));
    return Array.from(unique);
  }, [registros]);

  return {
    registros,
    loading,
    salvarRegistro,
    atualizarReflexao,
    marcarIntegrado,
    arquivarRegistro,
    getRegistro,
    getFerramentasUsadas,
    getTiposUsados,
    refetch: fetchRegistros,
  };
}
