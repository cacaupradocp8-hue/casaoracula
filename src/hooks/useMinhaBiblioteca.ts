import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useMemo, useState } from 'react';

// ════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════

export type TipoRegistro = 'diario' | 'jardim' | 'oraculo' | 'labirinto' | 'progresso';

export interface RegistroBiblioteca {
  id: string;
  tipo: TipoRegistro;
  titulo: string;
  resumo: string | null;
  data: string; // ISO date
  link: string;
  icone: string; // lucide icon name
  metadata: {
    aulaId?: string;
    cursoNome?: string;
    travessiaNome?: string;
    ferramentaChave?: string;
    ferramentaNome?: string;
    oracleId?: string;
    oracleNome?: string;
    portaId?: string;
    portaNome?: string;
    integrado?: boolean;
    arquivado?: boolean;
    completed?: boolean;
  };
}

export type FiltroPeriodo = 'semana' | 'mes' | '3meses' | 'todos';

interface UseMinhaBibliotecaFilters {
  tipo: TipoRegistro | 'todos';
  periodo: FiltroPeriodo;
  busca: string;
}

// ════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ════════════════════════════════════════════════════════════════════════════

function getDateFilter(periodo: FiltroPeriodo): Date | null {
  const now = new Date();
  switch (periodo) {
    case 'semana':
      return new Date(now.setDate(now.getDate() - 7));
    case 'mes':
      return new Date(now.setMonth(now.getMonth() - 1));
    case '3meses':
      return new Date(now.setMonth(now.getMonth() - 3));
    default:
      return null;
  }
}

