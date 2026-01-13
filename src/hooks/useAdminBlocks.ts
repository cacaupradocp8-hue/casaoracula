import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  ContentBlock, 
  ContentBlockRow, 
  BlockContextType, 
  ContentBlockType,
  BlockContent,
  transformBlockRow,
  DEFAULT_BLOCK_CONTENT
} from '@/types/modular';
import { PortalType } from '@/types/portal';

interface UseAdminBlocksOptions {
  contextType?: BlockContextType;
  contextId?: string;
}

export function useAdminBlocks({ contextType, contextId }: UseAdminBlocksOptions = {}) {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchBlocks = useCallback(async () => {
    if (!contextType || !contextId) {
      setBlocks([]);
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
        .order('ordem', { ascending: true });

      if (fetchError) throw fetchError;

      const transformedBlocks = (data as ContentBlockRow[]).map(transformBlockRow);
      setBlocks(transformedBlocks);
    } catch (err) {
      setError(err as Error);
      toast({
        title: 'Erro ao carregar blocos',
        description: (err as Error).message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [contextType, contextId, toast]);

  useEffect(() => {
    fetchBlocks();
  }, [fetchBlocks]);

  const createBlock = async (
    blockType: ContentBlockType,
    content: BlockContent = DEFAULT_BLOCK_CONTENT[blockType],
    options: {
      titulo?: string;
      descricao?: string;
      portalMinimo?: PortalType;
      agenteId?: string;
    } = {}
  ) => {
    if (!contextType || !contextId) {
      throw new Error('Context type and ID are required');
    }

    const maxOrdem = blocks.length > 0 
      ? Math.max(...blocks.map(b => b.ordem)) 
      : 0;

    const insertData = {
      context_type: contextType,
      context_id: contextId,
      block_type: blockType,
      content: content as Record<string, unknown>,
      ordem: maxOrdem + 1,
      ativo: true,
      portal_minimo: options.portalMinimo || 'visitante',
      titulo: options.titulo,
      descricao: options.descricao,
      agente_id: options.agenteId,
    };

    const { data, error: insertError } = await supabase
      .from('content_blocks')
      .insert(insertData as never)
      .select()
      .single();

    if (insertError) {
      toast({
        title: 'Erro ao criar bloco',
        description: insertError.message,
        variant: 'destructive',
      });
      throw insertError;
    }

    await fetchBlocks();
    toast({ title: 'Bloco criado com sucesso' });
    return transformBlockRow(data as ContentBlockRow);
  };

  const updateBlock = async (
    blockId: string,
    updates: Partial<{
      content: BlockContent;
      titulo: string;
      descricao: string;
      portalMinimo: PortalType;
      ativo: boolean;
      agenteId: string;
    }>
  ) => {
    const updateData: Record<string, unknown> = {};
    
    if (updates.content !== undefined) updateData.content = updates.content;
    if (updates.titulo !== undefined) updateData.titulo = updates.titulo;
    if (updates.descricao !== undefined) updateData.descricao = updates.descricao;
    if (updates.portalMinimo !== undefined) updateData.portal_minimo = updates.portalMinimo;
    if (updates.ativo !== undefined) updateData.ativo = updates.ativo;
    if (updates.agenteId !== undefined) updateData.agente_id = updates.agenteId;

    const { error: updateError } = await supabase
      .from('content_blocks')
      .update(updateData)
      .eq('id', blockId);

    if (updateError) {
      toast({
        title: 'Erro ao atualizar bloco',
        description: updateError.message,
        variant: 'destructive',
      });
      throw updateError;
    }

    await fetchBlocks();
    toast({ title: 'Bloco atualizado' });
  };

  const deleteBlock = async (blockId: string) => {
    const { error: deleteError } = await supabase
      .from('content_blocks')
      .delete()
      .eq('id', blockId);

    if (deleteError) {
      toast({
        title: 'Erro ao excluir bloco',
        description: deleteError.message,
        variant: 'destructive',
      });
      throw deleteError;
    }

    await fetchBlocks();
    toast({ title: 'Bloco excluído' });
  };

  const reorderBlocks = async (blockId: string, direction: 'up' | 'down') => {
    const currentIndex = blocks.findIndex(b => b.id === blockId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;

    const currentBlock = blocks[currentIndex];
    const swapBlock = blocks[newIndex];

    // Swap ordem values
    const updates = [
      supabase
        .from('content_blocks')
        .update({ ordem: swapBlock.ordem })
        .eq('id', currentBlock.id),
      supabase
        .from('content_blocks')
        .update({ ordem: currentBlock.ordem })
        .eq('id', swapBlock.id),
    ];

    const results = await Promise.all(updates);
    const hasError = results.some(r => r.error);

    if (hasError) {
      toast({
        title: 'Erro ao reordenar',
        variant: 'destructive',
      });
      return;
    }

    await fetchBlocks();
  };

  const toggleActive = async (blockId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    await updateBlock(blockId, { ativo: !block.ativo });
  };

  return {
    blocks,
    isLoading,
    error,
    fetchBlocks,
    createBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    toggleActive,
  };
}
