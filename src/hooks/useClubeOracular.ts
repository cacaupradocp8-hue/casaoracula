import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface ConteudoSemanal {
  id: string;
  ciclo_id: string;
  semana_numero: number;
  data_inicio: string;
  data_fim: string | null;
  podcast_titulo: string | null;
  podcast_descricao: string | null;
  podcast_audio_url: string | null;
  podcast_externo_url: string | null;
  carta_nome: string | null;
  carta_imagem_url: string | null;
  carta_descricao_simbolica: string | null;
  pergunta_contemplativa: string | null;
  pratica_titulo: string | null;
  pratica_descricao: string | null;
  pratica_guia_url: string | null;
  ativo: boolean;
}

export interface ClubeReflexao {
  id: string;
  user_id: string;
  ciclo_id: string | null;
  conteudo_semanal_id: string | null;
  texto: string;
  created_at: string;
}

export interface ClubeEngajamento {
  id: string;
  user_id: string;
  ciclo_id: string | null;
  acessos: number;
  reflexoes_salvas: number;
  encontros_participados: number;
  nivel: 'baixo' | 'medio' | 'alto';
  progresso: number;
}

export function useClubeConteudoSemanal(cicloId: string | undefined) {
  return useQuery({
    queryKey: ['clube-conteudo-semanal', cicloId],
    queryFn: async () => {
      if (!cicloId) return null;
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await (supabase as any)
        .from('clube_conteudo_semanal')
        .select('*')
        .eq('ciclo_id', cicloId)
        .eq('ativo', true)
        .lte('data_inicio', today)
        .order('semana_numero', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as ConteudoSemanal | null;
    },
    enabled: !!cicloId,
  });
}

export function useClubeReflexoes(cicloId: string | undefined) {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: reflexoes, isLoading } = useQuery({
    queryKey: ['clube-reflexoes', cicloId, user?.id],
    queryFn: async () => {
      if (!user?.id || !cicloId) return [];
      const { data, error } = await (supabase as any)
        .from('clube_reflexoes')
        .select('*')
        .eq('user_id', user.id)
        .eq('ciclo_id', cicloId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as ClubeReflexao[];
    },
    enabled: !!user?.id && !!cicloId,
  });

  const salvarReflexao = useMutation({
    mutationFn: async ({ texto, conteudoSemanalId }: { texto: string; conteudoSemanalId?: string }) => {
      if (!user?.id || !cicloId) throw new Error('Missing data');
      const { error } = await (supabase as any)
        .from('clube_reflexoes')
        .insert({ user_id: user.id, ciclo_id: cicloId, conteudo_semanal_id: conteudoSemanalId, texto });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clube-reflexoes', cicloId] });
      toast({ title: 'Reflexão salva', description: 'Sua escrita foi guardada com cuidado.' });
    },
    onError: () => {
      toast({ title: 'Erro', description: 'Não foi possível salvar.', variant: 'destructive' });
    },
  });

  return { reflexoes, isLoading, salvarReflexao };
}

export function useClubeEngajamento(cicloId: string | undefined) {
  const { user } = useAuth();

  const { data: engajamento } = useQuery({
    queryKey: ['clube-engajamento', cicloId, user?.id],
    queryFn: async () => {
      if (!user?.id || !cicloId) return null;
      const { data, error } = await (supabase as any)
        .from('clube_engajamento')
        .select('*')
        .eq('user_id', user.id)
        .eq('ciclo_id', cicloId)
        .maybeSingle();
      if (error) throw error;
      return data as ClubeEngajamento | null;
    },
    enabled: !!user?.id && !!cicloId,
  });

  return { engajamento };
}

export function useClubeProximoEncontro(cicloId: string | undefined) {
  return useQuery({
    queryKey: ['clube-proximo-encontro', cicloId],
    queryFn: async () => {
      if (!cicloId) return null;
      const now = new Date().toISOString();
      const { data, error } = await (supabase as any)
        .from('clube_livro_encontros')
        .select('*')
        .eq('ciclo_id', cicloId)
        .eq('ativo', true)
        .gte('data_encontro', now)
        .order('data_encontro', { ascending: true })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!cicloId,
  });
}
