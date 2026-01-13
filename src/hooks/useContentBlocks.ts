import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContentBlock, BlockContextType, ContentBlockRow, transformBlockRow } from '@/types/modular';
import { useAuth } from '@/contexts/AuthContext';

interface UseContentBlocksOptions {
  contextType: BlockContextType;
  contextId: string;
  enabled?: boolean;
}

interface UseContentBlocksResult {
  blocks: ContentBlock[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useContentBlocks({ 
  contextType, 
  contextId, 
  enabled = true 
}: UseContentBlocksOptions): UseContentBlocksResult {
  const { user } = useAuth();
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBlocks = useCallback(async () => {
    if (!contextId || !enabled) {
      setBlocks([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('context_type', contextType)
        .eq('context_id', contextId)
        .eq('ativo', true)
        .order('ordem', { ascending: true });

      if (fetchError) throw fetchError;

      const transformedBlocks = (data as ContentBlockRow[] || []).map(transformBlockRow);
      setBlocks(transformedBlocks);
    } catch (err) {
      console.error('Error fetching content blocks:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch blocks'));
    } finally {
      setIsLoading(false);
    }
  }, [contextType, contextId, enabled]);

  // Initial fetch
  useEffect(() => {
    fetchBlocks();
  }, [fetchBlocks]);

  // Realtime subscription for live updates
  useEffect(() => {
    if (!contextId || !enabled) return;

    const channelName = `blocks-${contextType}-${contextId.slice(0, 8)}`;
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'content_blocks',
          filter: `context_type=eq.${contextType}`,
        },
        (payload) => {
          // Check if the change affects our specific context
          const newRecord = payload.new as { context_id?: string } | null;
          const oldRecord = payload.old as { context_id?: string } | null;
          
          if (
            newRecord?.context_id === contextId || 
            oldRecord?.context_id === contextId
          ) {
            // Refetch when any change happens to our blocks
            fetchBlocks();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [contextType, contextId, enabled, fetchBlocks]);

  return {
    blocks,
    isLoading,
    error,
    refetch: fetchBlocks,
  };
}
