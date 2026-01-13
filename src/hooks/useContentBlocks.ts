import { useState, useEffect } from 'react';
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

  const fetchBlocks = async () => {
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
  };

  useEffect(() => {
    fetchBlocks();
  }, [contextType, contextId, enabled, user?.id]);

  return {
    blocks,
    isLoading,
    error,
    refetch: fetchBlocks,
  };
}
