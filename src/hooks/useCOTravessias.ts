import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface COTravessia {
  id: string;
  titulo: string;
  descricao: string | null;
  livro_base: string | null;
  nivel: 'iniciante' | 'intermediario' | 'avancado';
  ordem: number;
  ativo: boolean;
}

export interface COTravessiaEncontro {
  id: string;
  travessia_id: string;
  numero_encontro: number;
  titulo: string;
  abertura_texto: string | null;
  reflexoes: string[];
  ferramenta_sugerida: string | null;
  pratica_texto: string | null;
  integracao_texto: string | null;
  conducao_terapeuta: string | null;
  objetivo_encontro: string | null;
}

export interface COTravessiaResposta {
  id: string;
  user_id: string;
  travessia_id: string;
  encontro_id: string;
  resposta_texto: string | null;
  resposta_integracao: string | null;
  created_at: string;
}

// List active travessias
export function useCOTravessias() {
  return useQuery({
    queryKey: ['co-travessias'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('co_travessias')
        .select('*')
        .eq('ativo', true)
        .order('ordem', { ascending: true });
      if (error) throw error;
      return data as COTravessia[];
    },
  });
}

// Get single travessia
export function useCOTravessia(id: string | undefined) {
  return useQuery({
    queryKey: ['co-travessia', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await (supabase as any)
        .from('co_travessias')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as COTravessia;
    },
    enabled: !!id,
  });
}

// Get encontros for a travessia
export function useCOEncontros(travessiaId: string | undefined) {
  return useQuery({
    queryKey: ['co-travessia-encontros', travessiaId],
    queryFn: async () => {
      if (!travessiaId) return [];
      const { data, error } = await (supabase as any)
        .from('co_travessia_encontros')
        .select('*')
        .eq('travessia_id', travessiaId)
        .order('numero_encontro', { ascending: true });
      if (error) throw error;
      return data as COTravessiaEncontro[];
    },
    enabled: !!travessiaId,
  });
}

// Get single encontro
export function useCOEncontro(encontroId: string | undefined) {
  return useQuery({
    queryKey: ['co-travessia-encontro', encontroId],
    queryFn: async () => {
      if (!encontroId) return null;
      const { data, error } = await (supabase as any)
        .from('co_travessia_encontros')
        .select('*')
        .eq('id', encontroId)
        .single();
      if (error) throw error;
      return data as COTravessiaEncontro;
    },
    enabled: !!encontroId,
  });
}

// Get user respostas for a travessia
export function useCORespostas(travessiaId: string | undefined) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['co-travessia-respostas', travessiaId, user?.id],
    queryFn: async () => {
      if (!user?.id || !travessiaId) return [];
      const { data, error } = await (supabase as any)
        .from('co_travessia_respostas')
        .select('*')
        .eq('user_id', user.id)
        .eq('travessia_id', travessiaId);
      if (error) throw error;
      return data as COTravessiaResposta[];
    },
    enabled: !!user?.id && !!travessiaId,
  });
}

// Save or update a resposta
export function useSalvarResposta() {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      travessiaId,
      encontroId,
      respostaTexto,
      respostaIntegracao,
    }: {
      travessiaId: string;
      encontroId: string;
      respostaTexto?: string;
      respostaIntegracao?: string;
    }) => {
      if (!user?.id) throw new Error('Não autenticada');

      const { data: existing } = await (supabase as any)
        .from('co_travessia_respostas')
        .select('id')
        .eq('user_id', user.id)
        .eq('encontro_id', encontroId)
        .maybeSingle();

      if (existing) {
        const updates: Record<string, string> = {};
        if (respostaTexto !== undefined) updates.resposta_texto = respostaTexto;
        if (respostaIntegracao !== undefined) updates.resposta_integracao = respostaIntegracao;

        const { error } = await (supabase as any)
          .from('co_travessia_respostas')
          .update(updates)
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any)
          .from('co_travessia_respostas')
          .insert({
            user_id: user.id,
            travessia_id: travessiaId,
            encontro_id: encontroId,
            resposta_texto: respostaTexto || null,
            resposta_integracao: respostaIntegracao || null,
          });
        if (error) throw error;
      }
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['co-travessia-respostas', vars.travessiaId] });
      toast({ title: 'Salvo ✨', description: 'Sua escrita foi guardada.' });
    },
    onError: () => {
      toast({ title: 'Erro', description: 'Não foi possível salvar.', variant: 'destructive' });
    },
  });
}

// Helper: get user progress count
export function useProgressoTravessia(travessiaId: string | undefined) {
  const { data: respostas = [] } = useCORespostas(travessiaId);
  const completados = respostas.filter(r => r.resposta_texto && r.resposta_texto.trim().length > 0);
  return { total: 4, completados: completados.length, respostas };
}