function truncateText(text: string | null, maxLength: number = 120): string | null {
  if (!text) return null;
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN HOOK
// ════════════════════════════════════════════════════════════════════════════

export function useMinhaBiblioteca() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<UseMinhaBibliotecaFilters>({
    tipo: 'todos',
    periodo: 'todos',
    busca: '',
  });

  const { data: rawData, isLoading, error } = useQuery({
    queryKey: ['minha-biblioteca', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // Fetch all sources in parallel
      const [diariosRes, jardimRes, oraculosRes, labirintoRes, progressoRes] = await Promise.all([
        // Diários de Bordo
        supabase
          .from('diario_bordo_aulas')
          .select(`
            id,
            aula_id,
            conteudo,
            created_at,
            updated_at
          `)
          .eq('user_id', user.id)
          .not('conteudo', 'is', null)
          .order('updated_at', { ascending: false }),

        // Jardim da Psique
        supabase
          .from('jardim_psique_registros')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),

        // Oráculos (only personal, not professional sessions)
        supabase
          .from('oracle_draws')
          .select(`
            id,
            oracle_id,
            interpretation,
            user_reflection,
            created_at,
            oracle:oracle_decks(name)
          `)
          .eq('user_id', user.id)
          .eq('is_professional_session', false)
          .order('created_at', { ascending: false }),

        // Labirinto Leituras (only personal, no client)
        supabase
          .from('labirinto_leituras')
          .select(`
            id,
            porta_id,
            contexto,
            reflexoes,
            created_at,
            porta:labirinto_portas(nome, numero)
          `)
          .eq('user_id', user.id)
          .is('cliente_id', null)
          .order('created_at', { ascending: false }),

        // Course Progress (completed lessons)
        supabase
          .from('course_lesson_progress')
          .select(`
            id,
            lesson_id,
            completed_at,
            lesson:course_lessons(
              titulo,
              module:course_modules(
                titulo,
                course:courses(titulo, id)
              )
            )
          `)
          .eq('user_id', user.id)
          .eq('completed', true)
          .order('completed_at', { ascending: false }),
      ]);

      return {
        diarios: diariosRes.data || [],
        jardim: jardimRes.data || [],
        oraculos: oraculosRes.data || [],
        labirinto: labirintoRes.data || [],
        progresso: progressoRes.data || [],
      };
    },
    enabled: !!user?.id,
    staleTime: 30000,
  });

  // Normalize all data to unified format
  const normalizedData = useMemo<RegistroBiblioteca[]>(() => {
    if (!rawData) return [];

    const registros: RegistroBiblioteca[] = [];

    // Normalize Diários
    rawData.diarios.forEach((d: any) => {
      registros.push({
        id: d.id,
        tipo: 'diario',
        titulo: 'Diário de Bordo',
        resumo: truncateText(d.conteudo),
        data: d.updated_at || d.created_at,
        link: `/aulas/${d.aula_id}`,
        icone: 'BookOpen',
        metadata: {
          aulaId: d.aula_id,
        },
      });
    });

    // Normalize Jardim
    rawData.jardim.forEach((j: any) => {
      registros.push({
        id: j.id,
        tipo: 'jardim',
        titulo: j.titulo || j.ferramenta_nome || 'Registro',
        resumo: truncateText(j.reflexao_pessoal),
        data: j.created_at,
        link: `/jardim-da-psique/${j.id}`,
        icone: 'Leaf',
        metadata: {
          ferramentaChave: j.ferramenta_chave,
          ferramentaNome: j.ferramenta_nome,
          integrado: j.integrado,
          arquivado: j.arquivado,
        },
      });
    });

    // Normalize Oráculos
    rawData.oraculos.forEach((o: any) => {
      const oracleName = o.oracle?.name || 'Oráculo';
      registros.push({
        id: o.id,
        tipo: 'oraculo',
        titulo: `Tiragem: ${oracleName}`,
        resumo: truncateText(o.user_reflection || o.interpretation),
        data: o.created_at,
        link: `/oraculos/${o.oracle_id}/history`,
        icone: 'Sparkles',
        metadata: {
          oracleId: o.oracle_id,
          oracleNome: oracleName,
        },
      });
    });

    // Normalize Labirinto
    rawData.labirinto.forEach((l: any) => {
      const portaNome = l.porta?.nome || 'Porta';
      const portaNumero = l.porta?.numero;
      registros.push({
        id: l.id,
        tipo: 'labirinto',
        titulo: portaNumero ? `Porta ${portaNumero}: ${portaNome}` : portaNome,
        resumo: truncateText(l.reflexoes || l.contexto),
        data: l.created_at,
        link: `/labirinto/porta/${l.porta_id}`,
        icone: 'Orbit',
        metadata: {
          portaId: l.porta_id,
          portaNome,
        },
      });
    });

    // Normalize Progresso
    rawData.progresso.forEach((p: any) => {
      const lesson = p.lesson;
      const module = lesson?.module;
      const course = module?.course;
      
      if (!lesson) return;

      registros.push({
        id: p.id,
        tipo: 'progresso',
        titulo: lesson.titulo || 'Aula',
        resumo: module?.titulo ? `${course?.titulo || 'Curso'} • ${module.titulo}` : null,
        data: p.completed_at,
        link: `/cursos/${course?.id}/aula/${p.lesson_id}`,
        icone: 'CheckCircle',
        metadata: {
          aulaId: p.lesson_id,
          cursoNome: course?.titulo,
          completed: true,
        },
      });
    });

    // Sort by date (most recent first)
    registros.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

    return registros;
  }, [rawData]);

  // Apply filters
  const filteredData = useMemo(() => {
    let result = normalizedData;

    // Filter by type
    if (filters.tipo !== 'todos') {
      result = result.filter(r => r.tipo === filters.tipo);
    }

    // Filter by period
    const dateFilter = getDateFilter(filters.periodo);
    if (dateFilter) {
      result = result.filter(r => new Date(r.data) >= dateFilter);
    }

    // Filter by search
    if (filters.busca.trim()) {
      const search = filters.busca.toLowerCase();
      result = result.filter(r => 
        r.titulo.toLowerCase().includes(search) ||
        r.resumo?.toLowerCase().includes(search)
      );
    }

    return result;
  }, [normalizedData, filters]);

  // Count by type
  const contagem = useMemo(() => {
    const counts: Record<TipoRegistro | 'todos', number> = {
      todos: normalizedData.length,
      diario: 0,
      jardim: 0,
      oraculo: 0,
      labirinto: 0,
      progresso: 0,
    };

    normalizedData.forEach(r => {
      counts[r.tipo]++;
    });

    return counts;
  }, [normalizedData]);

  return {
    registros: filteredData,
    contagem,
    isLoading,
    error,
    filters,
    setFilters,
    setTipo: (tipo: TipoRegistro | 'todos') => setFilters(f => ({ ...f, tipo })),
    setPeriodo: (periodo: FiltroPeriodo) => setFilters(f => ({ ...f, periodo })),
    setBusca: (busca: string) => setFilters(f => ({ ...f, busca })),
  };
}
