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
  // New clinical fields
  tema_simbolico?: string;
  orientacao_clinica_uso?: string;
  orientacao_clinica_evitar?: string;
  orientacao_clinica_riscos?: string;
  orientacao_clinica_indicado?: string;
  orientacao_clinica_contraindicado?: string;
  ritual_aceite_obrigatorio?: boolean;
  portal_minimo_clinico?: string;
}

export interface ClubeFase {
  id: string;
  ciclo_id: string;
  titulo: string;
  descricao?: string;
  icone?: string;
  ordem: number;
  ativo: boolean;
  // Type and orientation
  tipo_fase?: 'chamado' | 'ruptura' | 'reorganizacao' | 'integracao';
  orientacao_curta?: string;
  // New week-based structure fields
  numero_semana?: number;
  leitura_orientada?: string;
  alerta_clinico?: string;
  observacao_clinica?: string;
  lista_uso_inadequado?: string[];
  ponte_sala_id?: string;
  ponte_sala_texto?: string;
  texto_fechamento?: string;
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

export interface RitualAceite {
  id: string;
  user_id: string;
  ciclo_id: string;
  aceito_em: string;
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

  // Organize cycles
  const now = new Date();
  const cicloAtual = ciclos?.find(c => c.publicado && c.ativo) || null;
  
  const ciclosProximos = ciclos?.filter(c => {
    if (!c.data_inicio) return false;
    return new Date(c.data_inicio) > now && !c.ativo;
  }) || [];

  const ciclosAnteriores = ciclos?.filter(c => {
    if (!c.data_fim) return c.publicado && !c.ativo && c !== cicloAtual;
    return new Date(c.data_fim) < now;
  }) || [];

  return {
    ciclos,
    cicloAtual,
    ciclosProximos,
    ciclosAnteriores,
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

  // Buscar aulas do ciclo
  const { data: aulas, isLoading: loadingAulas } = useQuery({
    queryKey: ['clube-livro-aulas', cicloId],
    queryFn: async () => {
      if (!cicloId) return [];
      const { data, error } = await supabase
        .from('clube_livro_aulas')
        .select('*, clube_livro_portas(jornada)')
        .eq('ciclo_id', cicloId)
        .eq('ativo', true)
        .eq('publicado', true)
        .order('ordem', { ascending: true });

      if (error) throw error;
      return (data || []).map((a: any) => ({
        ...a,
        porta_jornada: a.clube_livro_portas?.jornada || null,
      })) as { id: string; titulo: string; subtitulo?: string; ordem: number; duracao?: string; porta_id?: string; porta_jornada?: string }[];
    },
    enabled: !!cicloId && !!user,
  });

  return {
    ciclo,
    fases,
    escutas,
    encontros,
    aulas,
    isLoading: loadingCiclo || loadingFases || loadingEscutas || loadingEncontros || loadingAulas,
  };
}

// Hook para ritual de aceite
export function useRitualAceite(cicloId: string | undefined) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if user has accepted ritual for this cycle
  const { data: aceite, isLoading } = useQuery({
    queryKey: ['clube-livro-ritual-aceite', cicloId, user?.id],
    queryFn: async () => {
      if (!cicloId || !user?.id) return null;
      const { data, error } = await supabase
        .from('clube_livro_ritual_aceites')
        .select('*')
        .eq('ciclo_id', cicloId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as RitualAceite | null;
    },
    enabled: !!cicloId && !!user?.id,
  });

  // Accept ritual
  const acceptRitual = useMutation({
    mutationFn: async () => {
      if (!user?.id || !cicloId) throw new Error('Dados incompletos');

      const { error } = await supabase
        .from('clube_livro_ritual_aceites')
        .insert({
          user_id: user.id,
          ciclo_id: cicloId,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clube-livro-ritual-aceite', cicloId] });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível registrar o aceite.',
        variant: 'destructive',
      });
    },
  });

  return {
    hasAccepted: !!aceite,
    aceite,
    isLoading,
    acceptRitual,
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

// Fixed phase types for generating standard phases
export const FASES_PADRAO = [
  { tipo_fase: 'chamado', titulo: 'Chamado', descricao: 'Início da jornada - o livro chega até você', ordem: 1 },
  { tipo_fase: 'ruptura', titulo: 'Ruptura', descricao: 'Momento de crise ou desorganização interna', ordem: 2 },
  { tipo_fase: 'reorganizacao', titulo: 'Reorganização', descricao: 'Retomada do fio - integração gradual', ordem: 3 },
  { tipo_fase: 'integracao', titulo: 'Integração', descricao: 'Consolidação e encerramento do ciclo', ordem: 4 },
] as const;
