// ============================================
// MODULAR PAGE RENDERER
// ============================================
// This is the main component that renders content blocks dynamically.
// It's designed to be reusable across the entire application.

import { ContentBlock, BlockContextType } from '@/types/modular';
import { useContentBlocks } from '@/hooks/useContentBlocks';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

import {
  RichTextBlock,
  ImageBlock,
  VideoBlock,
  AudioBlock,
  AIChatBlock,
  CTAButtonBlock,
} from './blocks';

interface ModularPageRendererProps {
  contextType: BlockContextType;
  contextId: string;
  contextData?: Record<string, unknown>;
  className?: string;
  blockSpacing?: 'sm' | 'md' | 'lg' | 'xl';
  showLoading?: boolean;
  fallback?: React.ReactNode;
  onBlockAction?: (action: string, data?: unknown) => void;
}

const spacingClasses = {
  sm: 'space-y-4',
  md: 'space-y-8',
  lg: 'space-y-12',
  xl: 'space-y-16',
};

export function ModularPageRenderer({
  contextType,
  contextId,
  contextData,
  className,
  blockSpacing = 'lg',
  showLoading = true,
  fallback,
  onBlockAction,
}: ModularPageRendererProps) {
  const { blocks, isLoading, error } = useContentBlocks({
    contextType,
    contextId,
    enabled: !!contextId,
  });

  if (isLoading && showLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Erro ao carregar conteúdo.</p>
      </div>
    );
  }

  if (blocks.length === 0) {
    return fallback ? <>{fallback}</> : null;
  }

  return (
    <div className={cn(spacingClasses[blockSpacing], className)}>
      {blocks.map((block) => (
        <BlockRenderer
          key={block.id}
          block={block}
          contextData={contextData}
          onAction={onBlockAction}
        />
      ))}
    </div>
  );
}

// Internal block renderer
interface BlockRendererProps {
  block: ContentBlock;
  contextData?: Record<string, unknown>;
  onAction?: (action: string, data?: unknown) => void;
}

function BlockRenderer({ block, contextData, onAction }: BlockRendererProps) {
  switch (block.blockType) {
    case 'rich_text':
      return <RichTextBlock block={block} />;
    case 'image':
      return <ImageBlock block={block} />;
    case 'video':
      return <VideoBlock block={block} />;
    case 'audio':
      return <AudioBlock block={block} />;
    case 'ai_chat':
      return <AIChatBlock block={block} contextData={contextData} />;
    case 'cta_button':
      return <CTAButtonBlock block={block} onAction={onAction} />;
    default:
      console.warn(`Unknown block type: ${block.blockType}`);
      return null;
  }
}

// Export for external use
export { BlockRenderer };
