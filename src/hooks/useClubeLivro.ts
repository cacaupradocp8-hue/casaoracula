import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Types
export interface ClubeCiclo {
  id: string;
  titulo: string;
  subtitulo?: string;
  autor_livro?: string;
  capa_url?: string;
  por_que_este_livro?: string;
  como_ler?: string;
  manifesto?: string;
  ordem: number;
  ativo: boolean;
  publicado: boolean;
  data_inicio?: string;
  data_fim?: string;
  portal_minimo: string;
  created_at: string;
}

export interface ClubeFase {
  id: string;
  ciclo_id: string;
  titulo: string;
  descricao?: string;
  icone?: string;
  ordem: number;
  ativo: boolean;
}

export interface ClubePergunta {
  id: string;
  fase_id: string;
  texto_pergunta: string;
  ordem: number;
  ativo: boolean;
}

export interface ClubeResposta {
  id: string;
  user_id: string;
  ciclo_id: string;
  fase_id: string;
  pergunta_id: string;
  resposta?: string;
  salvo_jardim: boolean;
  jardim_registro_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ClubeEscuta {
  id: string;
  ciclo_id: string;
  fase_id?: string;
  titulo: string;
  descricao?: string;
  tipo: 'audio' | 'texto';
  audio_url?: string;
  texto_conteudo?: string;
  duracao_segundos?: number;
  ordem: number;
  ativo: boolean;
}

export interface ClubeEncontro {
  id: string;
  ciclo_id: string;
  titulo: string;
  descricao?: string;
  orientacao_encontro?: string;
  data_encontro?: string;
  link_ao_vivo?: string;
  replay_url?: string;
  ativo: boolean;
}

// Hook principal
export function useClubeLivro() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar ciclos publicados
  const { data: ciclos, isLoading: loadingCiclos } = useQuery({
    queryKey: ['clube-livro-ciclos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_livro_ciclos')
        .select('*')
        .order('ordem', { ascending: true });

      if (error) throw error;
      return data as ClubeCiclo[];
    },
    enabled: !!user,
  });

  // Buscar ciclo atual (mais recente publicado)
  const cicloAtual = ciclos?.find(c => c.publicado && c.ativo) || null;

  return {
    ciclos,
    cicloAtual,
    loadingCiclos,
  };
}

// Hook para detalhes de um ciclo
export function useClubeCicloDetalhe(cicloId: string | undefined) {
  const { user } = useAuth();

  // Buscar ciclo
  const { data: ciclo, isLoading: loadingCiclo } = useQuery({
    queryKey: ['clube-livro-ciclo', cicloId],
    queryFn: async () => {
      if (!cicloId) return null;
      const { data, error } = await supabase
        .from('clube_livro_ciclos')
        .select('*')
        .eq('id', cicloId)
        .maybeSingle();

      if (error) throw error;
      return data as ClubeCiclo | null;
    },
    enabled: !!cicloId && !!user,
  });

  // Buscar fases do ciclo
  const { data: fases, isLoading: loadingFases } = useQuery({
    queryKey: ['clube-livro-fases', cicloId],
    queryFn: async () => {
      if (!cicloId) return [];
      const { data, error } = await supabase
        .from('clube_livro_fases')
        .select('*')
        .eq('ciclo_id', cicloId)
        .order('ordem', { ascending: true });

      if (error) throw error;
      return data as ClubeFase[];
    },
    enabled: !!cicloId && !!user,
  });

  // Buscar escutas do ciclo
  const { data: escutas, isLoading: loadingEscutas } = useQuery({
    queryKey: ['clube-livro-escutas', cicloId],
    queryFn: async () => {
      if (!cicloId) return [];
      const { data, error } = await supabase
        .from('clube_livro_escutas')
        .select('*')
        .eq('ciclo_id', cicloId)
        .order('ordem', { ascending: true });

      if (error) throw error;
      return data as ClubeEscuta[];
    },
    enabled: !!cicloId && !!user,
  });

  // Buscar encontros do ciclo
  const { data: encontros, isLoading: loadingEncontros } = useQuery({
    queryKey: ['clube-livro-encontros', cicloId],
    queryFn: async () => {
      if (!cicloId) return [];
      const { data, error } = await supabase
        .from('clube_livro_encontros')
        .select('*')
        .eq('ciclo_id', cicloId)
        .order('data_encontro', { ascending: true });

      if (error) throw error;
      return data as ClubeEncontro[];
    },
    enabled: !!cicloId && !!user,
  });

  return {
    ciclo,
    fases,
    escutas,
    encontros,
    isLoading: loadingCiclo || loadingFases || loadingEscutas || loadingEncontros,
  };
}

// Hook para perguntas e respostas de uma fase
export function useClubeFasePerguntas(faseId: string | undefined, cicloId: string | undefined) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar perguntas da fase
  const { data: perguntas, isLoading: loadingPerguntas } = useQuery({
    queryKey: ['clube-livro-perguntas', faseId],
    queryFn: async () => {
      if (!faseId) return [];
      const { data, error } = await supabase
        .from('clube_livro_perguntas')
        .select('*')
        .eq('fase_id', faseId)
        .order('ordem', { ascending: true });

      if (error) throw error;
      return data as ClubePergunta[];
    },
    enabled: !!faseId && !!user,
  });

  // Buscar respostas do usuário
  const { data: respostas, isLoading: loadingRespostas } = useQuery({
    queryKey: ['clube-livro-respostas', faseId, user?.id],
    queryFn: async () => {
      if (!faseId || !user?.id) return [];
      const { data, error } = await supabase
        .from('clube_livro_respostas')
        .select('*')
        .eq('fase_id', faseId)
        .eq('user_id', user.id);

      if (error) throw error;
      return data as ClubeResposta[];
    },
    enabled: !!faseId && !!user?.id,
  });

  // Salvar resposta
  const salvarResposta = useMutation({
    mutationFn: async ({ perguntaId, resposta }: { perguntaId: string; resposta: string }) => {
      if (!user?.id || !faseId || !cicloId) throw new Error('Dados incompletos');

      // Verificar se já existe
      const existente = respostas?.find(r => r.pergunta_id === perguntaId);

      if (existente) {
        const { error } = await supabase
          .from('clube_livro_respostas')
          .update({ resposta, updated_at: new Date().toISOString() })
          .eq('id', existente.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('clube_livro_respostas')
          .insert({
            user_id: user.id,
            ciclo_id: cicloId,
            fase_id: faseId,
            pergunta_id: perguntaId,
            resposta,
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clube-livro-respostas', faseId] });
      toast({
        title: 'Reflexão salva',
        description: 'Sua escrita foi guardada com segurança.',
      });
    },
    onError: () => {
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar sua reflexão.',
        variant: 'destructive',
      });
    },
  });

  return {
    perguntas,
    respostas,
    isLoading: loadingPerguntas || loadingRespostas,
    salvarResposta,
  };
}
