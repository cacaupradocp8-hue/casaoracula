import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BlockContextType } from '@/types/modular';

export interface ContentRegistryItem {
  id: string;
  type: 'tool' | 'sala' | 'quiz' | 'quiz_result' | 'portal' | 'course' | 'agent' | 'block';
  name: string;
  status: 'active' | 'inactive' | 'draft';
  portalMinimo: string;
  usedIn: {
    type: string;
    id: string;
    name: string;
  }[];
  hasBlocks: boolean;
  blockCount: number;
  route: string | null;
  lastUpdated: string;
}

interface UseContentRegistryResult {
  items: ContentRegistryItem[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  getItemUsage: (itemId: string, itemType: string) => Promise<{ type: string; id: string; name: string }[]>;
}

export function useContentRegistry(): UseContentRegistryResult {
  const [items, setItems] = useState<ContentRegistryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRegistry = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch all content types in parallel
      const [
        toolsRes,
        salasRes,
        quizzesRes,
        quizResultsRes,
        portalsRes,
        coursesRes,
        agentsRes,
        blocksRes,
      ] = await Promise.all([
        supabase.from('sala_ferramentas').select('*'),
        supabase.from('salas').select('*'),
        supabase.from('quizzes').select('*'),
        supabase.from('quiz_resultados').select('*'),
        supabase.from('conteudo_travessias').select('*'),
        supabase.from('courses').select('*'),
        supabase.from('agentes').select('*'),
        supabase.from('content_blocks').select('context_type, context_id').limit(1000),
      ]);

      const registryItems: ContentRegistryItem[] = [];

      // Count blocks per context
      const blockCounts: Record<string, number> = {};
      if (blocksRes.data) {
        blocksRes.data.forEach((block) => {
          const key = `${block.context_type}:${block.context_id}`;
          blockCounts[key] = (blockCounts[key] || 0) + 1;
        });
      }

      // Transform tools
      if (toolsRes.data) {
        toolsRes.data.forEach((tool) => {
          const blockKey = `tool:${tool.id}`;
          registryItems.push({
            id: tool.id,
            type: 'tool',
            name: tool.ferramenta_nome,
            status: tool.ativa ? 'active' : 'inactive',
            portalMinimo: tool.portal_minimo || 'visitante',
            usedIn: [], // Will be populated by getItemUsage
            hasBlocks: tool.has_blocks || false,
            blockCount: blockCounts[blockKey] || 0,
            route: tool.rota,
            lastUpdated: tool.updated_at,
          });
        });
      }

      // Transform salas
      if (salasRes.data) {
        salasRes.data.forEach((sala) => {
          const blockKey = `sala:${sala.id}`;
          registryItems.push({
            id: sala.id,
            type: 'sala',
            name: sala.nome_exibicao,
            status: sala.ativa ? 'active' : 'inactive',
            portalMinimo: sala.nivel_minimo || 'NIVEL_0',
            usedIn: [],
            hasBlocks: false,
            blockCount: blockCounts[blockKey] || 0,
            route: `/sala/${sala.id}`,
            lastUpdated: sala.updated_at,
          });
        });
      }

      // Transform quizzes
      if (quizzesRes.data) {
        quizzesRes.data.forEach((quiz) => {
          registryItems.push({
            id: quiz.id,
            type: 'quiz',
            name: quiz.titulo,
            status: quiz.ativo ? 'active' : 'draft',
            portalMinimo: 'visitante',
            usedIn: [],
            hasBlocks: false,
            blockCount: 0,
            route: `/quiz/${quiz.id}`,
            lastUpdated: quiz.updated_at,
          });
        });
      }

      // Transform quiz results
      if (quizResultsRes.data) {
        quizResultsRes.data.forEach((result) => {
          const blockKey = `quiz_result:${result.id}`;
          registryItems.push({
            id: result.id,
            type: 'quiz_result',
            name: result.titulo_simbolico || 'Resultado sem título',
            status: 'active',
            portalMinimo: 'visitante',
            usedIn: [],
            hasBlocks: true,
            blockCount: blockCounts[blockKey] || 0,
            route: null,
            lastUpdated: result.updated_at,
          });
        });
      }

      // Transform portals (travessias)
      if (portalsRes.data) {
        portalsRes.data.forEach((portal) => {
          const blockKey = `portal:${portal.id}`;
          registryItems.push({
            id: portal.id,
            type: 'portal',
            name: portal.titulo,
            status: portal.publicado ? 'active' : 'draft',
            portalMinimo: portal.portal_minimo || 'visitante',
            usedIn: [],
            hasBlocks: true,
            blockCount: blockCounts[blockKey] || 0,
            route: `/portal/${portal.id}`,
            lastUpdated: portal.updated_at,
          });
        });
      }

      // Transform courses
      if (coursesRes.data) {
        coursesRes.data.forEach((course) => {
          registryItems.push({
            id: course.id,
            type: 'course',
            name: course.titulo,
            status: course.publicado ? 'active' : 'draft',
            portalMinimo: course.portal_minimo || 'visitante',
            usedIn: [],
            hasBlocks: false,
            blockCount: 0,
            route: `/curso/${course.id}`,
            lastUpdated: course.updated_at,
          });
        });
      }

      // Transform agents
      if (agentsRes.data) {
        agentsRes.data.forEach((agent) => {
          registryItems.push({
            id: agent.id,
            type: 'agent',
            name: agent.nome,
            status: agent.status === 'ativo' ? 'active' : 'inactive',
            portalMinimo: agent.portal_minimo || 'visitante',
            usedIn: [],
            hasBlocks: false,
            blockCount: 0,
            route: null,
            lastUpdated: agent.updated_at,
          });
        });
      }

      setItems(registryItems);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegistry();
  }, [fetchRegistry]);

  const getItemUsage = useCallback(
    async (itemId: string, itemType: string): Promise<{ type: string; id: string; name: string }[]> => {
      const usage: { type: string; id: string; name: string }[] = [];

      if (itemType === 'agent') {
        // Check where this agent is used in blocks
        const { data: blocks } = await supabase
          .from('content_blocks')
          .select('context_type, context_id')
          .eq('agente_id', itemId);

        if (blocks) {
          for (const block of blocks) {
            usage.push({
              type: block.context_type,
              id: block.context_id,
              name: `${block.context_type}:${block.context_id}`,
            });
          }
        }

        // Check quiz results
        const { data: quizResults } = await supabase
          .from('quiz_resultados')
          .select('id, titulo_simbolico')
          .eq('agente_id', itemId);

        if (quizResults) {
          quizResults.forEach((r) => {
            usage.push({
              type: 'quiz_result',
              id: r.id,
              name: r.titulo_simbolico || 'Resultado',
            });
          });
        }
      }

      if (itemType === 'tool') {
        // Check which sala contains this tool
        const { data: tool } = await supabase
          .from('sala_ferramentas')
          .select('sala_id')
          .eq('id', itemId)
          .single();

        if (tool?.sala_id) {
          const { data: sala } = await supabase
            .from('salas')
            .select('id, nome_exibicao')
            .eq('id', tool.sala_id)
            .single();

          if (sala) {
            usage.push({
              type: 'sala',
              id: sala.id,
              name: sala.nome_exibicao,
            });
          }
        }
      }

      return usage;
    },
    []
  );

  return {
    items,
    isLoading,
    error,
    refresh: fetchRegistry,
    getItemUsage,
  };
}
